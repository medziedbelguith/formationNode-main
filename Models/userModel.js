const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const schemaUser=mongoose.Schema({
    
       nom: {type: String, default: ""},
       num: {type:Number,default: 0},
       prenom: {type: String, default: ""},
       password: {type: String, default: ""},
       email: {type: String, default: "", unique: true},
       telephone: {type: String, default: ""},
       adresse: {type: String, default: " "},
       ville: {type: String, default: " "},
       pays: {type: String, default: " "},
       role: {type: String, default: "client"},
       codePostal: {type: String, default: " "},
       company: {type: String, default: " "},
       codeForgotPassword: {type: String, default: ""},

       specialites: {type: String, default: " "},

       image: {type: String, default: " "},

       categories:[{
           categorie:{type:String, default: ""},
       }],

        formations:[{
           title:{type:String, default: ""},
           value:{type:String, default: ""},
        }],
        
        stages:[{
            title:{type:String, default: ""},
            value:{type:String, default: ""},
         }],
        
        experiences:[{
            title:{type:String, default: ""},
            value:{type:String, default: ""},
        }],

        isActive:{type:Number,default: 1},
       
    },
    {
         timestamps: true 
    },
)

schemaUser.plugin(mongoosePaginate);

  schemaUser.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });


const User=mongoose.model('User',schemaUser)


function validateFormateur(user){

    let itemExperience = Joi.object().keys({
        title:Joi.string().allow('', null),
        value:Joi.string().allow('', null),
    })

    let itemCategorie = Joi.object().keys({
        categorie:Joi.string().allow('', null),
    })
    
    const schema=Joi.object({
        nom: Joi.string().allow('', null),
        prenom: Joi.string().allow('', null),
        role: Joi.string().allow('', null),
        telephone: Joi.string().allow('', null),
        specialites: Joi.string().allow('', null),
        adresse: Joi.string().allow('', null),
        ville: Joi.string().allow('', null),
        pays: Joi.string().allow('', null),
       
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
        newEmail: Joi.string().email().allow('', null),
        newPassword: Joi.string().min(6).allow('', null),     
      
        codePostal: Joi.string().allow('', null),
        confirmePassword: Joi.string().allow('', null),
        company: Joi.string().allow('', null),
        image: Joi.string().allow('', null),
        categories:Joi.array().items(itemCategorie),
        experiences:Joi.array().items(itemExperience),
        stages:Joi.array().items(itemExperience),
        formations:Joi.array().items(itemExperience),
    })

    return schema.validate(user)
}

function validateUser(user){

    
    const schema=Joi.object({
    
        nom: Joi.string().allow('', null),
        prenom: Joi.string().allow('', null),
        role: Joi.string().allow('', null),
        telephone: Joi.string().allow('', null),
        adresse: Joi.string().allow('', null),
        ville: Joi.string().allow('', null),
        pays: Joi.string().allow('', null),
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
        codePostal: Joi.string().allow('', null),
        confirmePassword: Joi.string().allow('', null),
        company: Joi.string().allow('', null),
    })

    return schema.validate(user)
}

function validateUpdateUser(user){

    
    const schema1 = Joi.object({
        
        nom: Joi.string().allow('', null),
        prenom: Joi.string().allow('', null),
        telephone: Joi.string().allow('', null),
        adresse: Joi.string().allow('', null),
        ville: Joi.string().allow('', null),
        pays: Joi.string().allow('', null),
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
        newEmail: Joi.string().email().allow('', null),
        newPassword: Joi.string().min(6).allow('', null),     
        codePostal: Joi.string().allow('', null),
        company: Joi.string().allow('', null),

    })

    return schema1.validate(user)
}


function validateLogin(login){

    const schema2 = Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().min(6).required()
    })

    return schema2.validate(login)
}

function validateModifierMotPasse(request){

    const schema2 = Joi.object({
        email:Joi.string().required().email(),
        baseUrl:Joi.string().min(6).required()
    })

    return schema2.validate(request)
}

function validateNewPassowrd(request){

    const schema2 = Joi.object({
        code:Joi.string().min(6).required(),
        newPassword:Joi.string().min(6).required()
    })

    return schema2.validate(request)
}




module.exports.User=User
module.exports.validateFormateur=validateFormateur
module.exports.validateLogin=validateLogin
module.exports.validateUser=validateUser
module.exports.validateModifierMotPasse=validateModifierMotPasse
module.exports.validateNewPassowrd=validateNewPassowrd
module.exports.validateUpdateUser=validateUpdateUser
