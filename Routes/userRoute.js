const {User, validateFormateur, validateNewPassowrd, validateLogin, validateUser, validateUpdateUser} =require('../Models/userModel')
const {Formation,validateFormation, validateFormationsCategories, validateFormationsPagination} =require('../Models/formationModel')

const express=require('express')
const router=express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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


router.post('/registerFormateur',async(req,res)=>{
    
    const {error}=validateFormateur(req.body)
    if(error) return res.send({status:false,message:error.details[0].message})

    const emailExist = await User.findOne({ email: req.body.email});
    if(emailExist) return res.send({status:false,message:'errorRegister'})

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    let role = req.body.role;

    const nbr = await User.count({});
    const num = nbr + 1;

    const user=new User({
        nom:req.body.nom,
        num:num,
        specialites:req.body.specialites,
        prenom:req.body.prenom,
        telephone:req.body.telephone,
        adresse:req.body.adresse,
        role:role,
        prenom:req.body.prenom,
        email:req.body.email,
        password: hashPassword,
        ville: req.body.ville,
        pays: req.body.pays,
        codePostal: req.body.codePostal,
        company: req.body.company,
        image:req.body.image,
        categories:req.body.categories,
        formations:req.body.formations,
        stages:req.body.stages,
        experiences:req.body.experiences
    })

    const result=await user.save()

    return res.send({status:true,resultat:result})
})

router.post('/updateFormateur', verifytoken, async(req,res)=>{

    const {error}=validateFormateur(req.body)
    if(error) return res.send({status:false,message:error.details[0].message})

    if(req.body.email != req.user.user.email){
        return res.send({status:false,message:'errorUpdateCompte1'});
    }

    const users = await User.find({email:req.body.email})
    const user = users[0]
    const newUser = user

    if(users.length == 0) return res.send({status:false,message:'errorUpdateCompte1'});
    
    if(req.body.newEmail != null && req.body.newEmail != ""){
        const users2 = await User.find({email:req.body.newEmail})
        if(users2.length > 0 && req.body.email != req.body.newEmail) return res.send({status:false,message:'errorUpdateCompte2'});
        newUser.email = req.body.newEmail
    }

    const validationPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validationPassword) return res.send({status:false, message:'errorUpdateCompte3'});
    
    if(req.body.newPassword != null && req.body.newPassword != ""){
       var hashPassword = ""
       const salt = await bcrypt.genSalt(10);
       hashPassword = await bcrypt.hash(req.body.newPassword, salt);
       newUser.password = hashPassword

    }

    const result = await User.findByIdAndUpdate(req.user.user.id,{
        nom:req.body.nom,
        prenom:req.body.prenom,
        telephone:req.body.telephone,
        specialites:req.body.specialites,
        adresse:req.body.adresse,
        prenom:req.body.prenom,
        email:newUser.email,
        password: newUser.password,
        ville: req.body.ville,
        pays: req.body.pays,
        codePostal: req.body.codePostal,
        company: req.body.company,
        image:req.body.image,
        categories:req.body.categories,
        formations:req.body.formations,
        stages:req.body.stages,
        experiences:req.body.experiences
    })
        
    return res.send({status:true,resultat:result})

})

router.post('/register',async(req,res)=>{
    
    const {error}=validateUser(req.body)
    if(error) return res.send({status:false,message:error.details[0].message})

    const emailExist = await User.findOne({ email: req.body.email});
    if(emailExist) return res.send({status:false,message:'errorRegister'})

    let isActive = 1; 

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    let role = req.body.role;

    if (role == "Formateur"){
        isActive = 0;
    }

    const admin = await User.findOne({ role: 'admin'});
    
    if (admin == null){
        role = "admin"
    }

    const nbr = await User.count({});
    const num = nbr + 1;

    const user=new User({
        nom:req.body.nom,
        num:num,
        prenom:req.body.prenom,
        telephone:req.body.telephone,
        adresse:req.body.adresse,
        role:role,
        prenom:req.body.prenom,
        email:req.body.email,
        password: hashPassword,
        ville: req.body.ville,
        pays: req.body.pays,
        codePostal: req.body.codePostal,
        company: req.body.company,
        isActive:isActive,
    })

    const result=await user.save()

    return res.send({status:true,resultat:result})
})


