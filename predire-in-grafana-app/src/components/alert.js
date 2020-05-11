/**
 * File name: alert.js
 * Date: 2020-05-06
 *
 * @file Classe per gestione della pagina degli alert
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificato metodo saveAlertsState(String)
 */

// eslint-disable-next-line import/no-unresolved
import { appEvents } from 'grafana/app/core/core';
import GrafanaApiQuery from '../utils/grafana_query';
import Dashboard from '../utils/dashboard';

export default class alertCtrl {
    /** @ngInject */

    /**
     * Costruisce l'oggetto che rappresenta la pagina per gestione degli alert
     * @param {$location} Object permette la gestione dell'URL della pagina
     * @param {$scope} Object gestisce la comunicazione tra controller e view
     * @param {backendSrv} Object rappresenta il backend di Grafana
     */
    constructor($location, $scope, backendSrv) {
        this.$location = $location;
        this.$scope = $scope;
        this.grafana = new GrafanaApiQuery(backendSrv);
        this.step = 1;
        this.init();
    }

    /**
     * Acquisisce informazioni sull'alert predefinito e controlla la dashboard
     */
    init() {
        this.grafana
            .getAlerts()
            .then((alerts) => {
                this.oldTeamsUrl = '';
                for (let i = 0; i < alerts.length && !this.oldTeamsUrl; ++i) {
                    if (alerts[i].uid === 'predire-in-grafana-alert') {
                        this.oldTeamsUrl = alerts[i].settings.url;
                    }
                }
                this.verifyDashboard();
                this.$scope.$evalAsync();
            });
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
                            this.dashboardEmpty = !this.dashboard.getJSON().panels.length;
                            if (!this.dashboardEmpty) {
                                this.isRL = [];
                                this.dashboard.getJSON().templating.list.forEach((variable) => {
                                    this.isRL.push(JSON.parse(variable.query).model === 'RL');
                                });
                                this.getAlertsState(this.dashboard.getJSON().panels);
                            }
                            this.$scope.$evalAsync();
                        });
                }
                this.$scope.$evalAsync();
            });
    }

    /**
     * Acquisisce lo stato degli alert presenti nei pannelli della dashboard
     * @param {panels} Object rappresenta il contenuto dei pannelli presenti nella dashboard
     */
    getAlertsState(panels) {
        this.panelsList = [];
        this.isGraph = [];
        this.value = [];
        this.when = [];
        this.message = [];
        panels.forEach((panel) => {
            this.panelsList.push(panel.title);
            this.isGraph.push(panel.type === 'graph');
            if (panel.alert !== undefined) {
                // il tipo è graph
                this.teamsUrl = panel.alert.notifications[0].uid ? this.oldTeamsUrl : '';
                this.value.push(panel.alert.conditions[0].evaluator.params[0].toString());
                this.when.push(panel.alert.conditions[0].evaluator.type === 'gt'
                    ? 'superiore' : 'inferiore');
                this.message.push(panel.alert.message);
            } else if (panel.type === 'singlestat' && panel.thresholds !== undefined && panel.thresholds ) {
                this.value.push(panel.thresholds.substr(0, panel.thresholds.indexOf(',')));
                this.when.push(panel.colors[0] === '#299c46' ? 'superiore' : 'inferiore');
                this.message.push('');
            } else {
                this.value.push('');
                this.when.push('');
                this.message.push('');
            }
        });
    }

    /**
     * Resetta lo stato dell'alert del pannello relativo all'indice passato
     * @param {index} Number rappresenta l'indice del pannello sul quale rimuovere l'alert
     */
    clearAlertsState(index) {
        if (index !== undefined) {
            this.value[index] = '';
            this.when[index] = '';
            this.message[index] = '';
        } else {
            for (let i = 0; i < this.value.length; ++i) {
                if (this.isRL[i]) {
                    this.value[i] = '';
                    this.when[i] = '';
                    this.message[i] = '';
                }
            }
        }
    }

    /**
     * Configura gli alert di tutti i pannelli della dashboard, escludendo quelli non impostati
     */
    configAlerts() {
        if (this.teamsUrl) {
            if (!this.oldTeamsUrl) {
                this.grafana
                    .postAlert(this.teamsUrl)
                    .then(() => {
                        this.saveAlertsState('predire-in-grafana-alert');
                        this.$scope.$evalAsync();
                    });
            } else if (this.oldTeamsUrl !== this.teamsUrl) {
                this.grafana
                    .updateAlert(this.teamsUrl)
                    .then(() => {
                        this.saveAlertsState('predire-in-grafana-alert');
                        this.$scope.$evalAsync();
                    });
            } else {
                this.saveAlertsState('predire-in-grafana-alert');
            }
        } else {
            this.saveAlertsState('');
        }
    }

    /**
     * Salva lo stato della configurazione di tutti gli alert della dashboard
     * @param {alertName} String rappresenta il nome dell'alert
     */
    saveAlertsState(alertName) {
        let error = false;
        for (let i = 0; i < this.panelsList.length && !error; ++i) {
            try {
                parseFloat(this.value[i]);
            } catch (err) {
                this.value[i] = '';
            }
            if ((!this.value[i] && this.when[i]) || (this.value[i] && !this.when[i])) {
                error = true;
                appEvents.emit('alert-error', ['L\'alert di "'
                    + this.panelsList[i] + '" è incompleto', '']);
            } else if (this.value[i] && this.when[i]) {
                this.dashboard.setThresholds([{
                    colorMode: 'critical',
                    fill: true,
                    line: true,
                    op: (this.when[i] === 'superiore') ? 'gt' : 'lt',
                    value: parseFloat(this.value[i]),
                }], i);
                this.dashboard.setAlert({
                    conditions: [{
                        evaluator: {
                            params: [
                                parseFloat(this.value[i]),
                            ],
                            type: (this.when[i] === 'superiore') ? 'gt' : 'lt',
                        },
                        query: {
                            params: [
                                this.dashboard.getJSON().panels[i].targets[0].refId,
                                '1s',
                                'now',
                            ],
                        },
                        reducer: {
                            params: [],
                            type: 'last',
                        },
                        type: 'query',
                    }],
                    executionErrorState: 'keep_state',
                    frequency: '1s',
                    message: this.message[i],
                    name: this.panelsList[i] + ' alert',
                    noDataState: 'keep_state',
                    notifications: [{
                        uid: alertName,
                    }],
                }, i);
            } else {
                this.dashboard.removeThresholds(i);
                this.dashboard.removeAlert(i);
            }
        }
        if (!error) {
            this.grafana
                .postDashboard(this.dashboard.getJSON())
                .then(() => {
                    appEvents.emit('alert-success', ['Salvataggio completato', '']);
                    this.$scope.$evalAsync();
                });
        }
    }

    /**
     *  Reindirizza l'URL della pagina corrente
     */
    redirect() {
        this.$location.url(this.dashboardExists
            ? '/d/carbon12/predire-in-grafana' : 'plugins/predire-in-grafana-app/page/import');
    }
}

alertCtrl.templateUrl = 'components/alert.html';
