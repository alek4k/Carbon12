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

export const storeValueMock = jest.fn();
export const getLastValueMock = jest.fn(() => [0, 0]);

const Influx = jest.fn().mockImplementation(() => ({
    storeValue: storeValueMock,
    getLastValue: getLastValueMock,
}));

export default Influx;
