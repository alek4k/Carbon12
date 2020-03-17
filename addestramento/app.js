const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const mime = require('mime');
const express = require('express');
const rwpredittore = require('./r_w_predittore')

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const PORT = 8080;
const FILE_VERSION = "0";
const TRAIN_VERSION = "0.0.0";
const PLUGIN_VERSION = "0.0.0";

let router = express.Router();

let model;
let sources;

router.get('/', function (request, response) {
    response.render('addestramento');
});

router.post('/fileupload', function (request, response) {
    let form = new formidable.IncomingForm();
    uploadForm(request, response, form);
});

router.get('/downloadPredittore', function (request, response) {
    response.render('downloadPredittore', {model, sources});
});

router.post('/downloadFile', function (request, response) {
    downloadPredittore(request, response);
});

app.use('/', router);

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
});

const SVM = require("./models/svm/svm.js");
const RL = require("./models/rl/regression.js");

/* @todo
* aggiungere la creazione della svm e rl a partire da una configurazione data usando fromJSON
*/
//funzione di addestramento della SVM
function trainSVM(data, labels) {

    let options = {
        kernel: "linear",
        karpathy: true,
    };

    let svm = new SVM();
    console.log("svm creata");

    svm.train(data, labels, options);
    console.log("svm train");
    let json = svm.toJSON();
    console.log("predittore creato");
    console.log(json);
    return json;
}

//funzione di addestramento della RL
// x numero data entry
function trainRL(data,labels,x){
  console.log('x'+x);
  let reg = new RL({ numX: x, numY: 1 });
  reg.train(data,labels);
  console.log(reg.calculate())
  let json = reg.toJSON();
  console.log(json);
  return json;
}


//funzione per gestire dati in input nella form
function uploadForm(req, res, form) {
    form.parse(req, function (err, fields, files) {
        model = fields.modello;
        //dir temporanea dove è salvato il file csv addestramento
        let pathTrainFile = files.trainFile.path;
        //dir temporanea dove è salvato il file json config
        let pathConfigFile = files.configFile.path;

        /* @todo
        * aggiungere la lettura dei parametri del predittore caricato per verificare la validità
        * controllare che le data entry coincidano con quelle nel csv e
        * controllare che il modello coincida con quello scelto
        */
        let configPresence = false;
        if (configPresence) {
            let manage_predittore = new rwpredittore(pathPredittore);
            let title = manage_predittore.getTitle();
            //aggiungere controllo titolo, versione, data entry
            let config = manage_predittore.getConfiguration();
            //config va passata alla creazione della SVM
        }

        /* @todo
        * chiamata a trainSVM o trainRL
        */
        if (model === 'SVM') {
            //chiamata function addestramento SVM
            console.log("support");
        } else {
            //chiamata function addestramento RL
            console.log("regression");
        }

        const csvr = require('./csv_reader.js');
        let csvreader = new csvr(pathTrainFile);

        //dati addestramento SVM
        data = csvreader.autoGetData();
        labels = csvreader.autoGetLabel();

        let strPredittore = addestramento(data, labels);
        console.log("addestramento terminato");

        //elenco sorgenti
        sources = csvreader.getDataSource().toString();
        /*
        * @todo aggiungere lettura note
        */
        let note = "";

        //salvataggio predittore
        let manage_predittore = new rwpredittore();
        manage_predittore.setHeader(PLUGIN_VERSION, TRAIN_VERSION);
        manage_predittore.setNotes(note);
        manage_predittore.setDataEntry(csvreader.getDataSource(), csvreader.countSource());
        manage_predittore.setModel(model);
        manage_predittore.setFileVersion(FILE_VERSION);
        manage_predittore.setConfiguration(strPredittore);
        fs.writeFileSync('predittore.json', manage_predittore.save());



        //redirect alla pagina di download
        res.writeHead(301, {'Location': 'downloadPredittore'});
        return res.end();
    });
}

function downloadPredittore(req, res) {
    let file = __dirname + '/predittore.json';

    let filename = path.basename(file);
    let mimetype = mime.getType(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    let filestream = fs.createReadStream(file);
    filestream.pipe(res);
}
