/**
 * File name: grafana_query.js
 * Date: 2020-03-18
 *
 * @file Mock
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

export const mockGetDataSources = jest.fn(() => new Promise(((resolve, reject) => {
    resolve([{
        name: 'CPU',
        url: 'http://localhost:8086',
        database: 'telegraf',
    },
    {
        name: 'RAM',
        url: 'http://localhost:8086',
        database: 'telegraf',
    },
    {
        name: 'DISK',
        url: 'http://localhost:8086',
        database: 'telegraf',
    },
    ]);
})));

export const postDataSourceF = jest.fn((name) => (console.log(name)));

const GrafanaApiQueryMock = jest.fn().mockImplementation(() => ({
    getDataSources: mockGetDataSources,
    postDataSource: undefined,
    getDashboard: undefined,
    getDashboards: undefined,
    postDashboard: undefined,

}));

export default GrafanaApiQueryMock;

/*
class GrafanaApiQuery {

    getDataSources() {
      return Promise.resolve([{
          name: 'CPU',
          url: 'http://localhost:8086',
          database: 'telegraf',
        },
        {
          name: 'RAM',
          url: 'http://localhost:8086',
          database: 'telegraf',
        },
        {
          name: 'DISK',
          url: 'http://localhost:8086',
          database: 'telegraf',
        },
      ]);
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

    getDashboards(folderId) {
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
*/
