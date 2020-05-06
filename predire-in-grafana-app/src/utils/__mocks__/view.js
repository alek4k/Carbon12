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

export const getJSONMock = jest.fn(() => {
    const id = 0;
    const type = 'Grafico';
    const title = 'MockView';
    const description = 'MockViewDashboard';
    const dataSource = 'MockViewDatasource';
    const background = 'true';

    const dashboard = {
        colors: [
            '#d44a3a',
            'rgba(237, 129, 40, 0.89)',
            '#299c46',
        ],
        gridPos: {},
        id,
        targets: [],
        valueMaps: [{
            op: '=',
            text: 'Good &#128077;',
            value: '1',
        },
        {
            op: '=',
            text: 'Bad &#128078;',
            value: '-1',
        }],
        valueName: 'current',
    };
    if (type === 'Grafico') {
        dashboard.gridPos.h = 8;
        dashboard.gridPos.w = 12;
        dashboard.type = 'graph';
        dashboard.title = title;
        dashboard.description = description;
        dashboard.datasource = dataSource;
    } else {
        dashboard.gridPos.h = 4;
        dashboard.gridPos.w = 4;
        dashboard.type = 'singlestat';
        dashboard.thresholds = '0, 0.5';
        dashboard.title = title;
        dashboard.description = description;
        dashboard.colorBackground = background;
        dashboard.datasource = dataSource;
    }
    return dashboard;
});
export const setDataSourceMock = jest.fn();
export const setDescriptionMock = jest.fn();
export const setDefaultBackgroundMock = jest.fn();

const viewMock = jest.fn().mockImplementation(() => ({
    getJSON: getJSONMock,
    setDataSource: setDataSourceMock,
    setDescription: setDescriptionMock,
    setDefaultBackground: setDefaultBackgroundMock,
}));

export default viewMock;
