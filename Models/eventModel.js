const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const schemaEvent=mongoose.Schema({
    
    nomFormateur:{type:String,default: ""},
    imageFormateur:{type:String,default: ""},
 
    adresse:{type:String,default: ""},
    telephone:{type:String,default: ""},
    email:{type:String,default: ""},
 
    timeDepart:{type:String,default: ""},
    timeEnd:{type:String,default: ""},
 
    date:{type:String,default: ""},
    
    num:{type:Number,default: 0},
    isOpen:{type:Number,default: 0},
 
    specialites:{type:String,default: ""},
 
    titre1:{type:String,default: ""},
    titre2:{type:String,default: ""},
   
    descriptions:[{
        ligne:{type:String, default: ""},
    }],

    image:{type:String,default: ""}
 
},
{ timestamps: true }
)

schemaEvent.plugin(mongoosePaginate);

schemaEvent.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Event = mongoose.model('Event',schemaEvent)


function validateEvent(event){

    let itemDescription = Joi.object().keys({
        ligne:Joi.string().allow('', null),
    })
    
    let schema = Joi.object().keys({
        nomFormateur:Joi.string().allow('', null),
        imageFormateur:Joi.string().allow('', null),
     
        adresse:Joi.string().allow('', null),
        telephone:Joi.string().allow('', null),
        email:Joi.string().allow('', null),
     
        timeDepart:Joi.string().allow('', null),
        timeEnd:Joi.string().allow('', null),
     
        date:Joi.string().allow('', null),
        
     
        specialites:Joi.string().allow('', null),
     
        titre1:Joi.string().allow('', null),
        titre2:Joi.string().allow('', null),
       
        descriptions:Joi.array().items(itemDescription),
    
        image:Joi.string().allow('', null),
     
    
    })
      
    return schema.validate(event)
}



module.exports.Event=Event
module.exports.validateEvent=validateEvent
