/**
 * File name: import.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

// importo il template della dashboard per la creazione del pannello
import defaultDashboard from '../dashboards/default.json';

const GrafanaApiQuery = require('../utils/grafana_query.js');
const Influx = require('../utils/influx.js');
const SVM = require('../utils/models/svm/svm.js');
const FilePredictor = require('../utils/r_predittore.js');

export default class importCtrl {
    /** @ngInject */
    constructor($location, backendSrv) {
        this.$location = $location;
        this.backendSrv = backendSrv;
        this.step = 1;
        this.error = '';
        this.availableDataSources = [];
        this.dataSource = '';
        this.name = '';
        this.database = '';
        this.host = 'http://localhost';
        this.port = '8086';
        this.notes = '';
        this.model = '';
        this.availableDataEntry = [];
        this.availableSources = [];
        this.availableInstances = [];
        this.availableParams = [];
        this.sources = [];
        this.instances = [];
        this.params = [];
        this.view = '';
        this.influx = null;
        this.grafana = new GrafanaApiQuery(this.backendSrv);
        this.newRow = true;
        this.dashboard = {};
        this.predictor = {};

        // prelevo le data sources disponibili
        this.grafana.getDataSources()
            .then((dataSources) => {
                // dataSoources ha la struttura di un json
                dataSources.forEach((dataSource) => {
                    this.availableDataSources.push(dataSource.name);
                });
            });
    }

    // carico il file del predittore
    onUpload(json) {
        // controllo che il JSON inserito abbia la struttura desiderata
        const fPredictor = new FilePredictor(json);
        if (fPredictor.validity()) {
            this.predictor = fPredictor.getConfiguration();
            this.error = '';
            this.notes = fPredictor.getNotes();
            this.model = fPredictor.getModel();
            this.view = (this.model === 'SVM') ? 'Indicatore' : 'Grafico';
            // creo l'array con le sorgenti di addestramento
            this.availableDataEntry = fPredictor.getDataEntry();
            this.step = 2;
        } else {
            this.error = 'Il JSON inserito non è un predittore';
        }
    }

    // carico testo del predittore
    loadText() {
        try {
            // controllo prima con parse() se il JSON è valido, poi chiamo il metodo onUpload()
            this.onUpload(JSON.parse(this.jsonText));
        } catch (err) {
            this.error = err.message;
        }
    }

    // imposto la data source selezionata dall'utente
    setDataSource(ds) {
        if (ds) {
            this.error = '';
            defaultDashboard.rows[0].panels[0].datasource = ds;
            if (this.dataSource) {
                // ho selezionato una data source
                const dataSources = this.grafana.getDataSources();
                dataSources.then((dataSource) => {
                    let found = false;
                    // dataSources ha la struttura di un json
                    for (let i = 0; dataSource[i] !== undefined && !found; ++i) {
                        if (dataSource[i].name === this.dataSource) {
                            found = true;
                            // vado ad estrarre le informazioni della data source selezionata
                            this.database = dataSource[i].database;
                            const endOfHost = dataSource[i].url.lastIndexOf(':');
                            this.host = dataSource[i].url.substring(0, endOfHost);
                            this.port = dataSource[i].url.substring(endOfHost + 1);
                            this.connections();
                        }
                    }
                });
            } else {
                // ho configurato una nuova datasource
                this.connections();
            }
            this.step = 3;
        } else {
            this.error = 'È necessario selezionare una sorgente dati';
        }
    }

    // aggiungo la configurazione della data source alla lista delle data sources
    addDataSource() {
        const configComplete = this.name && this.database && this.host && this.port;
        if (configComplete) {
            this.grafana
                .postDataSource(this.name, this.database, this.host, this.port)
                .then(() => {
                    this.setDataSource(this.name);
                });
        } else {
            this.error = 'La configurazione non è completa';
        }
    }

    connections() {
        // creo la connessione con il database
        this.influx = new Influx(this.host, parseInt(this.port, 10), this.database);

        const sources = this.influx.getSources().results[0].series;
        const instances = this.influx.getInstances().results[0].series;
        for (let i = 0, j = 0; i < sources.length; ++i) {
            // itero sul totale delle sorgenti
            this.availableSources.push(sources[i].name);
            this.availableParams[i] = [];
            this.availableInstances[i] = [];
            sources[i].values.forEach((source) => {
                // aggiungo i parametri di ogni sorgente
                this.availableParams[i].push(source[0]);
            });
            if (j < instances.length && sources[i].name === instances[j].name) {
                instances[j].values.forEach((instance) => {
                    // aggiungo le istanze di ogni sorgente, ove possibile
                    this.availableInstances[i].push(instance[1]);
                });
                ++j;
            }
            // se una sorgente non ha istanze rimane availableInstances[x] = [];
        }
    }

    setDashboard(lastColumn, lastRow) {
        for (let i = 0; i < this.availableDataEntry.length; ++i) {
            this.dashboard.rows[lastRow].panels[lastColumn].targets.push({
                refId: this.availableDataEntry[i],
                measurement: this.sources[i],
                policy: 'default',
                resultFormat: 'time_series',
                orderByTime: 'ASC',
                tags: [{
                    key: 'instance',
                    operator: '=',
                    value: this.instances[i] ? this.instances[i] : '',
                }],
                select: [[{
                    type: 'field',
                    params: [
                        this.params[i],
                    ],
                }, {
                    type: 'mean',
                    params: [],
                }]],
            });
            this.dashboard.rows[lastRow].panels[lastColumn].groupBy.push({
                type: 'time',
                params: [
                    '$__interval',
                ],
            }, {
                type: 'fill',
                params: [
                    'null',
                ],
            });
        }
    }

    // imposto la visualizzazione selezionata dall'utente
    setView() {
        defaultDashboard.rows[0].height = '300px';
        if (this.view === 'Grafico') {
            defaultDashboard.rows[0].panels[0].height = '300px';
            defaultDashboard.rows[0].panels[0].span = 6;
            defaultDashboard.rows[0].panels[0].type = 'graph';
            defaultDashboard.rows[0].panels[0].title = 'Grafico di Predizione';
        } else {
            defaultDashboard.rows[0].panels[0].height = '150px';
            defaultDashboard.rows[0].panels[0].span = 2;
            defaultDashboard.rows[0].panels[0].type = 'singlestat';
            defaultDashboard.rows[0].panels[0].title = 'Indicatore di Predizione';
            defaultDashboard.rows[0].panels[0].colorBackground = 'true';
        }
    }

    setValues() {
        const svm = new SVM();
        svm.fromJSON(this.predictor);
        const point = [
            this.influx.getLastValue('win_cpu', 'Percent_DPC_Time'),
            this.influx.getLastValue('win_cpu', 'Percent_DPC_Time'),
        ];
        const result = svm.predictClass(point); // value = 1 || value = -1
        return result;
    }

    // creo il pannello
    createPanel() {
        this.error = '';
        for (let i = 0; i < this.availableDataEntry.length && !this.error; ++i) {
            if (this.sources[i] === undefined) {
                this.error = 'La sorgente di '
                    + this.availableDataEntry[i] + ' non è stata selezionata';
            }
        }
        if (!this.error) {
            this.grafana
                .getDashboards('0')
                .then((dbList) => {
                    let found = false;
                    for (let i = 0; i < dbList.length && !found; ++i) {
                        if (dbList[i].title === 'Predire in Grafana') {
                            found = true;
                        }
                    }
                    if (found) {
                        this.grafana
                            .getDashboard('predire-in-grafana')
                            .then((db) => {
                                let lastRow = 0;
                                let lastColumn = 0;
                                lastRow = db.dashboard.rows.length;
                                if (this.newRow || !lastRow) {
                                    db.dashboard.rows
                                        .push(defaultDashboard.rows[0]);
                                } else {
                                    --lastRow;
                                    lastColumn = db.dashboard.rows[lastRow].panels.length;
                                    db.dashboard.rows[lastRow].panels
                                        .push(defaultDashboard.rows[0].panels[0]);
                                }
                                this.dashboard = db.dashboard;
                                this.setDashboard(lastColumn, lastRow);
                                this.setView();
                                this.savePanel();
                            });
                    } else {
                        this.dashboard = defaultDashboard;
                        this.setDashboard(0, 0);
                        this.setView();
                        this.savePanel();
                    }
                });
        }
    }

    savePanel() {
        this.grafana
            .postDashboard(this.dashboard)
            .then((db) => {
                // reindirizzo alla pagina della dashboard appena creata
                this.$location.url(db.importedUrl);
                // ricarico la nuova pagina per aggiornare la lista delle data sources disponibili
                window.location.href = db.importedUrl;
            });
    }
}

importCtrl.templateUrl = 'components/import.html';
