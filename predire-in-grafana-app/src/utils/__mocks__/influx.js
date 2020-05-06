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

export const storeValueMock = jest.fn();
export const getLastValueMock = jest.fn();

const Influx = jest.fn().mockImplementation(() => ({
    storeValue: storeValueMock,
    getLastValue: getLastValueMock,
}));

export default Influx;
