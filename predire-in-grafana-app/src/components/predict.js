/**
 * File name: predict.js
 * Date: 2020-05-06
 *
 * @file Classe per gestione della pagina di predizione
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificato metodo resetButtonsState(String)
 */

// eslint-disable-next-line import/no-unresolved
import { appEvents } from 'grafana/app/core/core';
import predictLooper from '../utils/predictLooper';
import GrafanaApiQuery from '../utils/grafana_query';
import Dashboard from '../utils/dashboard';

export default class predictCtrl {
    /** @ngInject */

    /**
     * Costruisce l'oggetto che rappresenta la pagina per gestione della predizione
     * @param {$location} Object permette la gestione dell'URL della pagina
     * @param {$scope} Object gestisce la comunicazione tra controller e view
     * @param {backendSrv} Object rappresenta il backend di Grafana
     */
    constructor($location, $scope, backendSrv) {
        this.$location = $location;
        this.$scope = $scope;
        this.backendSrv = backendSrv;
        this.grafana = new GrafanaApiQuery(backendSrv);
        this.toRemove = -1;
        this.verifyDashboard();
    }

    /**
     * Controlla lo stato della dashboard
     */
    verifyDashboard() {
        this.grafana
            .getFolder('0')
            .then((dbList) => {
                let found = false;
                for (let i = 0; i < dbList.length && !found; ++i) {
                    if (dbList[i].uid === 'carbon12') {
                        found = true;
                    }
                }
                this.dashboardExists = found;
                if (this.dashboardExists) {
                    this.grafana
                        .getDashboard('predire-in-grafana')
                        .then((db) => {
                            this.dashboard = new Dashboard(db.dashboard);
                            if (this.dashboard.updateSettings()) {
                                this.grafana
                                    .postDashboard(this.dashboard.getJSON())
                                    .then(() => {
                                        this.$scope.$evalAsync();
                                    });
                            }
                            this.dashboardEmpty = ! this.dashboard.getJSON().panels.length;
                            if (!this.dashboardEmpty) {
                                predictLooper.setBackendSrv(this.$scope, this.backendSrv);
                                this.getPanelsState();
                            }
                            this.$scope.$evalAsync();
                        });
                } else {
                }
                this.$scope.$evalAsync();
            });
    }

    /**
     * Acquisisce lo stato della previsione dei pannelli presenti nella dashboard
     */
    getPanelsState() {
        this.started = [];
        this.time = [];
        this.timeUnit = [];
        this.panelsList = [];
        for (let i = 0; i < this.dashboard.getJSON().panels.length; ++i) {
            this.time.push('1');
            this.timeUnit.push('secondi');
            if (JSON.parse(this.dashboard.getJSON().templating.list[i].query).started !== 'no') {
                this.started[i] = true;
                const state = JSON.parse(this.dashboard.getJSON().templating.list[i].query).started;
                this.time[i] = state.substr(0, state.length - 1);
                this.timeUnit[i] = state[state.length - 1] === 's' ? 'secondi' : 'minuti';
                predictLooper.startPrediction(i, this.timeToMilliseconds(i));
            } else {
                this.started[i] = false;
                predictLooper.stopPrediction(i);
            }
            this.panelsList.push(this.dashboard.getJSON().panels[i].title);
        }
    }

    /**
     * Ritorna la frequenza di predizione convertita in millisecondi
     * @param {index} Number rappresenta l'indice del pannello sul quale applicare la conversione della frequenza
     * @returns {Number} rappresenta la conversione della frequenza di predizione del pannello richiesto
     */
    timeToMilliseconds(index) {
        if (this.time[index]) {
            if (Number.isNaN(parseFloat(this.time[index]))) {
                return 0.0;
            }
            if (this.timeUnit[index] === 'secondi') {
                return parseFloat(this.time[index]) * 1000;
            }
            return parseFloat(this.time[index]) * 60000;
        }
        return 0.0;
    }

    /**
     * Avvia la predizione del pannello richiesto
     * @param {index} Number rappresenta l'indice del pannello sul quale avviare la predizione
     */
    startPrediction(index) {
        const refreshTime = this.timeToMilliseconds(index);
        if (this.dashboardEmpty) {
            appEvents.emit('alert-error', ['Dashboard vuota', '']);
        } else if (refreshTime <= 0.0) {
            appEvents.emit('alert-error', ['Frequenza di predizione non supportata', '']);
        } else {
            this.started[index] = true;
            this.dashboard.setPredictionStarted(index, this.time[index] + this.timeUnit[index][0]);
            this.grafana
                .postDashboard(this.dashboard.getJSON())
                .then(() => {
                    appEvents.emit('alert-success', ['Predizione avviata', '']);
                    predictLooper.startPrediction(index, refreshTime);
                    this.$scope.$evalAsync();
                });
        }
    }

    /**
     * Ferma la predizione del pannello richiesto
     * @param {index} Number rappresenta l'indice del pannello sul quale fermare la predizione
     */
    stopPrediction(index) {
        this.started[index] = false;
        this.dashboard.setPredictionStarted(index, 'no');
        this.grafana
            .postDashboard(this.dashboard.getJSON())
            .then(() => {
                appEvents.emit('alert-success', ['Predizione terminata', '']);
                predictLooper.stopPrediction(index);
                this.$scope.$evalAsync();
            });
    }

    /**
     * Rimuove il pannello della dashboard relativo all'indice passato
     * @param {index} Number rappresenta l'indice del pannello della dashboard da rimuovere
     */
    removePanel(index) {
        this.started.forEach((state, i) => {
            predictLooper.stopPrediction(i);
        });
        this.dashboard.removePanel(index);
        this.grafana
            .postDashboard(this.dashboard.getJSON())
            .then(() => {
                document.getElementById('row' + index).remove();
                this.verifyDashboard();
                this.$scope.$evalAsync();
            });
    }

    /**
     * Reindirizza l'URL della pagina corrente
     */
    redirect() {
        this.$location.url(this.dashboardExists
            ? '/d/carbon12/predire-in-grafana' : 'plugins/predire-in-grafana-app/page/import');
    }
}

predictCtrl.templateUrl = 'components/predict.html';
