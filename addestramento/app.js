let http = require('http');
let fs = require('fs');
let formidable = require('formidable');
let path = require('path');
let mime = require('mime');
const modules = require("ml-modules");
let express = require('express');
const rwpredittore = require('./r_w_predittore')

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const PORT = 8080;

let router = express.Router();

let model;

router.get('/', function (request, response) {
  response.render('addestramento');
});

router.post('/fileupload', function (request, response) {
  let form = new formidable.IncomingForm();
  uploadForm(request, response, form);
});

router.get('/downloadPredittore', function (request, response) {
  response.render('downloadPredittore', { model });
});

router.post('/downloadFile', function (request, response) {
  downloadPredittore(request, response);
});

app.use('/', router);

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});

const SVM = modules.SVM;

// path directory dove sallete il file
let upload_path = __dirname + '/';

//funzione di addestramento della SVM
function addestramento(data, labels) {

  let options = {
    kernel: "linear",
    karpathy: true
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

//funzione per gestire dati in input nella form
function uploadForm(req, res, form) {
  form.parse(req, function (err, fields, files) {
    model = fields.modello;
    //dir temporanea dove è salvato il file csv addestramento
    let pathTrainFile = files.trainFile.path;
    //dir temporanea dove è salvato il file json config
    let pathConfigFile = files.configFile.path;
    let configPresence = false;

    //se è stato caricato il predittore già allenato
    //TODO:implementare una funzione che controlla se effettivamente è stato caricato o no un predittore(controllando se il file in pathConfigFile è vuoto?)
    if (configPresence) {
      let manage_predittore = new rwpredittore(pathPredittore);
      let title = manage_predittore.getTitle();
      //aggiungere controllo titolo, versione, data entry
      let config = manage_predittore.getConfiguration();
      //config va passata alla creazione della SVM
      //cambia la function addestramento
    }

    //lettura dati per addestramento: data e labels
    let datainput = fs.readFileSync(pathTrainFile, 'utf8');

    //trasformazione SVM in array
    let datatable = csv2array(datainput, ';');//chiamata csv-array

    //array indice dataEntry e dataExit
    let dataEntry = [];                     //chiamata csv-array
    let dataExit = [];
    dataEntry = indiciDataEntry(datatable);
    dataExit = indiciDataExit(datatable);

    if (model == 'SVM') {
      //chiamata function addestramento SVM
      console.log("support");
    }
    else {
      //chiamata function addestramento RL
      console.log("regression");
    }
    //analizzare select SVM o RL
    let strPredittore;

    //addestramento SVM
    /*if(dataEntry.length==1){*/
    let length = datatable.length - 1;
    data = letturaData(datatable, 1, length);
    labels = letturaLabels(datatable, 1, length);

    //analizzare select SVM o RL
    let risultato = addestramento(data, labels);
    console.log("addestramento terminato");
    strPredittore = strPredittore + risultato;

    //redirect alla pagina di download
    console.log("addestramento totale terminato");
    fs.writeFileSync('predittore.json', JSON.stringify(strPredittore));
    res.writeHead(301, { 'Location': 'downloadPredittore' });
    return res.end();
  });
}

function downloadPredittore(req, res) {
  let file = __dirname + '/predittore.json';

  let filename = path.basename(file);
  let mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  let filestream = fs.createReadStream(file);
  filestream.pipe(res);
  //aggiungere conferma download e redirect a upload

}
