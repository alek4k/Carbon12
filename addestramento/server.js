/**
 * File name: server.js
 * Date: 2020-03-22
 *
 * @file Classe per la gestione del server
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: gestione file di configurazione
 */

const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const mime = require('mime');
const express = require('express');
const nconf = require('nconf');
const RPredittore = require('./fileManager/r_predittore').rpredittore;
const WPredittore = require('./fileManager/w_predittore').wpredittore;
const CsvReader = require('./fileManager/csv_reader.js').csvreader;
const SvmAdapter = require('./models/SVM_Adapter').svmadapter;
const RlAdapter = require('./models/RL_Adapter').rladapter;

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

    /**
     * validityCsv
     * @param  {Array} csvReaderV
     * array (N*D)+E con i dati di addestramento: N #tuple, D #sorgenti,
     * E valori attesi o classificazione dei dati per l'addestramento
     * @return {boolean}
     * verifica la validità del file csv
     */
    validityCsv(csvReaderV) {
        const labels = csvReaderV.autoGetLabel();
        if (labels.every((value) => value === 0)) {
            console.log('Error: csv - valori attesi mancanti');
            return 'Valori attesi nel file csv mancanti';
        }
        console.log('csv valido');
        return '';
    }

    /**
     * validityJson
     * @param  {Array} dataSourceCsv
     * array con le sorgenti dell'addestramento: N #tuple, D #sorgenti
     * @param  {JSON} managePredittore
     * vecchio predittore allenato in precedenza
     * @return {boolean}
     * verifica la validità dell'ex-predittore
     */
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

    /**
     * train
     * @param  {Array} data
     *array N*D con i dati di addestramento: N #tuple, D #sorgenti
     * @param  {Array} labels
     * array[N] con i valori attesi o classificazione dei dati per l'addestramento
     * @param  {Array} predittore
     * vecchio predittore allenato in precedenza
     * @return {JSON} config
     * stringa JSON con la configurazione salvata del modello da usare per predire
     */
    train(data, labels, predittore) {
        let modelAdapter;
        if (this.model === 'SVM') {
            modelAdapter = new SvmAdapter();
        }
        if (this.model === 'RL') {
            const n = data[0].length + 1;
            const param = { numX: n, numY: 1 };
            modelAdapter = new RlAdapter(param);
        }
        if (predittore) {
            modelAdapter.fromJSON(predittore);
        }
        return modelAdapter.train(data, labels);
    }

    /**
     * savePredittore
     * @param  {JSON} strPredittore
     * predittore generato dall'addestramento
     * @param  {string} nome
     * stringa che identifica il nome del file che si genera
     *
     * salvataggio predittore
     */
    savePredittore(strPredittore, nome) {
        const managePredittore = new WPredittore();
        managePredittore.setHeader(nconf.get('PLUGIN_VERSION'), nconf.get('TRAIN_VERSION'));
        managePredittore.setDataEntry(this.csvReader.getDataSource(), this.csvReader.countSource());
        managePredittore.setModel(this.model);
        managePredittore.setFileVersion(this.FILE_VERSION);
        managePredittore.setNotes(this.notes);
        managePredittore.setConfiguration(strPredittore);
        fs.writeFileSync(nome, managePredittore.save());
    }

    /**
     * uploadForm
     * racchiude le chiamate alle attività di verifica, di addestramento e salvataggio del predittore
     */
    uploadForm(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            this.model = fields.modello;
            this.notes = fields.note;
            this.nomePredittore = fields.nomeFile;
            /*
            let configPresence = false;
            if (files.configFile.name && files.configFile.name !== '') {
                console.log(files.configFile.name + ' loaded');
                configPresence = true;
            }
            */
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
            if (files.configFile.name && files.configFile.name !== '') {
                console.log(files.configFile.name + ' loaded');
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

    /**
     * downloadPredittore
     * permette di scaricare il predittore
     */
    downloadPredittore(req, res) {
        const file = path.join(__dirname, this.nomePredittore);
        const filename = path.basename(file);
        const mimetype = mime.getType(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
    }

    /**
     * getChartData
     * restituisce l'insieme di tutti i dati che servono per la costruzione del grafico
     * suddivide il file (csv) in: dati effettivi, dati labels e intestazioni delle data source
     */
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

    /**
     * getCSVColumns
     * ritorna l'insieme delle intestazioni delle colonne del file contenente i dati (csv)
     * permette di selezionare la sorgente che identificherà la colonna delle labels nella pagina di addestramento
     */
    getCSVColumns(request, response) {
        const form = new formidable.IncomingForm();
        form.multiples = false;
        let result = null;
        form.on('file', (fields, file) => {
            const pathTrainFile = file.path;
            this.csvReader = new CsvReader(pathTrainFile, null);
            result = this.csvReader.autoGetColumns();
        });

        form.on('end', () => {
            response.end(JSON.stringify(result));
        });

        form.parse(request);
    }

    /**
     * config
     * configurazione del server
     */
    config() {
        this.app.use('/', this.router);

        this.router.get('/', (request, response) => {
            let error2 = this.error;
            response.render('addestramento', { error2 });
            error2 = '';
        });

        this.router.post('/fileupload', (request, response) => {
            this.uploadForm(request, response);
        });

        this.router.get('/downloadPredittore', (request, response) => {
            const model2 = this.model;
            const sources2 = this.sources;
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

    /**
     * startServer
     * avvio del server
     */
    startServer() {
        this.config();
        this.server = this.app.listen(nconf.get('PORT'), () => {
            console.log('Listening on port ' + nconf.get('PORT'));
        });
    }
};
