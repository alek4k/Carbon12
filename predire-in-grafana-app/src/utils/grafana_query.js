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

export default class GrafanaApiQuery {
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
        return this.backendSrv.post('api/dashboards/db', {
            dashboard,
            folderId: 0,
            overwrite: true,
        });
    }

    getAlerts() {
        return this.backendSrv.get('api/alert-notifications');
    }

    postAlert(teamsUrl) {
        return this.backendSrv.post('api/alert-notifications', {
            uid: "predire-in-grafana-alert",
            name: "Predire in Grafana Alert",
            type: "teams",
            settings: {
                url: teamsUrl
            }
        });
    }

    updateAlert(teamsUrl) {
        return this.backendSrv.put('api/alert-notifications/uid/predire-in-grafana-alert', {
            uid: "predire-in-grafana-alert",
            name: "Predire in Grafana Alert",
            type: "teams",
            settings: {
                url: teamsUrl
            }
        });
    }
}