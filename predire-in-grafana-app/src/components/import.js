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
        this.selectedSourceInstances = [];
        this.selectedSourceParams = [];
        this.sources = [];
        this.instances = [];
        this.params = [];
        this.view = '';
        this.influx = null;
        this.grafana = new GrafanaApiQuery(this.backendSrv);
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

        // prelevo le sorgenti disponibili
        const sources = this.influx.getSources().results[0].series;
        sources.forEach((source) => {
            this.availableSources.push(source.name);
            // itero sulle istanze di ogni sorgente
            for (let i = 0; i < source.values.length; ++i) {
                this.availableInstances.push({
                    name: source.name,
                    instance: source.values[i][1],
                });
            }
        });

        // prelevo i parametri disponibili
        const params = this.influx.getParams().results[0].series;
        params.forEach((param) => {
            // itero sui parametri di ogni sorgente
            for (let i = 0; i < param.values.length; ++i) {
                this.availableParams.push({
                    name: param.name,
                    param: param.values[i][0],
                });
            }
        });
    }

    setDashboard() {
        for (let i = 0; i < this.availableDataEntry.length; ++i) {
            defaultDashboard.rows[0].panels[0].targets.push({
                refId: this.availableDataEntry[i],
                measurement: this.sources[i],
                policy: 'default',
                resultFormat: 'time_series',
                orderByTime: 'ASC',
                tags: [{
                    key: 'instance',
                    operator: '=',
                    value: this.instances[i],
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
            defaultDashboard.rows[0].panels[0].groupBy.push({
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
        if (this.view === 'Grafico') {
            defaultDashboard.rows[0].height = '350px';
            defaultDashboard.rows[0].panels[0].span = 12;
            defaultDashboard.rows[0].panels[0].type = 'graph';
            defaultDashboard.rows[0].panels[0].title = 'Grafico di Predizione';
        } else {
            defaultDashboard.rows[0].height = '350px';
            defaultDashboard.rows[0].panels[0].span = 4;
            defaultDashboard.rows[0].panels[0].type = 'singlestat';
            defaultDashboard.rows[0].panels[0].title = 'Indicatore di Predizione';
            defaultDashboard.rows[0].panels[0].colorBackground = 'true';
        }
    }

    // costruisco l'array delle istanze relative alla sorgente selezionta
    buildInstances(index) {
        this.selectedSourceInstances[index] = [];
        let i = 0;
        // trovo l'indice del prima sorgente accettabile
        for (; this.availableInstances[i].name !== this.sources[index]; ++i);
        // seleziono i parametri relativi alla sorgente
        for (; i < this.availableInstances.length
                && this.availableInstances[i].name === this.sources[index]; ++i) {
            this.selectedSourceInstances[index].push(this.availableInstances[i].instance);
        }
        this.instances[index] = this.selectedSourceInstances[index][0];
    }

    // costruisco l'array dei parametri relativi alla sorgente selezionta
    buildParams(index) {
        this.selectedSourceParams[index] = [];
        let i = 0;
        // trovo l'indice del prima sorgente accettabile
        for (; this.availableParams[i].name !== this.sources[index]; ++i);
        // seleziono i parametri relativi alla sorgente
        for (; i < this.availableParams.length
                && this.availableParams[i].name === this.sources[index]; ++i) {
            this.selectedSourceParams[index].push(this.availableParams[i].param);
        }
        this.params[index] = this.selectedSourceParams[index][0];
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
            this.setDashboard();
            this.setView();
            this.setValues();
            this.grafana
                .postDashboard(defaultDashboard)
                .then((db) => {
                    // reindirizzo alla pagina della dashboard appena creata
                    this.$location.url(db.importedUrl);
                    // ricarico la nuova pagina per aggiornare la lista delle data sources disponibili
                    window.location.href = db.importedUrl;
                });
        }
    }
}

importCtrl.templateUrl = 'components/import.html';
