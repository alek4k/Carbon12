/**
 * File name: infinitySwag.js
 * Date: 2020-04-01
 *
 * @file Classe per la gestione della predizione
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificati metodi startPrediction(Number, Number) e stopPrediction(Number)
 */

import GrafanaApiQuery from './grafana_query';
import Influx from './influx';
import RL from './models/RL_Adapter';
import SVM from './models/SVM_Adapter';
import Dashboard from '../utils/dashboard';

class InfinitySwag {
    /**
     * Costruisce l'oggetto che genera le predizioni
     */
    constructor() {
        this.$scope = null;
        this.backendSrv = null;
        this.db = [];
        this.predictions = [];
    }

    /**
     * Imposta il backend
     * @param {$scope} Object gestisce la comunicazione tra controller e view
     * @param {backendSrv} Object rappresenta il backend di Grafana
     */
    setBackendSrv($scope, backendSrv) {
        this.$scope = $scope;
        this.backendSrv = backendSrv;
        this.setConfig();
    }

    /**
     *  Preleva le variabili globali della dashboard e imposta il database
     */
    setConfig() {
        this.grafana = new GrafanaApiQuery(this.backendSrv);
        this.grafana
            .getDashboard('predire-in-grafana')
            .then((dash) => {
                const dashboard = new Dashboard(dash.dashboard);
                if (dashboard.updateSettings()) {
                    this.variables = dashboard.getJSON().templating.list;
                    this.grafana
                        .postDashboard(dashboard.getJSON())
                        .then(() => {
                            this.setInflux();
                            this.$scope.$evalAsync();
                        });

                } else {
                    this.variables = dashboard.getJSON().templating.list;
                    this.setInflux();
                }
                this.$scope.$evalAsync();
            });
    }

    /**
     *  Crea un'istanza del database per ogni pannello
     */
    setInflux() {
        this.variables.forEach((variable) => {
            this.db.push(
                new Influx(
                    variable.query.host,
                    parseInt(variable.query.port, 10),
                    variable.query.database,
                ),
            );
        });
    }

    /**
     * Salva il valore passato nel database relativo all'indice passato
     * @param {info} Number rappresenta il valore da salvare nel database
     * @param {index} Number rappresenta l'indice del database su cui salvare il dato
     */
    dbWrite(info, index) {
        this.db[index].storeValue('predizione' + this.variables[index].name, info);
    }

    /**
     * Avvia la predizione relativa al pannello richiesto e con la frequenza richiesta
     * @param {index} Number rappresenta l'indice del pannello su chi avviare la predizione
     * @param {refreshTime} Number rappresenta la frequenza della predizione
     */
    startPrediction(index, refreshTime) {
        if (this.predictions[index] === undefined) {
            console.log('START');
            this.predictions[index] = setInterval(() => {
                this.dbWrite(this.getPrediction(index), index);
            }, refreshTime);
        }
    }

    /**
     * Ferma la predizione relativa al pannello richiesto
     * @param {index} Number rappresenta l'indice del pannello su chi fermare la predizione
     */
    stopPrediction(index) {
        console.log('STOP');
        clearInterval(this.predictions[index]);
        this.predictions[index] = undefined;
    }

    /**
     * Ritorna la predizione relativa al pannello richiesto
     * @param {index} Number rappresenta l'indice del pannello del quale si vuole ottenere la predizione
     * @returns {Number} rappresenta la predizione relativa al pannello richiesto
     */
    getPrediction(index) {
        const predictor = this.variables[index].query.predittore;
        const point = [];
        for (let i = 0; i < predictor.D; ++i) {
            point.push(
                this.db[index].getLastValue(
                    this.variables[index].query.sources[i],
                    this.variables[index].query.instances[i],
                    this.variables[index].query.params[i],
                ),
            );
        }
        return this.variables[index].query.model === 'SVM'
            ? this.predictSVM(predictor, point) : this.predictRL(predictor, point);
    }

    /**
     * Ritorna la predizione utilizzando l'algoritmo SVM
     * @param {predictor} Object rappresenta il contenuto della configurazione del predittore
     * @param {point} Array rappresenta i valori delle sorgenti monitorate
     * @returns {Number} rappresenta la predizione, ottenuta con l'SVM, relativa al pannello richiesto
     */
    // eslint-disable-next-line class-methods-use-this
    predictSVM(predictor, point) {
        const svm = new SVM();
        svm.fromJSON(predictor);
        return svm.predictClass(point);
    }

    /**
     * Ritorna la predizione utilizzando l'algoritmo RL
     * @param {predictor} Object rappresenta il contenuto della configurazione del predittore
     * @param {point} Array rappresenta i valori delle sorgenti monitorate
     * @returns {Number} rappresenta la predizione, ottenuta con l'RL, relativa al pannello richiesto
     */
    // eslint-disable-next-line class-methods-use-this
    predictRL(predictor, point) {
        const options = { numX: predictor.D, numY: 1 };
        const rl = new RL(options);
        rl.fromJSON(predictor);
        return rl.predict(point);
    }
}

export default new InfinitySwag();