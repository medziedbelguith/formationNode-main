const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const schemaContact=mongoose.Schema({
    
    nom:{type:String,default: ""},
    email:{type:String,default: ""},
    telephone:{type:String,default: ""},
    num:{type:Number,default: 0},
    isOpen:{type:Number,default: 0},
    message:{type:String,default: ""},
},
{ timestamps: true }
)

schemaContact.plugin(mongoosePaginate);

schemaContact.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Contact = mongoose.model('Contact',schemaContact)


function validateContact(contact){
    
    let schema = Joi.object().keys({
        nom:Joi.string().allow('', null),
        email:Joi.string().allow('', null),
        telephone:Joi.string().allow('', null),
        message:Joi.string().allow('', null),
    })
      
    return schema.validate(contact)
}



module.exports.Contact=Contact
module.exports.validateContact=validateContact
