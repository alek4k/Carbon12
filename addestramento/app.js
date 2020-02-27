var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var mime = require('mime');
const modules = require("ml-modules");
var express = require('express');
const rwpredittore = require('./r_w_predittore')

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const PORT = 8080;

var router = express.Router();

let model;

router.get('/', function (request, response) {
  response.render('addestramento');
});

router.post('/fileupload', function (request, response) {
  var form = new formidable.IncomingForm();
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

// path directory dove salvare il file
var upload_path = __dirname + '/';

//funzione di addestramento della SVM
function addestramento(data, labels){

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
function uploadForm(req, res, form){
  form.parse(req, function (err, fields, files) {
    model = fields.modello;

    //file csv addestramento
    // oldpath : dir temporanea dove è salvato il file
    var oldpathTrainFile = files.trainFile.path;
    // newpath : nuova dir dove è salvato il file
    var newpathTrainFile = upload_path + files.trainFile.name;
    // copia del file nella nuova posizione
    fs.rename(oldpathTrainFile, newpathTrainFile, (err) => {
      if (!newpathTrainFile.length){alert( "Seleziona un file CSV" ); return;}
      //controllo validità file --> popup errore
      console.log('Rename complete!');
    });

    //file json config
    var configPresence = false;
    // oldpath : dir temporanea dove è salvato il file
    var oldpathConfigFile = files.configFile.path;
    // newpath : nuova dir dove è salvato il file
    var newpathConfigFile = upload_path + files.configFile.name;
    // copia del file nella nuova posizione
    fs.rename(oldpathConfigFile, newpathConfigFile, (err) => {
      if (!newpathConfigFile){
        configPresence = false;
      }
      else {
        configPresence = true;
      }
      //controllo validità file --> popup errore
      console.log('Rename complete!');
    });
    //se è stato caricato il predittore già allenato
    if(configPresence){
      var manage_predittore = new rwpredittore(pathPredittore);
      var title = manage_predittore.getTitle();
      //aggiungere controllo titolo, versione, data entry
      var config = manage_predittore.getConfiguration();
      //config va passata alla creazione della SVM
      //cambia la function addestramento
    }

    //lettura dati per addestramento: data e labels
    var datainput=fs.readFileSync(newpathTrainFile, 'utf8');

    //trasformazione SVM in array
    var datatable=csv2array(datainput,';');//chiamata csv-array

    //array indice dataEntry e dataExit
    var dataEntry=[];                     //chiamata csv-array
    var dataExit=[];
    dataEntry=indiciDataEntry(datatable);
    dataExit=indiciDataExit(datatable);

    if(model == 'SVM'){
      //chiamata function addestramento SVM
      console.log("support");
    }
    else {
      //chiamata function addestramento RL
      console.log("regression");
    }
    //analizzare select SVM o RL
    var strPredittore;

    //addestramento SVM
    /*if(dataEntry.length==1){*/
      var lungh= datatable.length-1;
      data=letturaData(datatable,1,lungh);
      labels=letturaLabels(datatable,1,lungh);

      //analizzare select SVM o RL
      var risultato= addestramento(data,labels);
      console.log("addestramento terminato");
      strPredittore=strPredittore+risultato;
    /*}else{
      for(let i=0; i<dataEntry.length; i++){
        console.log("inizio: "+dataEntry[i]);
        console.log("fine: "+dataExit[i]);
        data=letturaData(datatable,dataEntry[i],dataExit[i]);
        labels=letturaLabels(datatable,dataEntry[i],dataExit[i]);
        console.log("lunghezza: "+data.length);

        //analizzare select SVM o RL
        var risultato= addestramento(data,labels);
        console.log("addestramento " +i+ " terminato");
        strPredittore=strPredittore+risultato;
      }*/
    }

    //redirect alla pagina di download
    console.log("addestramento totale terminato");
    fs.writeFileSync('predittore.json',JSON.stringify(strPredittore));
    res.writeHead(301,{'Location' : 'downloadPredittore'});
    return res.end();
  });
}

function downloadPredittore(req, res){
  var file = __dirname + '/predittore.json';

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
  //aggiungere conferma download e redirect a upload

}
