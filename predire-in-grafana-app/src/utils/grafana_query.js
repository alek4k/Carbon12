/**
 * File name: grafana_query.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

class GrafanaApiQuery {
    constructor(backendSrv) {
        this.backendSrv = backendSrv;
    }

    getDataSources() {
        return this.backendSrv.get('/api/datasources');
    }
}

module.exports = GrafanaApiQuery;