router.post('/login',async(req,res)=>{
   
    const {error}=validateLogin(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.send({status:false, message:'errorLogin'});

  
    if(user.isActive == 0 && user.role !="admin"){
        return res.send({status:false, message:'errorLogin2'});
    }
    

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.send({status:false, message:'errorLogin'})    

    if(user.codeForgotPassword.length > 1){
        const result = await User.findByIdAndUpdate(user.id,{
            codeForgotPassword: ""
        })
    }

    jwt.sign({user}, 'secretkey', (err, token) => {
        res.json({status:true, email: user.email, token:token, role: user.role, id:user.id});
    });

})

router.post('/newPassword',async(req,res)=>{
   
    const {error}=validateNewPassowrd(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    if(req.body.code.length < 10){
        return res.send({status:false});
    }

    const user = await User.findOne({codeForgotPassword: req.body.code});
    if(user == null) return res.send({status:false});

    var hashPassword = ""
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(req.body.newPassword, salt);
     
    const result = await User.findByIdAndUpdate(user.id,{
        password: hashPassword,
        codeForgotPassword: ""
    })
         
     return res.send({status:true})
})


router.get('/detailsAdmin/:id', verifytoken, async(req,res)=>{
  
    if(!req.params.id && req.user.user.role != "admin")
    return res.status(400).json('articleId expected');
    
    const result=await User.findById(req.params.id)
    result.password = ""
    return res.send({status:true,resultat:result})
})


router.get('/details', verifytoken, async(req,res)=>{
  const result = await User.findById(req.user.user.id)
  result.password = ""
  return res.send({status:true,resultat:result})
})


router.post('/update', verifytoken, async(req,res)=>{

    const {error}=validateUpdateUser(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})

    

    if(req.body.email != req.user.user.email){
        return res.send({status:false,message:'errorUpdateCompte1'});
    }

    const users = await User.find({email:req.body.email})
    const user = users[0]
    const newUser = user


    if(users.length == 0) return res.send({status:false,message:'errorUpdateCompte1'});
    
    if(req.body.newEmail != null && req.body.newEmail != ""){
        const users2 = await User.find({email:req.body.newEmail})
        if(users2.length > 0 && req.body.email != req.body.newEmail) return res.send({status:false,message:'errorUpdateCompte2'});
        newUser.email = req.body.newEmail
    }

    const validationPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validationPassword) return res.send({status:false, message:'errorUpdateCompte3'});
    
    if(req.body.newPassword != null && req.body.newPassword != ""){
       var hashPassword = ""
       const salt = await bcrypt.genSalt(10);
       hashPassword = await bcrypt.hash(req.body.newPassword, salt);
       newUser.password = hashPassword
    }

    const result = await User.findByIdAndUpdate(req.user.user.id,{
        nom:req.body.nom,
        prenom:req.body.prenom,
        telephone:req.body.telephone,
        adresse:req.body.adresse,
        prenom:req.body.prenom,
        ville: req.body.ville,
        pays: req.body.pays,
        email:newUser.email,
        password: newUser.password,
        codePostal: req.body.codePostal,
        company: req.body.company,
    })
        
    return res.send({status:true,resultat:result})

 
})


router.post('/ActiveFormateur/:id/:active', async(req,res)=>{
    
    const result = await User.findByIdAndUpdate(req.params.id,{
       isActive:req.params.active,  
    })
    
    return res.send({status:true,resultat:result, request:req.body})
  
})



router.post('/listesClients', verifytoken, async(req,res)=>{

    const options = {
        page: req.body.page,
        limit: req.body.limit,
        customLabels: myCustomLabels,
        sort:{
            createdAt: -1 
        }
    };
    
    if(req.user.user.role != "admin"){
      return res.send({status:false})
    }
    const result=await User.paginate({role:"client"}, options)
    
    return res.send({status:true,resultat:result})
})

  
router.post('/etudiants', async(req,res)=>{
    
  
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
  
    if(filterCategories.length > 0){
      ok =true
      tabFilterGlobal = {role: "Etudiant", $or : filterCategories}
    }else{
      tabFilterGlobal = {role: "Etudiant"}
    }
  
    const result=await  User.paginate(tabFilterGlobal, options) 
    
    return res.send({status:true,resultat:result, request:req.body})
  
})


router.post('/formateurs', async(req,res)=>{
    
  
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
  
   
    const result=await  User.paginate({role:"Formateur"}, options) 
    
    return res.send({status:true,resultat:result, request:req.body})
  
})

router.get('/deleteUser/:id',  verifytoken, async(req,res)=>{
    
    if(req.user.user.role != "admin") return res.status(401).send({status:false})

  
    if(await User.findOneAndDelete({_id:req.params.id})){
        return res.send({status:true})
    }else{
        return res.send({status:false})
    }

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

module.exports.verifytoken=verifytoken
module.exports.routerUser=router
