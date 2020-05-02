/**
 * File name: predict.js
 * Date: 2020-04-01
 *
 * @file Classe per gestione della pagina di predizione
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificato metodo resetButtonsState(String)
 */

import { appEvents } from 'grafana/app/core/core';
import InfinitySwag from '../utils/infinitySwag';
import GrafanaApiQuery from '../utils/grafana_query';

export default class predictCtrl {
    /** @ngInject */
    
    /**
     * Costruisce l'oggetto che rappresenta la pagina per gestione della predizione
     * @param {$location} Object permette la gestione dell'URL della pagina
     * @param {$scope} Object gestice la comunicazione tra controller e view
     * @param {backendSrv} Object rappresenta il backend di Grafana
     */
    constructor($location, $scope, backendSrv) {
        this.$location = $location;
        this.$scope = $scope;
        this.backendSrv = backendSrv;
        this.grafana = new GrafanaApiQuery(backendSrv);
        this.dashboardExists = false;
        this.dashboardEmpty = true;
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

    /**
     * Ripristina lo stato dei pulsanti che gestiscono la previsione secondo la proprietà passata
     * @param {onStatus} String rappresenta lo stato dei pulsanti che verranno coinvolti nel ripristino
     */
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

    
    /**
     * Acquisice lo stato della previsione dei pannelli presenti nella dasboard
     * @param {panels} Object rappresenta i pannelli presenti nella dasboard
     */
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

    /**
     * Ritorna la frequenza di predizione convertita in millisecondi
     * @param {index} Number rappresenta l'indice del pannello sul quale applicare la conversione della frequenza
     * @returns {Number} rappresenta la conversione della frequenza di predizione del pannello richiesto
     */
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
            localStorage.setItem('btn' + index, this.time[index] + this.timeUnit[index][0]);
            appEvents.emit('alert-success', ['Predizione avviata', '']);
            InfinitySwag.startPrediction(index, refreshTime);
        }
    }

    /**
     * Ferma la predizione del pannello richiesto
     * @param {index} Number rappresenta l'indice del pannello sul quale fermare la predizione
     */
    stopPrediction(index) {
        this.started[index] = false;
        localStorage.setItem('btn' + index, 'no');
        appEvents.emit('alert-success', ['Predizione terminata', '']);
        InfinitySwag.stopPrediction(index);
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
