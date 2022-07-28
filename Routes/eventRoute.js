const {Event, validateEvent, validateEventSansCompte} =require('../Models/EventModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');



router.post('/newEvent', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const {error}=validateEvent(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const nbr = await Event.count({});
    const num = nbr + 1;
    
    const event=new Event({
        num:num,
        isOpen:0,
        nomFormateur:req.body.nomFormateur,
        imageFormateur:req.body.imageFormateur,
     
        adresse:req.body.adresse,
        telephone:req.body.telephone,
        email:req.body.email,
     
        timeDepart:req.body.timeDepart,
        timeEnd:req.body.timeEnd,
     
        date:req.body.date,
        
        specialites:req.body.specialites,
     
        titre1:req.body.titre1,
        titre2:req.body.titre2,
       
        descriptions:req.body.descriptions,

        image:req.body.image
 
    },)

    const result=await event.save()
    return res.send({status:true,resultat:result})
})


router.post('/updateEvent/:id', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const {error}=validateEvent(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const result = await Event.findOneAndUpdate({_id:req.params.id},{
        nomFormateur:req.body.nomFormateur,
        imageFormateur:req.body.imageFormateur,
     
        adresse:req.body.adresse,
        telephone:req.body.telephone,
        email:req.body.email,
     
        timeDepart:req.body.timeDepart,
        timeEnd:req.body.timeEnd,
     
        date:req.body.date,
        
        specialites:req.body.specialites,
     
        titre1:req.body.titre1,
        titre2:req.body.titre2,
       
        descriptions:req.body.descriptions,

        image:req.body.image
    },)

    return res.send({status:true,resultat:result})
})

router.get('/getById/:id', async(req,res)=>{
  
    const result = await Event.findOne({_id:req.params.id})

    return res.send({status:true,resultat:result})

})

router.get('/deleteEvent/:id', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    console.log(req.params.id)
   
   
    if(await Event.findOneAndDelete({_id:req.params.id})){
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



router.get('/Events', async(req,res)=>{
  
    const result=await Event.find({})
    return res.send({status:true,resultat:result})
    
})



router.post('/changeIsOpen', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const result=await Event.findByIdAndUpdate(req.body.idEvent,{isOpen:"1"})
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

module.exports.routerEvent=router