/**
 * File name: view.js
 * Date: 2020-04-26
 *
 * @file Classe che descrive la visualizzazione grafica del pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: Inizializzata la struttura della classe View
 */

export const dash = {
    dashboard: {
        templating: {
            list: [{
                query: {
                    name: 'TestQueryName1',
                    host: 'TestQueryHost1',
                    port: '1000',
                    database: 'TestQueryDatabase1',
                    sources: [],
                    instances: [],
                    params: [],
                    model: 'SVM',
                    predittore: {
                        D: 1,
                    },
                },
            }, {
                query: {
                    name: 'TestQueryName2',
                    host: 'TestQueryHost2',
                    port: '1000',
                    database: 'TestQueryDatabase2',
                    sources: [],
                    instances: [],
                    params: [],
                    model: 'RL',
                    predittore: {
                        D: 1,
                    },
                },
            }],
        },
    },
};

export const getDashboardMock = jest.fn((str) => {
    if (str === 'predire-in-grafana') {
        return {
            then: (fun) => {
                fun(dash);
            },
        };
    }
    console.log('Undefined request:');
    console.log(str.data);
    return undefined;
});

const GrafanaApiQuery = jest.fn().mockImplementation(() => ({
    getDashboard: getDashboardMock,
}));

export default GrafanaApiQuery;
