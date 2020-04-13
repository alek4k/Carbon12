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
        return this.backendSrv.get('api/datasources');
    }

    postDataSource(name, database, host, port) {
        return this.backendSrv.post('api/datasources', {
            name,
            type: 'influxdb',
            access: 'proxy',
            database,
            url: host + ':' + port,
            readOnly: false,
            editable: true,
        });
    }

    getDashboard(name) {
        return this.backendSrv.get('api/dashboards/db/' + name);
    }

    getFolder(folderId) {
        return this.backendSrv.get('api/search?folderIds=' + folderId);
    }

    postDashboard(dashboard) {
        return this.backendSrv.post('api/dashboards/import', {
            dashboard,
            folderId: 0,
            overwrite: true,
        });
    }
}

module.exports = GrafanaApiQuery;
