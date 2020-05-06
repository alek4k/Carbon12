/**
 * File name: import.js
 * Date: 2020-02-25
 *
 * @file Classe che rappresenta la pagina principale di configurazione del plug-in
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: aggiunto metodo saveDashboard()
 */

<<<<<<< HEAD
// import { appEvents } from 'grafana/app/core/core';

// importo il template della dashboard per la creazione del pannello
import defaultDashboard from '../dashboards/default.json';
import Influx from '../utils/influx';
import GrafanaApiQuery from '../utils/grafana_query';
import FilePredictor from '../utils/r_predittore';
=======
// eslint-disable-next-line import/no-unresolved
import { appEvents } from 'grafana/app/core/core';

import Influx from '../utils/influx';
import GrafanaApiQuery from '../utils/grafana_query';
import FilePredictor from '../utils/r_predittore';
import Builder from '../utils/builder';
import Dashboard from '../utils/dashboard';
import Panel from '../utils/panel';
>>>>>>> origin/plugin

export default class importCtrl {
    /** @ngInject */

    /**
     * Costruisce l'oggetto che rappresenta la pagina principale di configurazione del plug-in
     * @param {$location} Object permette la gestione dell'URL della pagina
     * @param {$scope} Object gestisce la comunicazione tra controller e view
     * @param {backendSrv} Object rappresenta il backend di Grafana
     */
    constructor($location, $scope, backendSrv) {
        this.$location = $location;
<<<<<<< HEAD
=======
        this.$scope = $scope;
>>>>>>> origin/plugin
        this.step = 1;
        this.influx = null;
        this.grafana = new GrafanaApiQuery(backendSrv);
<<<<<<< HEAD
        this.dashboard = {};
        this.predictor = {};
        this.panelName = '';
=======
>>>>>>> origin/plugin
    }

    /**
     * Carica il file del predittore
     * @param {json} Object rappresenta il contenuto del predittore
     */
    onUpload(json) {
        // controllo che il JSON inserito abbia la struttura desiderata
        const fPredictor = new FilePredictor(json);
        if (fPredictor.validity()) {
            this.error = '';
            this.predictor = fPredictor.getConfiguration();
            this.notes = fPredictor.getNotes();
            this.model = fPredictor.getModel();
            this.view = (this.model === 'SVM') ? 'Indicatore' : 'Grafico';
            // creo l'array con le sorgenti di addestramento
            this.availableDataEntry = fPredictor.getDataEntry();
            // prelevo le data sources disponibili
            this.loadDataSources();
        } else {
            this.error = 'Il JSON inserito non è un predittore';
<<<<<<< HEAD
            // appEvents.emit('alert-error', ['Predittore non valido', '']);
=======
            appEvents.emit('alert-error', ['Predittore non valido', '']);
>>>>>>> origin/plugin
        }
    }

    /**
     * Carica le sorgenti dati disponibili in Grafana
     */
    loadDataSources() {
        this.availableDataSources = [];
        this.dataSource = '';
        this.newDataSource = '';
        this.database = '';
        this.host = 'http://localhost';
        this.port = '8086';
        this.grafana
            .getDataSources()
            .then((dataSources) => {
                // dataSources ha la struttura di un json
                dataSources.forEach((dataSource) => {
                    this.availableDataSources.push(dataSource.name);
                });
                this.step = (this.step === 2) ? 3 : 2;
                this.$scope.$evalAsync();
            });
    }

