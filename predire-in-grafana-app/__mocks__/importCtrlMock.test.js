/**
 * File name: import.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

export default class importCtrl {
    constructor($location, backendSrv) {
        this.$location = $location;
        this.backendSrv = backendSrv;
        this.step = 1;
        this.error = '';
        this.availableDataSources = [];
        this.dataSource = '';
        this.name = '';
        this.database = '';
        this.host = 'http://localhost';
        this.port = '8086';
        this.notes = '';
        this.model = '';
        this.availableDataEntry = [];
        this.availableSources = [];
        this.availableInstances = [];
        this.availableParams = [];
        this.sources = [];
        this.instances = [];
        this.params = [];
        this.view = '';
        this.influx = null;
        this.grafana = '';
        this.dashboard = {};
        this.predictor = {};
    }
}
