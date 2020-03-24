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

// importo la dashboard già configurata con il pannello 'Carbon12 Graph Prediction'
import defaultDashboard from '../dashboards/default.json';

const GrafanaApiQuery = require('../utils/grafana_query.js');
const Influx = require('../utils/influx.js');
const FilePredictor = require('../utils/r_predittore.js');

// chiavi della struttura base del predittore
const arrayOfKeys = ['header', 'data_entry', 'model', 'file_version', 'configuration'];

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
        this.model = '';
        this.availableMeasurement = [];
        this.availableParams = [];
        this.param = '';
        this.selectedSourceParams = [];
        this.availablePredictors = [];
        this.predictor = '';
        this.availableSources = [];
        this.source = '';
        this.view = '';
        this.grafana = new GrafanaApiQuery(this.backendSrv);

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
        /* eslint-disable no-prototype-builtins */
        let fPredictor = new FilePredictor(json);
        if (fPredictor.validity()) {
            this.error = '';
            this.model = fPredictor.getModel();
            this.view = (this.model === 'SVM') ? 'Indicatore' : 'Grafico';
            //creo l'array con le sorgenti di addestramento
            this.availablePredictors = fPredictor.getDataEntry();
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
                            this.host = dataSource[i].url.substring(0, dataSource[i].url.lastIndexOf(':'));
                            this.port = dataSource[i].url.substring(dataSource[i].url.lastIndexOf(':') + 1);
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
            this.backendSrv.post('api/datasources', {
                name: this.name,
                type: 'influxdb',
                access: 'proxy',
                database: this.database,
                url: this.host + ':' + this.port,
                readOnly: false,
                editable: true,
            }).then(() => {
                this.setDataSource(this.name);
            });
        } else {
            this.error = 'La configurazione non è completa';
        }
    }

    connections() {
        // creo la connessione con il database
        const influx = new Influx(this.host, parseInt(this.port, 10), this.database);

        // prelevo le sorgenti disponibili
        const sources = influx.getSources().results[0].series;
        sources.forEach((source) => {
            for (let j = 0; j < source.values.length; ++j) {
                this.availableMeasurement.push({
                    name: source.name,
                    instance: source.values[j][1],
                });
                this.availableSources.push(source.name + '\n' + source.values[j][1]);
            }
        });

        // prelevo i parametri disponibili
        const params = influx.getParams().results[0].series;
        params.forEach((param) => {
        // itero sui parametri della sorgente i
            for (let j = 0; j < param.values.length; ++j) {
                this.availableParams.push({
                    name: param.name,
                    params: param.values[j][0],
                });
            }
        });
    }

    // imposto sorgete selezionata dall'utente
    setMeasurement(index) {
        defaultDashboard.rows[0].panels[0].targets[0].measurement = this.availableMeasurement[index].name;
    }

    // imposto istanza selezionata dall'utente
    setInstance(index) {
        defaultDashboard.rows[0].panels[0].targets[0].tags[0].value = this.availableMeasurement[index].instance;
    }

    // imposto il predittore selezionato dall'utente
    setPredictor(index) {
        // console.log da togliere quando si utilizzera l'index
        console.log(index);
        defaultDashboard.rows[0].panels[0].targets[0].refId = this.predictor;
    }

    // imposto il parametro selezionato dall'utente
    setParams(index) {
        // console.log da togliere quando si utilizzera index
        console.log(index);
        defaultDashboard.rows[0].panels[0].targets[0].select[0].pop();
        defaultDashboard.rows[0].panels[0].targets[0].select[0].pop();
        defaultDashboard.rows[0].panels[0].targets[0].select[0].push({
            type: 'field',
            params: [
                this.param,
            ],
        }, {
            type: 'mean',
            params: [],
        });
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

    // costruisco l'array dei parametri relativo alla sorgente selezionta
    buildParams() {
        this.selectedSourceParams = [];
        const sourceName = this.source.substring(0, this.source.indexOf('\n'));
        let i = 0;

        // trovo l'indice del prima sorgente accettabile
        for (; this.availableParams[i].name !== sourceName; ++i);
        // seleziono i parametri relativi alla sorgente
        for (; this.availableParams[i].name === sourceName; ++i) {
            this.selectedSourceParams.push(this.availableParams[i].params);
        }

        this.param = this.selectedSourceParams[0];
    }

    // creo il pannello
    createPanel() {
        if (!this.predictor || !this.source) {
            this.error = 'È necessario selezionare ';
            if (!this.predictor && !this.source) {
                this.error += 'un predittore e una sorgente';
            } else {
                this.error += !this.predictor ? 'un predittore' : 'una sorgente';
            }
        } else {
            this.error = '';
            const sourceIndex = this.availableSources.indexOf(this.source);
            this.setMeasurement(sourceIndex);
            this.setInstance(sourceIndex);
            this.setPredictor(sourceIndex);
            this.setParams(sourceIndex);
            this.setView();
            this.backendSrv
                .post('api/dashboards/import', {
                    // creo e salvo la dashboard contenente il pannello 'Carbon12 Graph Prediction'
                    dashboard: defaultDashboard,
                    folderId: 0,
                    overwrite: true,
                })
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