    /**
     * Imposta la sorgente dati selezionata dall'utente
     */
    setDataSource() {
        if (this.dataSource) {
            this.error = '';
            this.grafana
                .getDataSources()
                .then((dataSource) => {
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
                            this.connection();
                        }
                    }
                    this.$scope.$evalAsync();
                });
        } else {
            this.error = 'È necessario selezionare una sorgente dati';
        }
    }

    /**
     * Aggiunge la configurazione della sorgente dati alla lista delle sorgenti dati di Grafana
     */
    addDataSource() {
        const configComplete = this.newDataSource && this.database && this.host && this.port;
        if (configComplete) {
            this.error = '';
            this.grafana
                .postDataSource(this.newDataSource, this.database, this.host, this.port)
                .then(() => {
                    this.connection();
                    this.$scope.$evalAsync();
                });
        } else {
            this.error = 'La configurazione non è completa';
        }
    }

    /**
     * Imposta la connessione con il database
     */
    connection() {
        // creo la connessione con il database
        this.influx = new Influx(this.host, parseInt(this.port, 10), this.database);

        const sources = this.influx.getSources();
<<<<<<< HEAD
        // const instances = this.influx.getInstances();
=======

        this.availableSources = [];
        this.sources = [];
        this.availableParams = [];
        this.params = [];
        this.availableInstances = [];
        this.instances = [];
>>>>>>> origin/plugin
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
        if (!this.availableSources.length) {
            this.emptyDataSource = true;
        } else {
            this.emptyDataSource = false;
        }

        this.step = 3;
    }

    /**
     * Salva le proprietà del pannello con l'id uguale a quello passato
     * @param {panelID} Number rappresenta l'id del pannello di cui sto salvando le proprietà
     */
    storePanelSettings(panelID) {
        const settings = {
            predittore: this.predictor,
            model: this.model,
            host: this.host,
            port: this.port,
            database: this.database,
            sources: this.sources,
            instances: this.instances,
            params: this.params,
        };
        this.dashboard.storeSettings(panelID, settings);
    }

    /**
     * Crea il pannello con l'id uguale a quello passato
     * @param {panelID} Number rappresenta l'id del pannello da creare
     */
    panelGenerator(panelID) {
        const config = {
            id: panelID,
            type: this.view,
            title: this.panelName,
            description: this.description,
            model: this.model,
            dataSource: this.dataSource ? this.dataSource : this.newDataSource,
        };
        const builder = new Builder(config); // aggiungere: description, background
        const target = builder.buildTarget();
        const view = builder.buildView();
        const panel = new Panel(target, view);
        this.storePanelSettings(panelID);
        this.dashboard.addPanel(panel);
        this.saveDashboard();
    }

<<<<<<< HEAD
    // imposto la visualizzazione selezionata dall'utente
    setView(lastPanel) {
        const panelID = this.dashboard.panels[lastPanel].id;
        if (this.view === 'Grafico') {
            this.dashboard.panels[lastPanel].gridPos.h = 8;
            this.dashboard.panels[lastPanel].gridPos.w = 12;
            this.dashboard.panels[lastPanel].type = 'graph';
            this.dashboard.panels[lastPanel].title = this.panelName
                ? this.panelName : 'Grafico di Predizione ' + panelID;       
            this.dashboard.panels[lastPanel].description = `Indicatore relativo alla predizione di: ${this.sources}`;
        } else {
            this.dashboard.panels[lastPanel].gridPos.h = 4;
            this.dashboard.panels[lastPanel].gridPos.w = 4;
            this.dashboard.panels[lastPanel].type = 'singlestat';
            this.dashboard.panels[lastPanel].thresholds = '0, 0.5';
            this.dashboard.panels[lastPanel].title = this.panelName
                ? this.panelName : 'Indicatore di Predizione ' + panelID;
            this.dashboard.panels[lastPanel].description = `Indicatore relativo alla predizione di ${this.sources}`;
            this.dashboard.panels[lastPanel].colorBackground = 'true';
        }
    }

    // creo il pannello
=======
    /**
     * Gestisce la creazione del nuovo pannello
     */
>>>>>>> origin/plugin
    createPanel() {
        for (let i = 0; i < this.availableDataEntry.length && !this.error; ++i) {
            if (this.sources[i] === undefined) {
                this.error = 'La sorgente di '
                    + this.availableDataEntry[i] + ' non è stata selezionata';
            } else {
                this.error = '';
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
                                let newID = 1;
                                db.dashboard.panels.forEach((panel) => {
                                    if (newID <= panel.id) {
                                        newID = panel.id + 1;
                                    }
                                });
                                this.influx.deletePrediction(newID);
                                this.dashboard = new Dashboard(db.dashboard);
                                this.panelGenerator(newID);
                                this.$scope.$evalAsync();
                            });
                    } else {
                        this.influx.deleteAllPredictions();
                        this.dashboard = new Dashboard();
                        this.panelGenerator(1);
                    }
                    this.$scope.$evalAsync();
                });
        }
    }

    /**
     * Salva la dashboard
     */
    saveDashboard() {
        // appEvents.emit('alert-success', ['Pannello creato', '']);
        this.grafana
            .postDashboard(this.dashboard.getJSON())
            .then(() => {
                // reindirizzo alla pagina che gestisce la predizione
                this.$location.url('plugins/predire-in-grafana-app/page/predizione');
                this.$scope.$evalAsync();
                // eseguo il refresh della pagina per aggiornare il backend di Grafana
                window.location.assign('plugins/predire-in-grafana-app/page/predizione');
            });
    }
}

importCtrl.templateUrl = 'components/import.html';
