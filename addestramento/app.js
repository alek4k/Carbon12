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
const RPredittore = require('./fileManager/r_predittore')
const WPredittore = require('./fileManager/w_predittore')
const CSVr = require('./fileManager/csv_reader.js');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 8080;
const FILE_VERSION = '0';
const TRAIN_VERSION = '0.0.0';
const PLUGIN_VERSION = '0.0.0';

const router = express.Router();
const SVM = modules.SVM;

let model;
let sources;

/* @todo
* aggiungere la creazione della svm a partire da una configurazione data usando fromJSON
*/

// funzione di addestramento della SVM
function addestramento(data, labels) {
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

// funzione per gestire dati in input nella form
function uploadForm(req, res, form) {
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
            const managePredittore = new RWPredittore(pathPredittore);
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

        const csvreader = new CSVr(pathTrainFile);

        // dati addestramento SVM
        const data = csvreader.autoGetData();
        const labels = csvreader.autoGetLabel();

        const strPredittore = addestramento(data, labels);
        console.log('addestramento terminato');

        // elenco sorgenti
        sources = csvreader.getDataSource().toString();

        // salvataggio predittore
        const managePredittore = new WPredittore();
        managePredittore.setHeader(PLUGIN_VERSION, TRAIN_VERSION);
        managePredittore.setDataEntry(csvreader.getDataSource(), csvreader.countSource());
        managePredittore.setModel(model);
        managePredittore.setFileVersion(FILE_VERSION);
        managePredittore.setConfiguration(strPredittore);
        fs.writeFileSync('predittore.json', managePredittore.save());

        // redirect alla pagina di download
        res.writeHead(301, { 'Location': 'downloadPredittore' });
        return res.end();
    });
}

function downloadPredittore(req, res) {
    const file = path.join(__dirname, '/predittore.json');

    const filename = path.basename(file);
    const mimetype = mime.getType(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    const filestream = fs.createReadStream(file);
    filestream.pipe(res);
}

router.get('/', (request, response) => {
    response.render('addestramento');
});

router.post('/fileupload', (request, response) => {
    const form = new formidable.IncomingForm();
    uploadForm(request, response, form);
});

router.get('/downloadPredittore', (request, response) => {
    response.render('downloadPredittore', { model, sources });
});

router.post('/downloadFile', (request, response) => {
    downloadPredittore(request, response);
});

app.use('/', router);

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});
