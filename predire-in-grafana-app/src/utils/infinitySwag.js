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

import GrafanaApiQuery from './grafana_query';
import Influx from './influx';

const RL = require('./models/RL_Adapter');
const SVM = require('./models/SVM_Adapter');

class InfinitySwag {
    constructor() {
        this.$scope = null;
        this.backendSrv = null;
        this.db = [];
        this.predictions = [];
    }

    setBackendSrv($scope, backendSrv) {
        this.$scope = $scope;
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
                this.$scope.$evalAsync();
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

    startPrediction(index, refreshTime) {
        if (this.predictions[index] === undefined) {
            console.log('START');
            this.predictions[index] = setInterval(() => {
                this.dbWrite(this.getPrediction(index), index);
            }, refreshTime);
        }
    }

    stopPrediction(index) {
        console.log('STOP');
        clearInterval(this.predictions[index]);
        this.predictions[index] = undefined;
    }

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
