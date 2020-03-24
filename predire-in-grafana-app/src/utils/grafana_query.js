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

    postDataSource(name, database, host, port) {
        return this.backendSrv.post('api/datasources', {
            name: name,
            type: 'influxdb',
            access: 'proxy',
            database: database,
            url: host + ':' + port,
            readOnly: false,
            editable: true,
        });
    }

    postDashboard(defaultDashboard) {
        return this.backendSrv.post('api/dashboards/import', {
            // creo e salvo la dashboard
            dashboard: defaultDashboard,
            folderId: 0,
            overwrite: true,
        });
    }
}

module.exports = GrafanaApiQuery;
