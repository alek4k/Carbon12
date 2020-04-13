/**
 * File name: backendSrv.js
 * Date: 2020-04-02
 *
 * @file Mock
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version b.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const datasources = [{
    name: 'CPU',
    type: 'influxdb',
    access: 'proxy',
    database: 'telegraf',
    url: 'http://localhost:8086',
    readOnly: false,
    editable: true,
},
{
    name: 'RAM',
    type: 'influxdb',
    access: 'proxy',
    database: 'telegraf',
    url: 'http://localhost:8086',
    readOnly: false,
    editable: true,
},
{
    name: 'DISK',
    type: 'influxdb',
    access: 'proxy',
    database: 'telegraf',
    url: 'http://localhost:8086',
    readOnly: false,
    editable: true,
}];

export const getMock = jest.fn((url) => {
    if (url === 'api/datasources') {
        return new Promise((resolve, reject) => {
            resolve(datasources);
            reject();
        });
    }
    if (url === 'api/search?folderIds=0') {
        return new Promise((resolve, reject) => {
            resolve([{ uid: 'carbon12' }]);
            reject();
        });
    }
    if (url === 'api/dashboards/db/predire-in-grafana') {
        return new Promise((resolve, reject) => {
            resolve({
                dashboard: {
                    version: 0,
                    panels: [
                        {
                            id: 0,
                            targets: [],
                            groupBy: [],
                            gridPos: {
                                h: 0,
                                w: 0,
                            },
                        },
                    ],
                    templating: {
                        list: [],
                    },
                },
            });
            reject();
        });
    }
    console.log('Unhandled get in backendSrvMock:');
    console.log('Url: ' + url);
    return undefined;
});

export const postMock = jest.fn((url, data) => {
    if (url === 'api/dashboards/import') {
        return new Promise((resolve, reject) => {
            resolve();
            reject();
        });
    }
    if (url === 'api/datasources') {
        datasources.push(data);
        return new Promise((resolve, reject) => {
            resolve();
            reject();
        });
    }
    console.log('Unhandled post in backendSrvMock:');
    console.log('Url: ' + url);
    console.log('Data:');
    console.log(data);
    return undefined;
});

const backendSrvMock = jest.fn().mockImplementation(() => ({
    get: getMock,
    post: postMock,
}));

export default backendSrvMock;
