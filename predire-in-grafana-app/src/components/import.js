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

// import { appEvents } from 'grafana/app/core/core';

// importo il template della dashboard per la creazione del pannello
import defaultDashboard from '../dashboards/default.json';
import Influx from '../utils/influx';
import GrafanaApiQuery from '../utils/grafana_query';
import FilePredictor from '../utils/r_predittore';

export default class importCtrl {
    /** @ngInject */
    constructor($location, backendSrv) {
        this.$location = $location;
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
        this.grafana = new GrafanaApiQuery(backendSrv);
        this.dashboard = {};
        this.predictor = {};
        this.panelName = '';
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
            // prelevo le data sources disponibili
            const meme = this.grafana.getDataSources();
            meme.then((dataSources) => {
                // dataSoources ha la struttura di un json
                dataSources.forEach((dataSource) => {
                    this.availableDataSources.push(dataSource.name);
                });
                this.step = 2;
            });
        } else {
            this.error = 'Il JSON inserito non è un predittore';
        }
    }

    // imposto la data source selezionata dall'utente
    setDataSource(ds) {
        if (ds) {
            this.error = '';
            defaultDashboard.panels[0].datasource = ds;
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

    // imposto la connessione con il database
    connections() {
        // creo la connessione con il database
        this.influx = new Influx(this.host, parseInt(this.port, 10), this.database);

        const sources = this.influx.getSources();
        const instances = this.influx.getInstances();
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
        this.step = 3;
    }

    // salvo il predittore e le selezioni dell'utente
    storePanelSetting(panelID) {
        const setting = {
            predittore: this.predictor,
            host: this.host,
            port: this.port,
            database: this.database,
            sources: this.sources,
            instances: this.instances,
            params: this.params,
        };
        this.dashboard.templating.list.push(
            {
                hide: 2, // nascosto
                name: panelID.toString(),
                query: setting,
                type: 'textbox',
            },
        );
    }

    // setto il pannello secondo le scelte dell'utente
    setPanel(dashboard) {
        this.dashboard = dashboard;
        const lastPanel = this.dashboard.panels.length - 1;
        this.dashboard.panels[lastPanel].targets.push({
            refId: 'Predizione' + this.dashboard.panels[lastPanel].id,
            measurement: 'predizione' + this.dashboard.panels[lastPanel].id,
            policy: 'default',
            resultFormat: 'time_series',
            orderByTime: 'ASC',
            tags: [],
            select: [
                [{
                    type: 'field',
                    params: [
                        'value',
                    ],
                }, {
                    type: 'last',
                    params: [],
                }],
            ],
        });
        this.dashboard.panels[lastPanel].groupBy.push({
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
        this.setView(lastPanel);
        this.saveDashboard();
    }

    // imposto la visualizzazione selezionata dall'utente
    setView(lastPanel) {
        const panelID = this.dashboard.panels[lastPanel].id;
        if (this.view === 'Grafico') {
            this.dashboard.panels[lastPanel].gridPos.h = 8;
            this.dashboard.panels[lastPanel].gridPos.w = 12;
            this.dashboard.panels[lastPanel].type = 'graph';
            this.dashboard.panels[lastPanel].title = this.panelName ? 
                this.panelName : 'Grafico di Predizione ' + panelID;
        } else {
            this.dashboard.panels[lastPanel].gridPos.h = 4;
            this.dashboard.panels[lastPanel].gridPos.w = 4;
            this.dashboard.panels[lastPanel].type = 'singlestat';
            this.dashboard.panels[lastPanel].thresholds = '0, 0.5';
            this.dashboard.panels[lastPanel].title = this.panelName ?
                this.panelName : 'Indicatore di Predizione ' + panelID;
            this.dashboard.panels[lastPanel].colorBackground = 'true';
        }
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
                .getFolder('0')
                .then((dbList) => {
                    let found = false;
                    for (let i = 0; i < dbList.length && !found; ++i) {
                        if (dbList[i].uid === 'carbon12') {
                            found = true;
                        }
                    }
                    if (found) {
                        this.grafana
                            .getDashboard('predire-in-grafana')
                            .then((db) => {
                                this.setPanel(db.dashboard);
                                this.storePanelSetting(db.dashboard.version + 1);
                            });
                    } else {
                        this.influx.deletePredictions();
                        this.setPanel(defaultDashboard);
                        this.storePanelSetting(1);
                    }
                });
        }
    }

    // salvo la dashboard
    saveDashboard() {
        // appEvents.emit('alert-success', ['Pannello creato', '']);
        this.grafana
            .postDashboard(this.dashboard)
            .then((db) => {
                // reindirizzo alla pagina che gestisce la a predizione
                this.$location.url('plugins/predire-in-grafana-app/page/predizione');
                window.location.href = 'plugins/predire-in-grafana-app/page/predizione';
            });
    }
}

importCtrl.templateUrl = 'components/import.html';
