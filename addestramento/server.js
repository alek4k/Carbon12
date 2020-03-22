/**
 * File name: app.js
 * Date: 2020-03-19
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: nuovi file rw
 */

const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const mime = require('mime');
const express = require('express');
const RPredittore = require('./fileManager/r_predittore');
const WPredittore = require('./fileManager/w_predittore');
const CSVr = require('./fileManager/csv_reader.js');

/* @todo
    * aggiungere config file
    */
const PORT = 8080;
const PLUGIN_VERSION = '0.0.0';
const TRAIN_VERSION = '0.0.0';
const FILE_VERSION = 0;
let model;
let sources;
let notes;
let nomePredittore;

const SVM = require('./models/svm/svm');
const RL = require('./models/rl/regression');

module.exports = class Server {
  constructor() {
    this.app = express();
    this.router = express.Router();
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
    this.app.use(express.static(__dirname + '/public'));
  }

  /* @todo
  * aggiungere la creazione della svm e rl a partire da una configurazione data usando fromJSON
  */
  //funzione di addestramento della SVM
  trainSVM(data, labels) {

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
  trainRL(data,labels,x){
    console.log('x'+x);
    let reg = new RL({ numX: x, numY: 1 });
    reg.train(data,labels);
    console.log(reg.calculate())
    let json = reg.toJSON();
    console.log(json);
    return json;
  }

  uploadForm(req, res) {
      let form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          model = fields.modello;
          console.log('model'+model)
          notes = fields.note;
          nomePredittore = fields.nomeFile + '.json';
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

          let csvreader = new CSVr(pathTrainFile);

          //dati addestramento SVM
          let data = csvreader.autoGetData();
          let labels = csvreader.autoGetLabel();
          let d = csvreader.countSource()+2;

          let strPredittore = "";
          console.log("addestramento terminato");

          //elenco sorgenti
          sources = csvreader.getDataSource().toString();

          //salvataggio predittore
          let manage_predittore = new WPredittore();
          manage_predittore.setHeader(PLUGIN_VERSION, TRAIN_VERSION);
          manage_predittore.setDataEntry(csvreader.getDataSource(), csvreader.countSource());
          manage_predittore.setModel(model);
          manage_predittore.setFileVersion(FILE_VERSION);
          //manage_pedittore.setNotes(notes);
          manage_predittore.setConfiguration(strPredittore);
          fs.writeFileSync(nomePredittore, manage_predittore.save());
      });
      //redirect alla pagina di download
      res.writeHead(301, {'Location': 'downloadPredittore'});
      return res.end();
  }

 downloadPredittore(req, res) {
      let file = __dirname + '/' + nomePredittore;

      let filename = path.basename(file);
      let mimetype = mime.getType(file);

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      let filestream = fs.createReadStream(file);
      filestream.pipe(res);
  }

  config(){
        this.app.use('/', this.router);

        this.router.get('/', function (request, response) {
            response.render('addestramento');
        });

        this.router.post('/fileupload', this.uploadForm);

        this.router.get('/downloadPredittore', function (request, response) {
          console.log('model'+model)
            response.render('downloadPredittore', {model, sources});
        });

        this.router.post('/downloadFile', this.downloadPredittore);
  }

  startServer() {
    this.config();
    this.app.listen(PORT, function () {
        console.log('Listening on port ' + PORT);
    });
  }

}
