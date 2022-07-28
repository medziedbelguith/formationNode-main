const {EtudiantFormation, validateInscription} =require('../Models/etudiantformationModel')
const {Formation,validateFormation, validateFormationsCategories, validateFormationsPagination} =require('../Models/formationModel')

const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');


router.post('/newInscription/:id', verifytoken, async(req,res)=>{
    
    if(req.user.user.role != "Etudiant") return res.status(401).send({status:false})
   
    let nbrInscription = await EtudiantFormation.count({idEtudiant:req.user.user.id, idFormation:req.params.id});
    if(nbrInscription != 0) return res.status(401).send({status:false}) 

    const formation = await Formation.findById(req.params.id)
    if(!formation) return res.status(401).send({status:false}) 

    const result2 = await Formation.findOneAndUpdate({_id:req.params.id},{
        nbrParticipant:formation.nbrParticipant+1
    })

    const nbr = await EtudiantFormation.count({});
    const num = nbr + 1;
    
    const etudiantFormation=new EtudiantFormation({
        num:num,
        idEtudiant:req.user.user.id,
        idFormation:formation._id,
        etat:0,
        isNewAdmin:1,
        niveauEtudiant:0,
        reponses:[]
    },)

    const result = await etudiantFormation.save()

    return res.send({status:true,resultat:result})
})



router.get('/getCondidature/:id', verifytoken, async(req,res)=>{
    
    if(req.user.user.role != "Etudiant") return res.status(401).send({status:false})
   
    let inscriptions = await EtudiantFormation.find({idEtudiant:req.user.user.id, idFormation:req.params.id});
    if(inscriptions.length == 0) return res.status(401).send({status:false}) 

    return res.send({status:true,resultat:inscriptions[0]})

})


router.get('/list', async(req,res)=>{
    
    const result = await EtudiantFormation.find({})

    return res.send({status:true,resultat:result})
})

router.post('/listInscriptions/:id', verifytoken, async(req,res)=>{
    
    const options = {
        page: req.body.page,
        limit: 20,
        customLabels: myCustomLabels,
        populate: 'idEtudiant',
        sort:{
           createdAt: -1 
        }
    };

    const result = await EtudiantFormation.paginate({idFormation:req.params.id, etat:0}, options);

    return res.send({status:true,resultat:result})
})

router.post('/listEtudiants/:id', verifytoken, async(req,res)=>{
    
    const options = {
        page: req.body.page,
        limit: 20,
        customLabels: myCustomLabels,
        populate: 'idEtudiant',
        sort:{
           createdAt: -1 
        }
    };

    const result = await EtudiantFormation.paginate({idFormation:req.params.id, etat:1}, options);

    return res.send({status:true,resultat:result})
})


router.post('/listInscriptionsEtudiant/:id', verifytoken, async(req,res)=>{
    
    const options = {
        page: req.body.page,
        limit: 20,
        customLabels: myCustomLabels,
        populate: 'idFormation',
        sort:{
           createdAt: -1 
        }
    };

    const result = await EtudiantFormation.paginate({idEtudiant:req.params.id, etat:0}, options);

    return res.send({status:true,resultat:result})
})


router.post('/listFormationsEtudiant/:id', verifytoken, async(req,res)=>{
    
    const options = {
        page: req.body.page,
        limit: 20,
        customLabels: myCustomLabels,
        populate: 'idFormation',
        sort:{
           createdAt: -1 
        }
    };

    const result = await EtudiantFormation.paginate({idEtudiant:req.params.id, etat:1}, options);

    return res.send({status:true,resultat:result})
})



router.post('/activerEtudiant/:id', verifytoken, async(req,res)=>{
    
    
    const result = await EtudiantFormation.findByIdAndUpdate(req.params.id,{
        etat:1
    })

    return res.send({status:true,resultat:result})
})

router.post('/desctiveEtudiant/:id', verifytoken, async(req,res)=>{
    
    
    const result = await EtudiantFormation.findByIdAndUpdate(req.params.id,{
        etat:0
    })

    return res.send({status:true,resultat:result})
})

router.get('/Deletelist', async(req,res)=>{
    
   await EtudiantFormation.deleteMany();

    return res.send({status:true})
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

module.exports.routerEtudiantFormation=router