/**
 * File name: server.js
 * Date: 2020-03-22
 *
 * @file Classe per la gestione del server
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: gestione file di configurazione
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
// const SVM = require('./models/svm/svm');
// const RL = require('./models/rl/regression');

let model;
let sources;
let notes;
let nomePredittore;
let error = '';
let FILE_VERSION = 0;
let data;

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

    uploadForm(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            model = fields.modello;
            notes = fields.note;
            nomePredittore = fields.nomeFile;

            let configPresence = false;
            if (files.configFile.name && files.configFile.name !== '') {
                console.log(files.configFile.name + ' loaded');
                configPresence = true;
            }
            if (nomePredittore === '') {
                nomePredittore = 'predittore';
            }
            if (nomePredittore.substr(-5) !== '.json') {
                nomePredittore += '.json';
            }
            console.log('nome: ' + nomePredittore);

            // dir temporanea dove è salvato il file csv addestramento
            const pathTrainFile = files.trainFile.path;
            // dir temporanea dove è salvato il file json config
            const pathConfigFile = files.configFile.path;

            const csvReader = new CSVr(pathTrainFile, null);
            if (csvReader.checkStructure()) {
                console.log('csv valido');
            } else {
                console.log('Error: csv non valido');
                error = 'Struttura csv non valida';
                res.writeHead(301, { Location: '/' });
                return res.end();
            }

            // dati addestramento
            data = csvReader.autoGetData();
            const labels = csvReader.autoGetLabel();
            const sourceNumberRL = csvReader.countSource() + 2;
            // elenco sorgenti
            sources = csvReader.getDataSource().toString();

            if (configPresence) {
                const managePredittore = new RPredittore(JSON.parse(
                    fs.readFileSync(pathConfigFile).toString(),
                ));
                if (managePredittore.validity()) {
                    const config = managePredittore.getConfiguration();
                    // config va passata alla creazione della SVM

                    if (managePredittore.getFileVersion() > 0) {
                        FILE_VERSION = managePredittore.getFileVersion() + 1;
                    }

                    // controllo versioni
                    if (managePredittore.checkVersion(
                        nconf.get('PLUGIN_VERSION'), nconf.get('TRAIN_VERSION'),
                    ) === false) {
                        console.log('Error: wrong versions');
                        error = 'Versione file di addestramento non compatibile';
                    }
                    // controllare che le data entry coincidano con quelle nel csv
                    const dataSourceJson = managePredittore.getDataEntry();
                    const dataSourceCsv = csvReader.getDataSource();
                    if (dataSourceJson.length !== dataSourceCsv.length || dataSourceJson.every(
                        (value, index) => value === dataSourceCsv[index],
                    ) === false) {
                        console.log('Error: wrong data entry');
                        error = 'Le data entry non coincidono con quelle del file di addestramento';
                    }
                    // controllare che il modello coincida con quello scelto
                    if (model !== managePredittore.getModel()) {
                        console.log('Error: wrong model');
                        error = 'Il modello non coincide con quello selezionato';
                    }
                } else {
                    console.log('Error: json non valido');
                    error = 'Struttura json non valida';
                }
            }

            if (error !== '') {
                res.writeHead(301, { Location: '/' });
                return res.end();
            }
            console.log('json valido');

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

            res.writeHead(301, { Location: 'downloadPredittore' });
            return res.end();
        });
    }

    downloadPredittore(req, res) {
        const file = path.join(__dirname, nomePredittore);
        const filename = path.basename(file);
        const mimetype = mime.getType(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
    }

    config() {
        this.app.use('/', this.router);

        this.router.get('/', (request, response) => {
            response.render('addestramento', { error });
            error = '';
        });

        this.router.post('/fileupload', this.uploadForm);

        this.router.get('/downloadPredittore', (request, response) => {
            response.render('downloadPredittore', { model, sources, data });
        });

        this.router.post('/downloadFile', this.downloadPredittore);

        this.router.post('/loadCsv', (request, response) => {
            const form = new formidable.IncomingForm();
            form.multiples = false;
            let result = null;
            form.on('file', (fields, file) => {
                const pathTrainFile = file.path;
                const csvReader = new CSVr(pathTrainFile, null);
                if (csvReader.checkStructure()) {
                    result = csvReader.autoGetData();
                }
                return null;
            });

            form.on('end', () => {
                response.end(JSON.stringify(result));
            });

            form.parse(request);
        });
    }

    startServer() {
        this.config();
        this.app.listen(nconf.get('PORT'), () => {
            console.log('Listening on port ' + nconf.get('PORT'));
        });
    }
};
