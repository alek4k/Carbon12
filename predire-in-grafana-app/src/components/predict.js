/**
 * File name: predict.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import { appEvents } from 'grafana/app/core/core';
import { InfinitySwag } from '../utils/infinitySwag';
import GrafanaApiQuery from '../utils/grafana_query';
import Dashboard from "../utils/dashboard";

export default class predictCtrl {
    /** @ngInject */
    constructor($location, $scope, backendSrv) {
        this.$location = $location;
        this.$scope = $scope;
        this.backendSrv = backendSrv;
        this.grafana = new GrafanaApiQuery(this.backendSrv);
        this.panelsAreShown = false;
        InfinitySwag.setBackendSrv(this.$scope, this.backendSrv);
        this.init();

        // localStorage will be cleared on tab close
        window.addEventListener('unload', function () {
            const toRemove = [];
            for (let i = 0; i < localStorage.length; ++i) {
                if (localStorage.key(i).startsWith('started')) {
                    toRemove.push(localStorage.key(i));
                }
            }
            toRemove.forEach((localItem) => {
                localStorage.removeItem(localItem);
            });
        });
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
                                this.started = [];
                                for (let i = 0; i < db.dashboard.panels.length; ++i) {
                                    if (localStorage.getItem('started' + i) === null) {
                                        this.started[i] = false;
                                        localStorage.setItem('started' + i, 'no');
                                    } else {
                                        this.started[i] =
                                            localStorage.getItem('started' + i) === 'yes';
                                    }
                                }
                                this.getPanelsState(db.dashboard.panels);
                            }
                            this.$scope.$evalAsync();
                        });
                }
                this.$scope.$evalAsync();
            });
    }

    getPanelsState(panels) {
        this.time = [];
        this.timeUnit = [];
        this.allPanels = [];
        this.graphPanels = [];
        this.value = [];
        this.when = [];
        this.message = [];
        panels.forEach((panel) => {
            this.allPanels.push(panel.title);
            this.time.push('1');
            this.timeUnit.push('secondi');
            if (panel.type === 'graph') {
                this.graphPanels.push(panel.title);
                if (panel.alert !== undefined) {
                    this.teamsUrl = panel.alert.notifications[0].uid ? this.oldTeamsUrl : '';
                    this.value.push(panel.alert.conditions[0].evaluator.params[0].toString());
                    this.when.push(
                        panel.alert.conditions[0].evaluator.type === 'gt'
                            ? 'superiore' : 'inferiore'
                    );
                    this.message.push(panel.alert.message);
                } else {
                    this.value.push('');
                    this.when.push('');
                    this.message.push('');
                }
            }
        });
    }

    timeToMilliseconds(index) {
        if (this.time[index]) {
            try {
                parseFloat(this.time[index]);
            } catch (err) {
                return 0.0;
            }
            if (this.timeUnit[index] === 'secondi') {
                return parseFloat(this.time[index]) * 1000;
            }
            return parseFloat(this.time[index]) * 60000;
        }
        return 0.0;
    }

    configTeamsSender() {
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
                for (let i = 0, j = 0; i < this.graphPanels.length; ++j) {
                    try {
                        parseFloat(this.value[i]);
                    } catch (err) {
                        this.value[i] = '';
                    }
                    const complete = this.value[i] && this.when[i];
                    if (db.dashboard.panels[j].type === 'graph') {
                        let dashboard = new Dashboard(db.dashboard);
                        if (complete) {
                            dashboard.setThresholds([{
                                colorMode: "critical",
                                fill: true,
                                line: true,
                                op: (this.when[i] === 'superiore') ? "gt" : "lt",
                                value: parseFloat(this.value[i]),
                            }], j);
                            dashboard.setAlert({
                                conditions: [{
                                    evaluator: {
                                        params: [
                                            parseFloat(this.value[i]),
                                        ],
                                        type: (this.when[i] === 'superiore') ? "gt" : "lt",
                                    },
                                    operator: {
                                        type: "and"
                                    },
                                    query: {
                                        params: [
                                            db.dashboard.panels[j].targets[0].refId,
                                            '1m',
                                            "now",
                                        ]
                                    },
                                    reducer: {
                                        params: [],
                                        type: "avg"
                                    },
                                    type: "query"
                                }],
                                executionErrorState: "alerting",
                                frequency: "30s",
                                message: this.message[i],
                                name: this.graphPanels[i] + " alert",
                                noDataState: "alerting",
                                notifications: [{
                                    uid: alertName,
                                }],
                            }, j);
                        } else if (db.dashboard.panels[j].alert !== undefined) {
                            dashboard.deleteThresholds(j);
                            dashboard.deleteAlert(j);
                        }
                        ++i;
                    }
                }
                this.grafana
                    .postDashboard(db.dashboard)
                    .then(() => {
                        this.$scope.$evalAsync();
                    });
                this.$scope.$evalAsync();
            });
    }

    startPrediction(index) {
        const refreshTime = this.timeToMilliseconds(index);
        if (this.dashboardEmpty) {
            appEvents.emit('alert-error', ['Dashboard vuota', '']);
        } else if (refreshTime <= 0.0) {
            appEvents.emit('alert-error', ['Frequenza di predizione non supportata', '']);
        } else {
            this.started[index] = true;
            localStorage.setItem('started' + index, 'yes');
            this.configTeamsSender();
            appEvents.emit('alert-success', ['Predizione avviata', '']);
            InfinitySwag.startPrediction(index, refreshTime);
        }
    }

    stopPrediction(index) {
        this.started[index] = false;
        localStorage.setItem('started' + index, 'no');
        appEvents.emit('alert-success', ['Predizione terminata', '']);
        InfinitySwag.stopPrediction(index);
    }

    redirect() {
        this.$location.url(this.dashboardExists
            ? '/d/carbon12/predire-in-grafana' : 'plugins/predire-in-grafana-app/page/import');
    }
}

predictCtrl.templateUrl = 'components/predict.html';
