
const fs = require('fs');
// utiliser le module express = mini serveur web
const express = require('express');
// récupère le composant Datastore du module ou librairie nedb
let Datastore = require('nedb');
//parser body en json
var bodyParser = require('body-parser');
// aller chercher mon fichier json
var users = require("./users.json");



// créer une application web.
const app = express();
// récupérer le module qui permet de faire et de définirles routes ou les paths des requêtes http.
const path = require('path');
const { stringify } = require('querystring');
const { fstat } = require('fs');
const { json } = require('express');
const { time } = require('console');

// Instancier un objet router pour définir les chemains (paths) des requêtes.
const router = express.Router();

//********* Configuration de mon application *************/

// configurer le backslash comme départ de la requete.
app.use('/', router);
// définir le port ou mon application va rouler
app.listen(process.env.port || 8083);
//l'application va résoudre toute les réponses ou objet envoyer (body) des requêtes http (post ou get) en json
app.use(bodyParser.urlencoded({extended: true}))

/*********  fin de la configuration  ***********/

// création de la bd
let database = new Datastore("donnation.db");
database.loadDatabase();

// présenter le html a partir de l'application
router.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));

});

app.post('/insertion', function(req, res){
    database.insert(
        {donneur: req.body}
    );

    //var jsonContent = fs.readFileSync("./users.json"); // Or direct path
    //var peuImporte = JSON.parse(jsonContent);
    //console.log(jsonContent.length());

    var testBool = false;

    for(let i = 0; i < users.length; i++)
    {
        console.log(users[i].Prenom);
        if(users[i].Prenom == req.body.Prenom)
        {
            testBool = true;
        }
    }

    if(testBool == false)
    {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
    
    
        var usersFile = require('./users.json'); // Lit le fichier et le convertit en fichier string
    
        toPush = new Object();
        toPush["fullName"] = req.body["fullName"];
        toPush["Prenom"] = req.body["Prenom"];
        toPush["Date"] = today;
        toPush["Montant"] = req.body["Montant"];
        toPush["city"] = req.body["city"];


    
        usersFile.push(toPush); // Insere req.body a la fin du fichier
        var temp = JSON.stringify(usersFile); // Convertit le fichier en fichier json
        fs.writeFile("./users.json", temp, (err) => { // Crée un nouveau fichier du nom de users.json avec le contenu temp
            if (err) throw err;
            console.log("New Data added");
        });    

        console.log("l'utilisateur vient d'insérer avec succes");
        res.send("l'utilisateur vient d'insérer avec succes");
    }
    else // == true
    {
        res.send("l'utilisateur existe deja, fak u");
    }


    //users.push(a);

});

app.post('/afficher', function(req, res){
    //afficher tout les données
    // database.find({}, function(err, data){
    //     if(err)
    //     {
    //         console.log(err);
    //         res.send(err);
    //         res.end();
    //         return;
    //     }
    //     console.log("affichage bd avec succes");
    //     res.json(data);
    // });

    // let nom = req.body.nomaff;


    // database.find({"donneur.fullName":nom}, function(err, data){
    //     if(err)
    //     {
    //         console.log(err);
    //         res.send(err);
    //         res.end();
    //         return;
    //     }
    //     console.log("affichage avec succes");
    //     res.json(data)
    // });
    
    let tab = [];
    console.log("avant func");
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].given_name.charAt(0).match("J"))
        {
            tab.push(users[i].given_name);
        }
    }
    
    res.send(tab);
    database.update();
});


console.log("Serveur roule sur l'IP suivante http://127.0.0.1:8083");
