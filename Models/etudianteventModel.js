const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

//0 inscription
//1 activé
const schemaEtudiantEvent=mongoose.Schema({
    num:{type:Number,default: 0},
    idEtudiant:{type: Schema.Types.ObjectId, ref: "User"},
    idEvent:{type: Schema.Types.ObjectId, ref: "Event"},
    etat:{type:Number,default: 0},
    isNewAdmin:{type:Number,default: 0},
    
},
{ timestamps: true }
)

schemaEtudiantEvent.plugin(mongoosePaginate);

schemaEtudiantEvent.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const EtudiantEvent = mongoose.model('EtudiantEvent',schemaEtudiantEvent)


function validateInscription(Inscriptiont){
    
    let schema = Joi.object().keys({
        idEvent:Joi.string().allow('', null),
    })
      
    return schema.validate(Inscription)
}



module.exports.EtudiantEvent=EtudiantEvent
module.exports.validateInscription=validateInscription
