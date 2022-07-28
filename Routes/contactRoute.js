const {Contact, validateContact, validateContactSansCompte} =require('../Models/contactModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');



router.post('/newContact', async(req,res)=>{
    
    const {error}=validateContact(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const nbr = await Contact.count({});
    const num = nbr + 1;
    
    const contact=new Contact({
        num:num,
        isOpen:0,
        nom:req.body.nom,
        email:req.body.email,
        telephone:req.body.telephone,
        message:req.body.message,

    },)

    const result=await contact.save()
    return res.send({status:true,resultat:result})
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



router.post('/Contacts', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin" ) return res.status(400).send({status:false})

    const options = {
        page: req.body.page,
        limit: req.body.limit,
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            createdAt: -1 
        }
    };

    const result=await Contact.paginate({}, options)
    return res.send({status:true,resultat:result})
    
})



router.post('/changeIsOpen', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const result=await Contact.findByIdAndUpdate(req.body.idContact,{isOpen:"1"})
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

module.exports.routerContact=router