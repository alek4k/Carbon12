/**
 * File name: alert.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import { appEvents } from 'grafana/app/core/core';
import GrafanaApiQuery from '../utils/grafana_query';
import Dashboard from '../utils/dashboard';

export default class alertCtrl {
    /** @ngInject */
    constructor($location, $scope, backendSrv) {
        this.$location = $location;
        this.$scope = $scope;
        this.grafana = new GrafanaApiQuery(backendSrv);
        this.init();
    }

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
                            this.dashboardEmpty = !db.dashboard.panels.length;
                            if (!this.dashboardEmpty) {
                                this.getAlertsState(db.dashboard.panels);
                            }
                            this.$scope.$evalAsync();
                        });
                }
                this.$scope.$evalAsync();
            });
    }

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
                this.teamsUrl = panel.alert.notifications[0].uid ? this.oldTeamsUrl : '';
                this.value.push(panel.alert.conditions[0].evaluator.params[0].toString());
                this.when.push(panel.alert.conditions[0].evaluator.type === 'gt'
                    ? 'superiore' : 'inferiore'
                );
                this.message.push(panel.alert.message);
            } else if (panel.type === 'singlestat') {
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

    clearAlertsState(index) {
        if (index !== undefined) {
            this.value[index] = '';
            this.when[index] = '';
            this.message[index] = '';
        } else {
            for (let i = 0; i < this.value.length; ++i) {
                this.value[i] = '';
                this.when[i] = '';
                this.message[i] = '';
            }
        }
    }

    configAlerts() {
        if(this.teamsUrl) {
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
            }
        } else {
            this.saveAlertsState('');
        }
    }

    saveAlertsState(alertName) {
        this.grafana
            .getDashboard('predire-in-grafana')
            .then((db) => {
                let error = false;
                for (let i = 0; i < this.panelsList.length && !error; ++i) {
                    try {
                        parseFloat(this.value[i]);
                    } catch {
                        this.value[i] = '';
                    }
                    const dashboard = new Dashboard(db.dashboard);
                    if ((!this.value[i] && this.when[i]) || (this.value[i] && !this.when[i])) {
                        error = true;
                        appEvents.emit('alert-error', ["L'altert di " + '"'
                            + this.panelsList[i] + '" è incompleto', '']);
                    } else {
                        if (this.value[i] && this.when[i]) {
                            dashboard.setThresholds([{
                                colorMode: 'critical',
                                fill: true,
                                line: true,
                                op: (this.when[i] === 'superiore') ? 'gt' : 'lt',
                                value: parseFloat(this.value[i]),
                            }], i);
                            dashboard.setAlert({
                                conditions: [{
                                    evaluator: {
                                        params: [
                                            parseFloat(this.value[i]),
                                        ],
                                        type: (this.when[i] === 'superiore') ? 'gt' : 'lt',
                                    },
                                    operator: {
                                        type: 'and'
                                    },
                                    query: {
                                        params: [
                                            db.dashboard.panels[i].targets[0].refId,
                                            '1m',
                                            'now',
                                        ]
                                    },
                                    reducer: {
                                        params: [],
                                        type: 'avg'
                                    },
                                    type: 'query'
                                }],
                                executionErrorState: 'alerting',
                                frequency: '30s',
                                message: this.message[i],
                                name: this.panelsList[i] + ' alert',
                                noDataState: 'alerting',
                                notifications: [{
                                    uid: alertName,
                                }],
                            }, i);
                        } else {
                            dashboard.deleteThresholds(i);
                            dashboard.deleteAlert(i);
                        }
                    }
                }
                if (!error) {
                    this.grafana
                        .postDashboard(db.dashboard)
                        .then(() => {
                            appEvents.emit('alert-success', ['Salvataggio completato', '']);
                            this.$scope.$evalAsync();
                    });
                }
                this.$scope.$evalAsync();
            });
    }

    redirect() {
        this.$location.url(this.dashboardExists
            ? '/d/carbon12/predire-in-grafana' : 'plugins/predire-in-grafana-app/page/import');
    }
}

alertCtrl.templateUrl = 'components/alert.html';
