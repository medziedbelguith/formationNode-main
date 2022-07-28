const {CentreFormation, validateCentreFormation, validateCentreFormationSansCompte} =require('../Models/CentreFormationModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');



router.post('/newCentreFormation', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const {error}=validateCentreFormation(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const nbr = await CentreFormation.count({});
    const num = nbr + 1;
    
    const centreFormation=new CentreFormation({
        num:num,
        isOpen:0,
        nom:req.body.nom,
        email:req.body.email,
        telephone:req.body.telephone,
        description:req.body.description,
        adresse:req.body.adresse,
        specialites:req.body.specialites,
        image:req.body.image
    },)

    const result=await centreFormation.save()
    return res.send({status:true,resultat:result})
})


router.post('/updateCentreFormation/:id', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const {error}=validateCentreFormation(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const result = await CentreFormation.findOneAndUpdate({_id:req.params.id},{
        nom:req.body.nom,
        email:req.body.email,
        telephone:req.body.telephone,
        description:req.body.description,
        adresse:req.body.adresse,
        specialites:req.body.specialites,
        image:req.body.image
    },)

    return res.send({status:true,resultat:result})
})

router.get('/getById/:id', async(req,res)=>{
  
    console.log(req.params.id)
    const result = await CentreFormation.findOne({_id:req.params.id})

    return res.send({status:true,resultat:result})

})

router.get('/deleteCentreFormation/:id', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    console.log(req.params.id)
   
   
    if(await CentreFormation.findOneAndDelete({_id:req.params.id})){
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



router.post('/CentreFormations', async(req,res)=>{
  
   
    const options = {
        page: req.body.page,
        limit: req.body.limit,
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            createdAt: -1 
        }
    };

    const result=await CentreFormation.find({})
    return res.send({status:true,resultat:result})
    
})



router.post('/changeIsOpen', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const result=await CentreFormation.findByIdAndUpdate(req.body.idCentreFormation,{isOpen:"1"})
    return res.send({status:true,resultat:result})
    
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
     res.sendStatus(401);
  }

}

module.exports.routerCentreFormation=router