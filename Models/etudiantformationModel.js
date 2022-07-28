const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

//0 inscription
//1 activé
const schemaEtudiantFormation=mongoose.Schema({
    num:{type:Number,default: 0},
    idEtudiant:{type: Schema.Types.ObjectId, ref: "User"},
    idFormation:{type: Schema.Types.ObjectId, ref: "Formation"},
    etat:{type:Number,default: 0},
    isNewAdmin:{type:Number,default: 0},
    niveauEtudiant:{type:Number,default: 0},
    telephone:{type:String,default: ""},
    reponses:[
        {
           
            reponsePdf:{type:String,default: ""},
            message:{type:String,default: ""},
            correctionPdf:{type:String,default: ""},
            etat:{type:Number,default: 0},
           
        }
    ]

},
{ timestamps: true }
)

schemaEtudiantFormation.plugin(mongoosePaginate);

schemaEtudiantFormation.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const EtudiantFormation = mongoose.model('EtudiantFormation',schemaEtudiantFormation)


function validateInscription(Inscriptiont){
    
    let schema = Joi.object().keys({
        idFormation:Joi.string().allow('', null),
    })
      
    return schema.validate(Inscription)
}



module.exports.EtudiantFormation=EtudiantFormation
module.exports.validateInscription=validateInscription
