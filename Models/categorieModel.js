const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const schemaCategorie=mongoose.Schema({
    
    nom:{type:String,default: ""},
    num:{type:Number,default: 0},
    image:{type:String,default: ""}
},
{ timestamps: true }
)

schemaCategorie.plugin(mongoosePaginate);

schemaCategorie.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Categorie = mongoose.model('Categorie',schemaCategorie)


function validateCategorie(categorie){
    
    let schema = Joi.object().keys({
        nom:Joi.string().allow('', null),
        image:Joi.string().allow('', null)
    })
      
    return schema.validate(categorie)
}



module.exports.Categorie=Categorie
module.exports.validateCategorie=validateCategorie
