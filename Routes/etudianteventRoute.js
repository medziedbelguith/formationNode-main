const {EtudiantEvent, validateInscription} =require('../Models/etudianteventModel')
const {Event,validateEvent, validateEventsCategories, validateEventsPagination} =require('../Models/EventModel')

const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');


router.post('/newInscription/:id', verifytoken, async(req,res)=>{
    
    if(req.user.user.role != "Etudiant") return res.status(401).send({status:false})
   
    let nbrInscription = await EtudiantEvent.count({idEtudiant:req.user.user.id, idEvent:req.params.id});
    if(nbrInscription != 0) return res.status(401).send({status:false}) 

    const event = await Event.findById(req.params.id)
    if(!event) return res.status(401).send({status:false}) 

    const result2 = await Event.findOneAndUpdate({_id:req.params.id},{
        nbrParticipant:event.nbrParticipant+1
    })

    const nbr = await EtudiantEvent.count({});
    const num = nbr + 1;
    
    const etudiantEvent=new EtudiantEvent({
        num:num,
        idEtudiant:req.user.user.id,
        idEvent:event._id,
        etat:0,
        isNewAdmin:1,
        niveauEtudiant:0,
        reponses:[]
    },)

    const result = await etudiantEvent.save()

    return res.send({status:true,resultat:result})
})



router.get('/getCondidature/:id', verifytoken, async(req,res)=>{
    
    if(req.user.user.role != "Etudiant") return res.status(401).send({status:false})
   
    let inscriptions = await EtudiantEvent.find({idEtudiant:req.user.user.id, idEvent:req.params.id});
    if(inscriptions.length == 0) return res.status(401).send({status:false}) 

    return res.send({status:true,resultat:inscriptions[0]})

})


router.get('/list', async(req,res)=>{
    
    const result = await EtudiantEvent.find({})

    return res.send({status:true,resultat:result})
})

router.post('/all/:id', verifytoken, async(req,res)=>{
    
    const options = {
        page: req.body.page,
        limit: 20,
        customLabels: myCustomLabels,
        populate: 'idEtudiant',
        sort:{
           createdAt: -1 
        }
    };

    const result = await EtudiantEvent.paginate({idEvent:req.params.id}, options);

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

    const result = await EtudiantEvent.paginate({idEvent:req.params.id, etat:0}, options);

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

    const result = await EtudiantEvent.paginate({idEvent:req.params.id, etat:1}, options);

    return res.send({status:true,resultat:result})
})


router.post('/listInscriptionsEtudiant/:id', verifytoken, async(req,res)=>{
    
    const options = {
        page: req.body.page,
        limit: 20,
        customLabels: myCustomLabels,
        populate: 'idEvent',
        sort:{
           createdAt: -1 
        }
    };

    const result = await EtudiantEvent.paginate({idEtudiant:req.params.id, etat:0}, options);

    return res.send({status:true,resultat:result})
})


router.post('/listEventsEtudiant/:id', verifytoken, async(req,res)=>{
    
    const options = {
        page: req.body.page,
        limit: 20,
        customLabels: myCustomLabels,
        populate: 'idEvent',
        sort:{
           createdAt: -1 
        }
    };

    const result = await EtudiantEvent.paginate({idEtudiant:req.params.id, etat:1}, options);

    return res.send({status:true,resultat:result})
})



router.post('/activerEtudiant/:id', verifytoken, async(req,res)=>{
    
    
    const result = await EtudiantEvent.findByIdAndUpdate(req.params.id,{
        etat:1
    })

    return res.send({status:true,resultat:result})
})

router.post('/desctiveEtudiant/:id', verifytoken, async(req,res)=>{
    
    
    const result = await EtudiantEvent.findByIdAndUpdate(req.params.id,{
        etat:0
    })

    return res.send({status:true,resultat:result})
})

router.get('/Deletelist', async(req,res)=>{
    
   await EtudiantEvent.deleteMany();

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

module.exports.routerEtudiantEvent=router