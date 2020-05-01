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
import InfinitySwag from '../utils/infinitySwag';
import GrafanaApiQuery from '../utils/grafana_query';

export default class predictCtrl {
    /** @ngInject */
    constructor($location, $scope, backendSrv) {
        this.$location = $location;
        this.$scope = $scope;
        this.backendSrv = backendSrv;
        this.grafana = new GrafanaApiQuery(backendSrv);
        this.dashboardExists = false;
        this.dashboardEmpty = true;
        this.verifyDashboard();
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
                                this.resetButtonsState('no');
                                InfinitySwag.setBackendSrv(this.$scope, this.backendSrv);
                                this.getPanelsState(db.dashboard.panels);
                            } else {
                                this.resetButtonsState();
                            }
                            this.$scope.$evalAsync();
                        });
                } else {
                    this.resetButtonsState();
                }
                this.$scope.$evalAsync();
            });
    }

    resetButtonsState(onStatus) {
        const toRemove = [];
        for (let i = 0; i < localStorage.length; ++i) {
            const localItem = localStorage.key(i);
            if (localItem.startsWith('btn')) {
                switch(onStatus) {
                    case undefined: 
                        if (localStorage.getItem(localItem) !== 'no') {
                            toRemove.push(localItem);
                            InfinitySwag.stopPrediction(parseInt(localItem.substr(3), 10));
                        }
                    default:
                        if (localStorage.getItem(localItem) == 'no') {
                            toRemove.push(localItem);
                        }
                }
            }
        }
        toRemove.forEach((localItem) => {
            localStorage.removeItem(localItem);
        });
    }

    getPanelsState(panels) {
        this.started = [];
        this.time = [];
        this.timeUnit = [];
        this.panelsList = [];
        for (let i = 0; i < panels.length; ++i) {
            this.time.push('1');
            this.timeUnit.push('secondi');
            if (localStorage.getItem('btn' + i) === null) {
                this.started[i] = false;
                localStorage.setItem('btn' + i, 'no');
            } else {
                this.started[i] = localStorage.getItem('btn' + i) !== 'no';
                if (this.started[i]) {
                    const value = localStorage.getItem('btn' + i);
                    this.time[i] = value.substr(0, value.length - 1);
                    this.timeUnit[i] = value[value.length - 1] === 's' ? 'secondi' : 'minuti';
                    InfinitySwag.startPrediction(i, this.timeToMilliseconds(i));
                }
            }
            this.panelsList.push(panels[i].title);
        }
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

    startPrediction(index) {
        const refreshTime = this.timeToMilliseconds(index);
        if (this.dashboardEmpty) {
            appEvents.emit('alert-error', ['Dashboard vuota', '']);
        } else if (refreshTime <= 0.0) {
            appEvents.emit('alert-error', ['Frequenza di predizione non supportata', '']);
        } else {
            this.started[index] = true;
            localStorage.setItem('btn' + index, this.time[index] + this.timeUnit[index][0]);
            appEvents.emit('alert-success', ['Predizione avviata', '']);
            InfinitySwag.startPrediction(index, refreshTime);
        }
    }

    stopPrediction(index) {
        this.started[index] = false;
        localStorage.setItem('btn' + index, 'no');
        appEvents.emit('alert-success', ['Predizione terminata', '']);
        InfinitySwag.stopPrediction(index);
    }

    redirect() {
        this.$location.url(this.dashboardExists
            ? '/d/carbon12/predire-in-grafana' : 'plugins/predire-in-grafana-app/page/import');
    }
}

predictCtrl.templateUrl = 'components/predict.html';
