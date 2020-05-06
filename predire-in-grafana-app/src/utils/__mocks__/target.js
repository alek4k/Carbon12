/**
 * File name: view.js
 * Date: 2020-04-26
 *
 * @file Classe che descrive la visualizzazione grafica del pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: Inizializzata la struttura della classe View
 */

export const getJSONMock = jest.fn(() => {
    const id = 0;
    return {
        refId: 'Predizione' + id,
        measurement: 'predizione' + id,
        policy: 'default',
        resultFormat: 'time_series',
        orderByTime: 'ASC',
        select: [
            [{
                type: 'field',
                params: [
                    'value',
                ],
            }, {
                type: 'last',
                params: [],
            }],
        ],
        groupBy: [{
            type: 'time',
            params: [
                '$__interval',
            ],
        }, {
            type: 'fill',
            params: [
                'previous',
            ],
        }],
    };
});

const targetMock = jest.fn().mockImplementation(() => ({
    getJSON: getJSONMock,
}));

export default targetMock;
