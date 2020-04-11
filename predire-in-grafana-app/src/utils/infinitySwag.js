/**
 * File name: infinitySwag.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import Influx from './influx.js';

const SVM = require('./models/SVM_Adapter');
const GrafanaApiQuery = require('./grafana_query.js');

class InfinitySwag {
    constructor() {
        this.backendSrv = null;
        this.db = [];
    }

    setBackendSrv(backendSrv) {
        this.backendSrv = backendSrv;
        this.setConfig();
    }

    setConfig() {
        this.grafana = new GrafanaApiQuery(this.backendSrv);
        this.grafana
            .getDashboard('predire-in-grafana')
            .then((dash) => {
                this.variables = dash.dashboard.templating.list;
                this.setInflux();
            });
    }

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

    dbWrite(info, index) {
        this.db[index].storeValue('predizione' + this.variables[index].name, info);
    }

    startPrediction(refreshTime) {
        console.log('START');
        this.prediction = setInterval(() => {
            const results = this.getPrediction();
            for (let i = 0; i < results.length; ++i) {
                this.dbWrite(results[i], i);
            }
        }, refreshTime);
    }

    stopPrediction() {
        console.log('STOP');
        clearInterval(this.prediction);
    }

    getPrediction() {
        const svm = new SVM();
        const results = [];
        this.variables.forEach((variable) => {
            const predictor = variable.query.predittore;
            svm.fromJSON(predictor);
            const point = [];
            for (let i = 0; i < variable.query.sources.length; ++i) {
                point.push(
                    this.db[results.length].getLastValue(
                        variable.query.sources[i],
                        variable.query.instances[i],
                        variable.query.params[i],
                    ),
                );
            }
            results.push(svm.predictClass(point));
        });
        return results;
    }
}

const o = new InfinitySwag();
export { o as InfinitySwag };
