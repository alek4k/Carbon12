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

const SVM = require('./models/svm/svm');
const GrafanaApiQuery = require('./grafana_query.js');

class InfinitySwag {
    constructor() {
        this.backendSrv = null;
        this.db = null;
    }

    setBackendSrv(backendSrv) {
        this.backendSrv = backendSrv;
        this.grafana = new GrafanaApiQuery(this.backendSrv);
        this.setConfig();
    }

    setConfig() {
        this.grafana
            .getDashboard('predire-in-grafana')
            .then((dash) => {
                this.list = dash.dashboard.templating.list;
                this.setInflux();
            });
    }

    setInflux() {
        this.db = new Influx(
            this.list[0].query.host,
            parseInt(this.list[0].query.port, 10),
            this.list[0].query.database
        );
    }

    dbWrite(info) {
        this.db.storeValue('predizione' + this.list[0].name, info);
    }

    startPrediction(refreshTime) {
        console.log('START');
        this.prediction = setInterval(() => {
            const result = this.getPrediction();
            this.dbWrite(result);
        }, refreshTime);
    }

    stopPrediction() {
        console.log('STOP');
        clearInterval(this.prediction);
    }

    getPrediction() {
        const svm = new SVM();
        const predictor = this.list[0].query.predittore;
        svm.fromJSON(predictor);
        let point = [
            this.db.getLastValue(this.list[0].query.sources[0], this.list[0].query.params[0]),
            this.db.getLastValue(this.list[0].query.sources[1], this.list[0].query.params[1])
        ];
    

        return svm.predict(point);
    }

    predictionSVM(point) {
        return svm.predict(point);
    }
}

const o = new InfinitySwag();
export { o as InfinitySwag };
