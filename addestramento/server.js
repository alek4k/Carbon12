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
const SvmAdapter = require('./models/SVM_Adapter');
const RlAdapter = require('./models/RL_Adapter');

let model = 'SVM';
let sources;
let notes;
let nomePredittore;
let error = '';
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

    validityCsv(csvReader) {
        if (csvReader.checkStructure() === false) {
            console.log('Error: csv non valido');
            return 'Struttura csv non valida';
        }
        const labels = csvReader.autoGetLabel();
        if (labels.every((value) => value === 0)) {
            console.log('Error: csv - valori attesi mancanti');
            return 'Valori attesi nel campo Labels del file csv mancanti';
        }
        console.log('csv valido');
        return '';
    }

    validityJson(managePredittore, dataSourceCsv) {
        if (managePredittore.validity()) {
            if (managePredittore.getFileVersion() >= 0) {
                FILE_VERSION = managePredittore.getFileVersion() + 1;
            }

            // controllo versioni
            if (managePredittore.checkVersion(
                nconf.get('PLUGIN_VERSION'), nconf.get('TRAIN_VERSION'),
            ) === false) {
                console.log('Error: wrong versions');
                return 'Versione file di addestramento non compatibile';
            }
            // controllare che le data entry coincidano con quelle nel csv
            const dataSourceJson = managePredittore.getDataEntry();
            if (dataSourceJson.length !== dataSourceCsv.length || dataSourceJson.every(
                (value, index) => value === dataSourceCsv[index],
            ) === false) {
                console.log('Error: wrong data entry');
                return 'Le data entry non coincidono con quelle del file di addestramento';
            }
            // controllare che il modello coincida con quello scelto
            if (model !== managePredittore.getModel()) {
                console.log('Error: wrong model');
                return 'Il modello non coincide con quello selezionato';
            }
        } else {
            console.log('Error: json non valido');
            return 'Struttura json non valida';
        }

        console.log('json valido');
        return '';
    }

    train(data, labels, predittore) {
        let modelAdapter;
        switch (model) {
            case 'SVM': {
                modelAdapter = new SvmAdapter();
                break;
            }
            case 'RL': {
                const n = data[0].length + 1;
                const param = { numX: n, numY: 1 };
                modelAdapter = new RlAdapter(param);
                break;
            }
            default:
                modelAdapter = null;
        }
        if (predittore) {
            modelAdapter.fromJSON(predittore);
        }
        return modelAdapter.train(data, labels);
    }

    savePredittore(csvReader, strPredittore, nome) {
        // salvataggio predittore
        const managePredittore = new WPredittore();
        managePredittore.setHeader(nconf.get('PLUGIN_VERSION'), nconf.get('TRAIN_VERSION'));
        managePredittore.setDataEntry(csvReader.getDataSource(), csvReader.countSource());
        managePredittore.setModel(model);
        managePredittore.setFileVersion(FILE_VERSION);
        managePredittore.setNotes(notes);
        managePredittore.setConfiguration(strPredittore);
        fs.writeFileSync(nome, managePredittore.save());
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
            error = this.validityCsv(csvReader);
            if (error.length > 0) {
                res.writeHead(301, { Location: '/' });
                return res.end();
            }

            // dati addestramento
            const data = csvReader.autoGetData();
            const labels = csvReader.autoGetLabel();
            // elenco sorgenti
            sources = csvReader.getDataSource();

            let config = '';
            if (configPresence) {
                const managePredittore = new RPredittore(JSON.parse(
                    fs.readFileSync(pathConfigFile).toString(),
                ));

                error = this.validityJson(managePredittore, sources);
                if (error.length > 0) {
                    res.writeHead(301, { Location: '/' });
                    return res.end();
                }

                config = managePredittore.getConfiguration();
            }

            const strPredittore = this.train(data, labels, config);
            console.log('addestramento terminato');

            this.savePredittore(csvReader, strPredittore, nomePredittore);

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

    getChartData(request, response) {
        const form = new formidable.IncomingForm();
        form.multiples = false;
        let result = null;
        form.on('file', (fields, file) => {
            const pathTrainFile = file.path;
            const csvReader = new CSVr(pathTrainFile, null);
            if (csvReader.checkStructure()) {
                result = [];
                result.push(csvReader.getDataGraph());
                result.push(csvReader.autoGetLabel());
                result.push(csvReader.getDataSource());
            }
            return null;
        });

        form.on('end', () => {
            response.end(JSON.stringify(result));
        });

        form.parse(request);
    }

    config() {
        this.app.use('/', this.router);

        this.router.get('/', (request, response) => {
            response.render('addestramento', { error });
            error = '';
        });

        this.router.post('/fileupload', (request, response) => {
            this.uploadForm(request, response);
        });

        this.router.get('/downloadPredittore', (request, response) => {
            response.render('downloadPredittore', { model, sources });
        });

        this.router.post('/downloadFile', this.downloadPredittore);

        this.router.post('/loadCsv', (request, response) => {
            this.getChartData(request, response);
        });
    }

    startServer() {
        this.config();
        this.app.listen(nconf.get('PORT'), () => {
            console.log('Listening on port ' + nconf.get('PORT'));
        });
    }
};
