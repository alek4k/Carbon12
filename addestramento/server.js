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
const nconf = require('nconf');
const RPredittore = require('./fileManager/r_predittore');
const WPredittore = require('./fileManager/w_predittore');
const CSVr = require('./fileManager/csv_reader.js');

const SVM = require('./models/svm/svm');
const RL = require('./models/rl/regression');

let model;
let sources;
let notes;
let nomePredittore;
let FILE_VERSION = 0;

module.exports = class Server {
    constructor() {
        this.app = express();
        this.router = express.Router();
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(path.join(__dirname, 'public')));
        try {
            nconf.argv().env().file('config.json');
        } catch (e) {
            console.log('Error parsing your configuration file.');
            return process.exit();
        }
        // parametri di default da utilizzare se il file di configurazione o alcune key non sono presenti
        nconf.defaults({ PORT: 8080, TRAIN_VERSION: '0.0.0', PLUGIN_VERSION: '0.0.0' });
    }

    /* @todo
        * aggiungere gestione addestramento
        */
    train(data, expected) {
        // train
        this.data = data;
        this.expected = expected;
    }

    // eslint-disable-next-line class-methods-use-this
    uploadForm(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            model = fields.modello;
            notes = fields.note;
            nomePredittore = fields.nomeFile + '.json';
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
                const managePredittore = new RPredittore(pathConfigFile);
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

            // dati addestramento
            const data = csvReader.autoGetData();
            console.log('data' + data);
            const labels = csvReader.autoGetLabel();
            const sourceNumberRL = csvReader.countSource() + 2;
            // elenco sorgenti
            sources = csvReader.getDataSource().toString();

            const strPredittore = '';
            console.log('addestramento terminato');

            // salvataggio predittore
            const managePredittore = new WPredittore();
            managePredittore.setHeader(nconf.get('PLUGIN_VERSION'), nconf.get('TRAIN_VERSION'));
            managePredittore.setDataEntry(csvReader.getDataSource(), csvReader.countSource());
            managePredittore.setModel(model);
            managePredittore.setFileVersion(FILE_VERSION);
            managePredittore.setNotes(notes);
            managePredittore.setConfiguration(strPredittore);
            fs.writeFileSync(nomePredittore, managePredittore.save());
        });

        // redirect alla pagina di download
        res.writeHead(301, { Location: 'downloadPredittore' });
        return res.end();
    }

    // eslint-disable-next-line class-methods-use-this
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
        this.app.listen(nconf.get('PORT'), () => {
            console.log('Listening on port ' + nconf.get('PORT'));
        });
    }
};
