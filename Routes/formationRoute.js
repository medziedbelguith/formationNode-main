const {Formation,validateFormation, validateFormationsCategories, validateFormationsPagination} =require('../Models/formationModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');
var dateFormat = require('dateformat');
const {User, validateDownloadData} =require('../Models/userModel')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage })

router.post('/upload',upload.array('myFiles'),async(req,res)=>{
    const files = req.files
    let arr=[];
    files.forEach(element => {
    
      arr.push(element.path)
 
    })
    return res.send(arr)
})


router.post('/newFormation',  verifytoken, async(req,res)=>{
    
    const {error}=validateFormation(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
   
    if(req.user.user.role != "Formateur") return res.status(401).send({status:false})
   
    const formateur = await User.findById(req.user.user.id);

    if(formateur.isActive == 0 && formateur.role !="admin"){
      return res.status(401).send({status:false})
    }

    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");

    const formation=new Formation({
        nom:req.body.nom,
        nomLower: req.body.nom.toLowerCase(),
        prixVente:req.body.prixVente,
        prixPromo:req.body.prixPromo,
        imagePrincipale:req.body.imagePrincipale,
        categories:req.body.categories,
        descriptionsDessus:req.body.descriptionsDessus,
        descriptionsDessous:req.body.descriptionsDessous,
        chapitres:req.body.chapitres,
        createdFormation:dateCurrent,
        formateur:req.user.user.id,
        nbrParticipant:0
    })
    
    const result=await formation.save()
    return res.send({status:true,resultat:result})
})


router.post('/modifierFormation/:id',  verifytoken, async(req,res)=>{
    
    const {error}=validateFormation(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    if(req.user.user.role != "Formateur" && req.user.user.role != "admin") return res.status(401).send({status:false})

    const formateur = await User.findById(req.user.user.id);

    if(formateur.isActive == 0 && formateur.role !="admin"){
      return res.status(401).send({status:false})
    }
    
    dateNow = dateFormat(new Date(), "yyyy-mm-dd HH:MM")
    
    const formation = await Formation.findById(req.params.id)

    if(!formation) return res.status(401).send({status:false}) 

    if(formation.formateur != req.user.user.id && req.user.user.role != "admin") return res.status(401).send({status:false})
    
    const result = await Formation.findOneAndUpdate({_id:req.params.id},{
  
      nom:req.body.nom,
      nomLower: req.body.nom.toLowerCase(),
      prixVente:req.body.prixVente,
      prixPromo:req.body.prixPromo,
      imagePrincipale:req.body.imagePrincipale,
      categories:req.body.categories,
      descriptionsDessus:req.body.descriptionsDessus,
      descriptionsDessous:req.body.descriptionsDessous,
      chapitres:req.body.chapitres,
      
    })

    const formation2 = await Formation.findById(req.params.id)
  
    return res.send({status:true,resultat:formation2})
})


router.post('/evaluationFormation/:id',  verifytoken, async(req,res)=>{
    
  const formation = await Formation.findById(req.params.id)

  if(!formation) return res.status(401).send({status:false}) 

  const result = await Formation.findOneAndUpdate({_id:req.params.id},{
    evaluations:req.body,
  })

  const formation2 = await Formation.findById(req.params.id)

  return res.send({status:true,resultat:formation2})
})


router.get('/deleteFormation/:id',  verifytoken, async(req,res)=>{
    
    if(req.user.user.role != "Formateur" && req.user.user.role != "admin") return res.status(401).send({status:false})

    const formateur = await User.findById(req.user.user.id);

    if(formateur.isActive == 0 && formateur.role !="admin"){
      return res.status(401).send({status:false})
    }

    const formation = await Formation.findById(req.params.id)
   
    if(!formation) return res.status(402).send({status:false}) 

    if(formation.formateur != req.user.user.id && req.user.user.role != "admin") return res.status(403).send({status:false})
    
    if(await Formation.findOneAndDelete({_id:req.params.id})){
        return res.send({status:true})
    }else{
        return res.send({status:false})
    }

})


const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'itemsList',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator'
};
 

router.post('/listFormation', async(req,res)=>{

  const {error}=validateFormationsCategories(req.body)
  if(error) return res.status(400).send({status:false,message:error.details[0].message})
  
  const options = {
    page: req.body.page,
    limit: Number(req.body.limitItems) ,
    customLabels: myCustomLabels,
    populate: 'formateur',
    sort:{
      createdAt: -1 
    }
  };

  var tabFilterGlobal = {}

  var filterCategories = []
  
  for(var i = 0; i < req.body.listCategories.length; i++){
    filterCategories.push({'categories.categorie':req.body.listCategories[i].categories});
  }

  if(filterCategories.length > 0){
    ok =true
    tabFilterGlobal = {$or : filterCategories}
  }

  const result=await  Formation.paginate(tabFilterGlobal, options) 
  
  return res.send({status:true,resultat:result, request:req.body})

})

router.post('/listFormationFormateur',  verifytoken, async(req,res)=>{
    
  if(req.user.user.role != "Formateur") return res.status(401).send({status:false})

  const {error}=validateFormationsCategories(req.body)
  if(error) return res.status(400).send({status:false,message:error.details[0].message})
  
  const options = {
    page: req.body.page,
    limit: Number(req.body.limitItems) ,
    customLabels: myCustomLabels,
    sort:{
      createdAt: -1 
    }
  };

  var tabFilterGlobal = {}

  var filterCategories = []
  
  for(var i = 0; i < req.body.listCategories.length; i++){
    filterCategories.push({'categories.categorie':req.body.listCategories[i].categories});
  }

  console.log(req.user.user.id);

  if(filterCategories.length > 0){
    ok =true
    tabFilterGlobal = {$or : filterCategories, formateur:req.user.user.id}
  }else{
    tabFilterGlobal = {formateur:req.user.user.id}
  }

  const result=await  Formation.paginate(tabFilterGlobal, options) 
  
  return res.send({status:true,resultat:result, request:req.body})

})

router.post('/recherche/:search', async(req,res)=>{
  
    
    if(req.params.search == undefined || req.params.search == "" ){
      return
    }
    
    const options = {
      page: req.body.page,
      limit: 25,
      customLabels: myCustomLabels,
      sort:{
        createdAt: -1 
      }
    };


    
   
    var word = req.params.search;
    var wordLowerCase = word.toLowerCase();
    
    var listFilter =[]
    listFilter.push({nomLower:{ $regex: '.*' + wordLowerCase + '.*' }})
    listFilter.push({'categories.categorie':{ $regex: '.*' + word + '.*' }})
    
    console.log(listFilter)

    const result=await Formation.paginate({$or:listFilter}, options) 
    return res.send({status:true,resultat:result}) 
    
})


router.get('/getById/:id', async(req,res)=>{

  if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})

  const formation = await Formation.findOne({_id:req.params.id})
  const formateur = await User.findOne({_id:formation.formateur})
  
  return res.send({status:true,resultat:formation, formateur:formateur}) 
  
})

router.get('/getById2/:id', async(req,res)=>{

  if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})

  const formateur = await User.findOne({_id:req.params.id})
 
  const formations = await Formation.find({formateur:formateur.id})
  
  return res.send({status:true,resultat:formations, formateur:formateur}) 
  
})




function verifytoken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  
  if(typeof bearerHeader !== 'undefined'){
 
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, 'secretkey', (err, authData) => {
          if(err){
              res.sendStatus(403);
          }else{
              req.user = authData;
              next();
          }
      });
  
  }else{
    console.log("etape100");
    res.sendStatus(401);
  }

}

module.exports.routerProduit=router
