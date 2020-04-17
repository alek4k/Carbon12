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

import Influx from './influx';

const RL = require('./models/RL_Adapter');
const SVM = require('./models/SVM_Adapter');
const GrafanaApiQuery = require('./grafana_query');

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
        const results = [];
        this.variables.forEach((variable) => {
            const predictor = variable.query.predittore;
            const point = [];
            for (let i = 0; i < predictor.D; ++i) {
                point.push(
                    this.db[results.length].getLastValue(
                        variable.query.sources[i],
                        variable.query.instances[i],
                        variable.query.params[i]
                    )
                );
            }
            results.push(
                variable.query.model === 'SVM'
                    ?  this.predictSVM(predictor, point) : this.predictRL(predictor, point)
            );
        });
        return results;
    }
    
    predictSVM(predictor, point) {
        const svm = new SVM();
        svm.fromJSON(predictor);
        return svm.predictClass(point);
    }

    predictRL(predictor, point) {
        const options = { numX: predictor.D, numY: 1 };
        const rl = new RL(options);
        rl.fromJSON(predictor);
        return rl.predict(point);
    }
}

const o = new InfinitySwag();
export { o as InfinitySwag };
