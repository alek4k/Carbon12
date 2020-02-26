var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var mime = require('mime');
const modules = require("ml-modules");
var express = require('express');

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

//lettura dati per data
function readNumero(data,x){
  var n;
  var nstring="";
  if(x==0){
    for(let i=0; i<data.length && data[i]!=","; i++){
      if(data[i]!=','){
        nstring=nstring+data[i];
      }
    }
    n=parseInt(nstring);
  }
  else{
    var salto=0;
    for(let i=0; i<data.length && data[i]!=","; i++){
      if(data[i]!=','){salto++;}
      else{salto++;}
    }
    for(let i=salto+1; i<data.length; i++){
      nstring=nstring+data[i];
    }
    n=parseInt(nstring);
  }
  return n;
};

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
        if (err) throw err;
        console.log('Rename complete!');
      });

      //file json config
      // oldpath : dir temporanea dove è salvato il file
      var oldpathConfigFile = files.configFile.path;
      // newpath : nuova dir dove è salvato il file
      var newpathConfigFile = upload_path + files.configFile.name;
      // copia del file nella nuova posizione
      fs.rename(oldpathConfigFile, newpathConfigFile, (err) => {
        if (err) throw err;
        console.log('Rename complete!');
      });

          //if (err) throw err; //deve lanciare errore se controllo file non va a buon fine: ALERT Popup?
         //lettura dati per addestramento: data e labels
          var datainput=fs.readFileSync(newpathConfigFile, 'utf8');
          var obj= JSON.parse(datainput);
          var datagraf=[];
          var labels=[];
          var i=0;
          for(var key in obj){
            datagraf[i]=key;
            labels[i]=obj[key];
            i=i+1;
          }
          var data=[];
          for(let a=0; a<datagraf.length; a++){
            data[a] = [];
            for(var b=0; b<2; b++) {
              data[a][b] = readNumero(datagraf[a],b);
            }
          }

          //analizzare select SVM o RL
          var risultato= addestramento(data,labels);
          //redirect alla pagina di download
          console.log("addestramento terminato");
          fs.writeFileSync('predittore.json',JSON.stringify(risultato));
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
