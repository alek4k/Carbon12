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
const modules = require('ml-modules');
const express = require('express');
const RPredittore = require('./fileManager/r_predittore');
const WPredittore = require('./fileManager/w_predittore');
const CSVr = require('./fileManager/csv_reader.js');
const SVM = require('./models/svm/svm');
const RL = require('./models/rl/regression');

let model;
let sources;

module.exports = class Server {
    constructor() {
        this.app = express();
        this.router = express.Router();
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    /* @todo
    * aggiungere la creazione della svm e rl a partire da una configurazione data usando fromJSON
    */

    // funzione di addestramento della SVM
    trainSVM(data, labels) {
        const options = {
            kernel: 'linear',
            karpathy: true,
        };

        const svm = new SVM();
        console.log('svm creata');
        svm.train(data, labels, options);
        console.log('svm train');
        const json = svm.toJSON();
        console.log('predittore creato');
        console.log(json);
        return json;
    }

    // funzione di addestramento della RL
    // x numero data entry
    trainRL(data, labels, x) {
        console.log('x' + x);
        const reg = new RL({numX: x, numY: 1});
        reg.train(data, labels);
        console.log(reg.calculate());
        const json = reg.toJSON();
        console.log(json);
        return json;
    }

    uploadForm(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            model = fields.modello;
            // dir temporanea dove è salvato il file csv addestramento
            const pathTrainFile = files.trainFile.path;
            // dir temporanea dove è salvato il file json config
            const pathConfigFile = files.configFile.path;

            /* @todo
            * aggiungere la lettura dei parametri del predittore caricato per verificare la validità
            * controllare che le data entry coincidano con quelle nel csv e
            * controllare che il modello coincida con quello scelto
            */
            const configPresence = false;
            if (configPresence) {
                const managePredittore = new RPredittore(pathPredittore);
                const title = managePredittore.getTitle();
                // aggiungere controllo titolo, versione, data entry
                const config = managePredittore.getConfiguration();
                // config va passata alla creazione della SVM
            }

            /* @todo
            * chiamata a trainSVM o trainRL
            */
            if (model === 'SVM') {
                // chiamata function addestramento SVM
                console.log('support');
            } else {
                // chiamata function addestramento RL
                console.log('regression');
            }

            const csvReader = new CSVr(pathTrainFile, null);

            // dati addestramento SVM
            const data = csvReader.autoGetData();
            console.log('data' + data);
            const labels = csvReader.autoGetLabel();
            const d = csvReader.countSource() + 2;

            const strPredittore = '';
            console.log('addestramento terminato');

            // elenco sorgenti
            sources = csvReader.getDataSource().toString();

            // salvataggio predittore
            const managePredittore = new WPredittore();
            managePredittore.setHeader(PLUGIN_VERSION, TRAIN_VERSION);
            managePredittore.setDataEntry(csvReader.getDataSource(), csvReader.countSource());
            managePredittore.setModel(model);
            managePredittore.setFileVersion(FILE_VERSION);
            managePredittore.setConfiguration(strPredittore);
            fs.writeFileSync('predittore.json', managePredittore.save());
        });

        // redirect alla pagina di download
        res.writeHead(301, {'Location': 'downloadPredittore'});
        return res.end();
    }

    downloadPredittore(req, res) {
        const file = path.join(__dirname, '/predittore.json');
        const filename = path.basename(file);
        const mimetype = mime.getType(file);

        res.setHeader('Content-disposition', 'attachment  filename=' + filename);
        res.setHeader('Content-type', mimetype);

        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
    }

    config() {
        this.app.use('/', this.router);

        this.router.get('/', (request, response) => {
            response.render('addestramento');
        });

        this.router.post('/fileupload', this.uploadForm);

        this.router.get('/downloadPredittore', (request, response) => {
            response.render('downloadPredittore', { model, sources });
        });

        this.router.post('/downloadFile', this.downloadPredittore);
    }

    startServer() {
        this.config();
        this.app.listen(PORT, () => {
            console.log('Listening on port ' + PORT);
        });
    }
};
