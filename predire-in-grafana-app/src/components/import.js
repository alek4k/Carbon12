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

import { appEvents } from 'grafana/app/core/core';

// importo il template della dashboard per la creazione del pannello
import defaultDashboard from '../dashboards/default.json';
import Influx from '../utils/influx';
import GrafanaApiQuery from '../utils/grafana_query';
import FilePredictor from '../utils/r_predittore';
import Builder from "../utils/builder";
import Dashboard from "../utils/dashboard";
import Panel from "../utils/panel";

export default class importCtrl {
    /** @ngInject */
    constructor($location, $scope, backendSrv) {
        this.$location = $location;
        this.$scope = $scope;
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
            appEvents.emit('alert-error', ['Predittore non valido', '']);
        }
    }

    loadDataSources() {
        this.availableDataSources = [];
        this.grafana
            .getDataSources()
            .then((dataSources) => {
                // dataSoources ha la struttura di un json
                dataSources.forEach((dataSource) => {
                    this.availableDataSources.push(dataSource.name);
                });
                this.step = (this.step === 2) ? 3 : 2;
                this.$scope.$evalAsync();
            });
    }

    // imposto la data source selezionata dall'utente
    setDataSource() {
        if (this.dataSource) {
            this.error = '';
            defaultDashboard.panels[0].datasource = this.dataSource;
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

    // aggiungo la configurazione della data source alla lista delle data sources
    addDataSource() {
        const configComplete = this.name && this.database && this.host && this.port;
        if (configComplete) {
            this.grafana
                .postDataSource(this.name, this.database, this.host, this.port)
                .then(() => {
                    this.error = '';
                    defaultDashboard.panels[0].datasource = this.name;
                    this.connection();
                    this.$scope.$evalAsync();
                });
        } else {
            this.error = 'La configurazione non è completa';
        }
    }

    // imposto la connessione con il database
    connection() {
        // creo la connessione con il database
        this.influx = new Influx(this.host, parseInt(this.port, 10), this.database);

        const sources = this.influx.getSources();
        // const instances = this.influx.getInstances();
        this.availableSources = [];
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
        this.dashboard1.storeSettings(panelID, settings);
    }

    panelGenerator(panelID){
        this.builder1 = new Builder(); // aggiungere: description, backgroud
        const config = {
            id: panelID,
            type: this.view,
            title: this.panelName,
            description: this.description,
            background: "true",
            datasource: this.dataSource
        }
        const target = this.builder1.buildTarget(config);
        const view = this.builder1.buildView(config);
        this.panel1 = new Panel(target, view);
    }

    createPanel(){
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
                                let newID = 1;
                                db.dashboard.panels.forEach((panel) => {
                                    if (newID <= panel.id) {
                                        newID = panel.id + 1;
                                    }
                                });
                                console.log("");
                                this.influx.deleteMeasurement('predizione' + newID);
                                this.dashboard1 = new Dashboard(db.dashboard);
                                this.panelGenerator(newID);
                                this.storePanelSettings(newID);
                                this.dashboard1.addPanel(this.panel1);
                                this.saveDashboard();
                                this.$scope.$evalAsync();
                            });
                    } else {
                        this.influx.deletePredictions();
                        this.dashboard1 = new Dashboard();
                        this.panelGenerator(1);
                        this.storePanelSettings(1);
                        this.dashboard1.addPanel(this.panel1);
                        this.saveDashboard();
                    }
                    this.$scope.$evalAsync();
                });
        }
        
    }
    
    // salvo la dashboard
    saveDashboard() {
        appEvents.emit('alert-success', ['Pannello creato', '']);
        this.grafana
            .postDashboard(this.dashboard1.getJSON())
            .then((db) => {
                // reindirizzo alla pagina che gestisce la predizione
                this.$location.url('plugins/predire-in-grafana-app/page/predizione');
                this.$scope.$evalAsync();
                window.location.href = 'plugins/predire-in-grafana-app/page/predizione';
            });
    }
}

importCtrl.templateUrl = 'components/import.html';
