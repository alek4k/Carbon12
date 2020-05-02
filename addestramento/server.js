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

module.exports = class Server {
    constructor() {
        this.csvReader = null;
        this.model = 'SVM';
        this.sources = null;
        this.notes = null;
        this.nomePredittore = '';
        this.error = '';
        this.FILE_VERSION = 0;

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

    validityCsv(csvReaderV) {
        const labels = csvReaderV.autoGetLabel();
        if (labels.every((value) => value === 0)) {
            console.log('Error: csv - valori attesi mancanti');
            return 'Valori attesi nel file csv mancanti';
        }
        console.log('csv valido');
        return '';
    }

    validityJson(managePredittore, dataSourceCsv) {
        if (managePredittore.validity()) {
            if (managePredittore.getFileVersion() >= 0) {
                this.FILE_VERSION = managePredittore.getFileVersion() + 1;
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
            if (this.model !== managePredittore.getModel()) {
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
        switch (this.model) {
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

    savePredittore(strPredittore, nome) {
        // salvataggio predittore
        const managePredittore = new WPredittore();
        managePredittore.setHeader(nconf.get('PLUGIN_VERSION'), nconf.get('TRAIN_VERSION'));
        managePredittore.setDataEntry(this.csvReader.getDataSource(), this.csvReader.countSource());
        managePredittore.setModel(this.model);
        managePredittore.setFileVersion(this.FILE_VERSION);
        managePredittore.setNotes(this.notes);
        managePredittore.setConfiguration(strPredittore);
        fs.writeFileSync(nome, managePredittore.save());
    }

    uploadForm(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            this.model = fields.modello;
            this.notes = fields.note;
            this.nomePredittore = fields.nomeFile;

            let configPresence = false;
            if (files.configFile.name && files.configFile.name !== '') {
                console.log(files.configFile.name + ' loaded');
                configPresence = true;
            }
            if (this.nomePredittore === '') {
                this.nomePredittore = 'predittore';
            }
            if (this.nomePredittore.substr(-5) !== '.json') {
                this.nomePredittore += '.json';
            }
            console.log('nome: ' + this.nomePredittore);

            // dir temporanea dove è salvato il file json config
            const pathConfigFile = files.configFile.path;

            this.error = this.validityCsv(this.csvReader);
            if (this.error.length > 0) {
                res.writeHead(301, { Location: '/' });
                return res.end();
            }

            // dati addestramento
            const data = this.csvReader.autoGetData();
            const labels = this.csvReader.autoGetLabel();
            // elenco sorgenti
            this.sources = this.csvReader.getDataSource();

            let config = '';
            if (configPresence) {
                const managePredittore = new RPredittore(JSON.parse(
                    fs.readFileSync(pathConfigFile).toString(),
                ));

                this.error = this.validityJson(managePredittore, this.sources);
                if (this.error.length > 0) {
                    res.writeHead(301, { Location: '/' });
                    return res.end();
                }

                config = managePredittore.getConfiguration();
            }

            const strPredittore = this.train(data, labels, config);
            console.log('addestramento terminato');
            this.savePredittore(strPredittore, this.nomePredittore);

            res.writeHead(301, { Location: 'downloadPredittore' });
            return res.end();
        });
    }

    downloadPredittore(req, res) {
        const file = path.join(__dirname, this.nomePredittore);
        const filename = path.basename(file);
        const mimetype = mime.getType(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
    }

    getChartData(request, response) {
        const form = new formidable.IncomingForm();
        let result = null;
        form.parse(request).on('field', (name, field) => {
            const columnValue = field;
            result = [];
            this.csvReader.setLabelsColumn(columnValue);
            result.push(this.csvReader.autoGetData());
            result.push(this.csvReader.autoGetLabel());
            result.push(this.csvReader.getDataSource());
        });
        form.on('end', () => {
            response.end(JSON.stringify(result));
        });

        form.parse(request);
    }

    getCSVColumns(request, response) {
        const form = new formidable.IncomingForm();
        form.multiples = false;
        let result = null;
        form.on('file', (fields, file) => {
            const pathTrainFile = file.path;
            this.csvReader = new CSVr(pathTrainFile, null);
            result = this.csvReader.autoGetColumns();
        });

        form.on('end', () => {
            response.end(JSON.stringify(result));
        });

        form.parse(request);
    }

    config() {
        this.app.use('/', this.router);

        this.router.get('/', (request, response) => {
            let error2 = this.error; // TODO: dare un nome migliore alla variabile
            response.render('addestramento', { error2 });
            error2 = '';
        });

        this.router.post('/fileupload', (request, response) => {
            this.uploadForm(request, response);
        });

        this.router.get('/downloadPredittore', (request, response) => {
            const model2 = this.model; // TODO: dare un nome migliore alla variabile
            const sources2 = this.sources; // TODO: dare un nome migliore alla variabile
            response.render('downloadPredittore', { model2, sources2 });
        });

        this.router.post('/downloadFile', (request, response) => {
            this.downloadPredittore(request, response);
        });

        this.router.post('/loadCsv', (request, response) => {
            this.getChartData(request, response);
        });

        this.router.post('/loadColumns', (request, response) => {
            this.getCSVColumns(request, response);
        });
    }

    startServer() {
        this.config();
        this.server = this.app.listen(nconf.get('PORT'), () => {
            console.log('Listening on port ' + nconf.get('PORT'));
        });
    }
};
