const express=require("express")
const app=express()
const bodyParser=require('body-parser')
const mongoose=require("mongoose")

const { routerUser } = require("./Routes/userRoute")
const { routerProduit } = require("./Routes/formationRoute")
const { routerContact } = require("./Routes/contactRoute")
const {routerServerMail} = require("./Routes/serverMail")
const {routerEtudiantFormation} = require("./Routes/etudiantformationRoute")
const {routerEtudiantEvent} = require("./Routes/etudianteventRoute")
const {routerCentreFormation} = require("./Routes/centreformationRoute")
const {routerEvent} = require("./Routes/eventRoute")

const {routerCategorie} = require("./Routes/categorieRoute")

const cors=require('cors')


/*mongoose.connect("mongodb://localhost/formationBD",{ useUnifiedTopology: true,useNewUrlParser: true })
.then(console.log("connected to mongodb"))
.catch(err=>console.log(err))
*/

mongoose.connect("mongodb://127.0.0.1:27017/formation",{ useUnifiedTopology: true,useNewUrlParser: true })
.then(console.log("connected to mongodb"))
.catch(err=>console.log(err))

app.use(express.json())

app.use(cors())

app.use('/user',routerUser)
app.use('/produit',routerProduit)
app.use('/contact',routerContact)
app.use('/email',routerServerMail)
app.use('/etudiantFormation',routerEtudiantFormation)

app.use('/etudiantEvent',routerEtudiantEvent)

app.use('/centreFormation',routerCentreFormation)
app.use('/event',routerEvent)
app.use('/categorie',routerCategorie)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('uploads'));
app.use(express.static('sliderAccueil'));

app.use('/uploads', express.static(__dirname + '/uploads/'));
app.use('/sliderAccueil', express.static(__dirname + '/sliderAccueil/'));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("server conected to port 3000")
})
