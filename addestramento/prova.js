var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var mime = require('mime');
const modules = require("ml-modules");
const SVM = modules.SVM;

// file html con la form per upload dati e selezione modello
var upload_html = fs.readFileSync("addestramento.html");
// file html per il download del predittore
var download_html = fs.readFileSync("downloadPredittore.html");

// path directory dove salvare il file
var upload_path = __dirname + '/';

//funzione di addestramento della SVM
function addestramento(){
  let data = [
    [1, 0],
    [2, 3],
    [5, 4],
    [2, 7],
    [0, 3],
    [-1, 0],
    [-3, -4],
    [-2, -2],
    [-1, -1],
    [-5, -2]
  ];

  let labels = [1, 1, 1, 1, 1, -1, -1, -1, -1, -1];

  let options = {
    kernel: "linear",
    karpathy: true
  };

  let svm = new SVM();
  console.log("svm creta");

  svm.train(data, labels, options);
  console.log("svm train");
  let json = svm.toJSON();
  console.log("predittore creato");
  console.log(json);
}

//funzione per gestire dati in input nella form
function uploadForm(req, res, form){
  form.parse(req, function (err, fields, files) {
      // oldpath : dir temporanea dove è salvato il file
      var oldpath = files.filetoupload.path;
      // newpath : nuova dir dove è salvato il file
      var newpath = upload_path + files.filetoupload.name;
      // copia del file nella nuova posizione
      fs.rename(oldpath, newpath, function (err) {
          if (err) throw err; //deve lanciare errore se controllo file non va a buon fine: ALERT Popup?
          //analizzare select SVM o RL
          addestramento();
          //redirect alla pagina di download
          console.log("addestramento terminato");
          res.writeHead(301,{'Location' : 'downloadPredittore'});
          return res.end();
      });
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

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
      var form = new formidable.IncomingForm();
      uploadForm(req, res, form);
    }
    else if(req.url == '/downloadPredittore'){
      //restituisce pagina download
      res.writeHead(200);
      res.write(download_html);
      return res.end();
    }
    else if(req.url == '/downloadFile'){
      downloadPredittore(req, res);
    }
    else{
      //restituisce pagina upload
      res.writeHead(200);
      res.write(upload_html);
      return res.end();
    }
}).listen(8080);
