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

export default class predictCtrl {
    /** @ngInject */
    constructor($location, backendSrv) {
        this.$location = $location;
        this.backendSrv = backendSrv;
        this.time = '';
        this.timeUnit = 'secondi';
        this.grafana = new GrafanaApiQuery(this.backendSrv);
        this.oldTeamsUrl = '';
        this.teamsUrl = '';
        this.panelsAreShown = false;
        this.graphPanels = [];
        this.value = [];
        this.when = [];
        this.message = [];
        this.init();

        // localStorage will be cleared on tab close
        window.addEventListener('unload', function () {
            localStorage.removeItem('started');
        });
    }

    init() {
        if (window.localStorage.getItem('started') === undefined) {
            this.started = false;
            window.localStorage.setItem('started', 'no');
        } else {
            this.started = window.localStorage.getItem('started') === 'yes';
        }
        this.grafana
            .getAlerts()
            .then((alerts) => {
                for (let i = 0; i < alerts.length && !this.teamsUrl; ++i) {
                    if (alerts[i].uid === 'predire-in-grafana-alert') {
                        this.oldTeamsUrl = alerts[i].settings.url;
                    }
                }
                this.verifyDashboard();
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
                            this.getAlertsState(db.dashboard.panels);
                        });
                }
            });
    }

    getAlertsState(panels) {
        this.graphPanels = [];
        this.value = [];
        this.when = [];
        panels.forEach((panel) => {
            if (panel.type === 'graph') {
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
                this.graphPanels.push(panel);
            }
        });
    }

    timeToMilliseconds() {
        if (this.time) {
            try {
                parseFloat(this.time);
            } catch (err) {
                return 0.0;
            }
            if (this.timeUnit === 'secondi') {
                return parseFloat(this.time) * 1000;
            }
            return parseFloat(this.time) * 60000;
        }
        return 0.0;
    }

    configTeamsSender() {
        if(this.teamsUrl) {
            if (!this.oldTeamsUrl) {
                this.grafana.postAlert(this.teamsUrl);
            } else if (this.oldTeamsUrl !== this.teamsUrl) {
                this.grafana
                    .deleteAlert('predire-in-grafana-alert')
                    .then(() => {
                        this.grafana.postAlert(this.teamsUrl);
                    });
            }
            this.saveAlertsState('predire-in-grafana-alert');
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
                    } catch {
                        this.value[i] = '';
                    }
                    const complete = this.value[i] && this.when[i];
                    if (db.dashboard.panels[j].type === 'graph') {
                        if (complete) {
                            db.dashboard.panels[j].thresholds = [{
                                colorMode: "critical",
                                fill: true,
                                line: true,
                                op: (this.when[i] === 'superiore') ? "gt" : "lt",
                                value: parseFloat(this.value[i]),
                            }];
                            db.dashboard.panels[j].alert = {
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
                                name: this.graphPanels[i].title + " alert",
                                noDataState: "alerting",
                                notifications: [{
                                    uid: alertName,
                                }],
                            };
                        } else if (db.dashboard.panels[j].alert !== undefined) {
                            delete db.dashboard.panels[j].thresholds;
                            delete db.dashboard.panels[j].alert;
                        }
                        ++i;
                    }
                }
                this.grafana.postDashboard(db.dashboard);
            });
    }

    startPrediction() {
        const refreshTime = this.timeToMilliseconds();
        if (!this.dashboardExists) {
            appEvents.emit('alert-error', ['Dashboard non trovata', '']);
        } else if (this.dashboardEmpty) {
            appEvents.emit('alert-error', ['Dashboard vuota', '']);
        } else if (refreshTime <= 0.0) {
            appEvents.emit('alert-error', ['Frequenza di predizione non supportata', '']);
        } else {
            this.started = true;
            window.localStorage.setItem('started', 'yes');
            if (InfinitySwag.backendSrv === null) {
                InfinitySwag.setBackendSrv(this.backendSrv);
            }
            this.configTeamsSender();
            appEvents.emit('alert-success', ['Predizione avviata', '']);
            InfinitySwag.startPrediction(refreshTime);
        }
    }

    stopPrediction() {
        this.started = false;
        window.localStorage.setItem('started', 'no');
        appEvents.emit('alert-success', ['Predizione terminata', '']);
        InfinitySwag.stopPrediction();
    }

    redirect() {
        this.$location.url('/d/carbon12/predire-in-grafana');
    }
}

predictCtrl.templateUrl = 'components/predict.html';
