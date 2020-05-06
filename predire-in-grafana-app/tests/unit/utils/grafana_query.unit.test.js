/**
 * File name: panel.test.js
 * Date: 2020-04-29
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

import GrafanaApiQuery from '../../../src/utils/grafana_query';
import BackendSrvMock, { getMock, postMock, putMock } from '../../../__mocks__/backendSrvMock';

it('Testing constructor', () => {
    const parBackendSrv = new BackendSrvMock();
    const grafanaApi = new GrafanaApiQuery(parBackendSrv);
    expect(grafanaApi).toEqual({
        backendSrv: new BackendSrvMock(),
    });
});

describe('Testing method', () => {
    let grafanaApi = null;
    let expBackendSrv = null;
    beforeEach(() => {
        grafanaApi = new (function testGrafanaApi() { })();
        grafanaApi.backendSrv = new BackendSrvMock();
        expBackendSrv = new BackendSrvMock();
        getMock.mockClear();
        postMock.mockClear();
    });

    afterEach(() => {
        grafanaApi = null;
        expBackendSrv = null;
    });

    it('getDataSources', () => {
        grafanaApi.getDataSources = GrafanaApiQuery.prototype.getDataSources;

        const returnValue = grafanaApi.getDataSources();

        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith('api/datasources');
        expect(returnValue).toEqual(expBackendSrv.get('api/datasources'));
        expect(grafanaApi).toEqual({
            backendSrv: new BackendSrvMock(),
            getDataSources: GrafanaApiQuery.prototype.getDataSources,
        });
    });

    it('postDataSource', () => {
        grafanaApi.postDataSource = GrafanaApiQuery.prototype.postDataSource;

        const parName = 'TestParName';
        const parDatabase = 'telegraf';
        const parHost = '127.0.0.1';
        const parPort = 1000;
        const returnValue = grafanaApi.postDataSource(parName, parDatabase, parHost, parPort);

        expect(postMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledWith('api/datasources', {
            name: parName,
            type: 'influxdb',
            access: 'proxy',
            database: parDatabase,
            url: parHost + ':' + parPort,
            readOnly: false,
            editable: true,
        });
        expect(returnValue).toEqual(expBackendSrv.get('api/datasources'), {
            name: parName,
            type: 'influxdb',
            access: 'proxy',
            database: parDatabase,
            url: parHost + ':' + parPort,
            readOnly: false,
            editable: true,
        });
        expect(grafanaApi).toEqual({
            backendSrv: new BackendSrvMock(),
            postDataSource: GrafanaApiQuery.prototype.postDataSource,
        });
    });

    it('getDashboard', () => {
        grafanaApi.getDashboard = GrafanaApiQuery.prototype.getDashboard;

        const parName = 'TestName';
        const returnValue = grafanaApi.getDashboard(parName);

        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith('api/dashboards/db/' + parName);
        expect(returnValue).toEqual(expBackendSrv.get('api/dashboards/db/' + parName));
        expect(grafanaApi).toEqual({
            backendSrv: new BackendSrvMock(),
            getDashboard: GrafanaApiQuery.prototype.getDashboard,
        });
    });

    it('getFolder', () => {
        grafanaApi.getFolder = GrafanaApiQuery.prototype.getFolder;

        const parFolderId = 0;
        const returnValue = grafanaApi.getFolder(parFolderId);

        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith('api/search?folderIds=' + parFolderId);
        expect(returnValue).toEqual(expBackendSrv.get('api/search?folderIds=' + parFolderId));
        expect(grafanaApi).toEqual({
            backendSrv: new BackendSrvMock(),
            getFolder: GrafanaApiQuery.prototype.getFolder,
        });
    });

    it('postDashboard', () => {
        grafanaApi.postDashboard = GrafanaApiQuery.prototype.postDashboard;

        const parDashboard = {};
        const returnValue = grafanaApi.postDashboard(parDashboard);

        expect(postMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledWith('api/dashboards/db', {
            dashboard: parDashboard,
            folderId: 0,
            overwrite: true,
        });
        expect(returnValue).toEqual(expBackendSrv.post('api/dashboards/db', {
            dashboard: parDashboard,
            folderId: 0,
            overwrite: true,
        }));
        expect(grafanaApi).toEqual({
            backendSrv: new BackendSrvMock(),
            postDashboard: GrafanaApiQuery.prototype.postDashboard,
        });
    });

    it('getAlerts', () => {
        grafanaApi.getAlerts = GrafanaApiQuery.prototype.getAlerts;

        const returnValue = grafanaApi.getAlerts();

        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith('api/alert-notifications');
        expect(returnValue).toEqual(expBackendSrv.get('api/alert-notifications'));
        expect(grafanaApi).toEqual({
            backendSrv: new BackendSrvMock(),
            getAlerts: GrafanaApiQuery.prototype.getAlerts,
        });
    });

    it('postAlert', () => {
        grafanaApi.postAlert = GrafanaApiQuery.prototype.postAlert;

        const parTeamsUrl = 'TestParName';
        const returnValue = grafanaApi.postAlert(parTeamsUrl);

        expect(postMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledWith('api/alert-notifications', {
            uid: 'predire-in-grafana-alert',
            name: 'Predire in Grafana Alert',
            type: 'teams',
            settings: {
                url: parTeamsUrl,
            },
        });
        expect(returnValue).toEqual(expBackendSrv.post('api/alert-notifications', {
            uid: 'predire-in-grafana-alert',
            name: 'Predire in Grafana Alert',
            type: 'teams',
            settings: {
                url: parTeamsUrl,
            },
        }));
        expect(grafanaApi).toEqual({
            backendSrv: new BackendSrvMock(),
            postAlert: GrafanaApiQuery.prototype.postAlert,
        });
    });

    it('updateAlert', () => {
        grafanaApi.updateAlert = GrafanaApiQuery.prototype.updateAlert;

        const parTeamsUrl = 'TestParName';
        const returnValue = grafanaApi.updateAlert(parTeamsUrl);

        expect(putMock).toHaveBeenCalledTimes(1);
        expect(putMock)
            .toHaveBeenCalledWith('api/alert-notifications/uid/predire-in-grafana-alert', {
                uid: 'predire-in-grafana-alert',
                name: 'Predire in Grafana Alert',
                type: 'teams',
                settings: {
                    url: parTeamsUrl,
                },
            });
        expect(returnValue)
            .toEqual(expBackendSrv.put('api/alert-notifications/uid/predire-in-grafana-alert', {
                uid: 'predire-in-grafana-alert',
                name: 'Predire in Grafana Alert',
                type: 'teams',
                settings: {
                    url: parTeamsUrl,
                },
            }));
        expect(grafanaApi).toEqual({
            backendSrv: new BackendSrvMock(),
            updateAlert: GrafanaApiQuery.prototype.updateAlert,
        });
    });
});
