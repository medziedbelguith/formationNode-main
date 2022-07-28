const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const schemaCentreFormation=mongoose.Schema({
    
    nom:{type:String,default: ""},
    email:{type:String,default: ""},
    adresse:{type:String,default: ""},
    telephone:{type:String,default: ""},
    num:{type:Number,default: 0},
    isOpen:{type:Number,default: 0},
    specialites:{type:String,default: ""},
    description:{type:String,default: ""},
    image:{type:String,default: ""}
},
{ timestamps: true }
)

schemaCentreFormation.plugin(mongoosePaginate);

schemaCentreFormation.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const CentreFormation = mongoose.model('CentreFormation',schemaCentreFormation)


function validateCentreFormation(centreFormation){
    
    let schema = Joi.object().keys({
        nom:Joi.string().allow('', null),
        email:Joi.string().allow('', null),
        telephone:Joi.string().allow('', null),
        adresse:Joi.string().allow('', null),
        specialites:Joi.string().allow('', null),
        description:Joi.string().allow('', null),
        image:Joi.string().allow('', null)
    })
      
    return schema.validate(centreFormation)
}



module.exports.CentreFormation=CentreFormation
module.exports.validateCentreFormation=validateCentreFormation
