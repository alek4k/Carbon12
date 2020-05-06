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

export const validityMock = jest.fn();
export const getConfigurationMock = jest.fn();
export const getNotesMock = jest.fn();
export const getModelMock = jest.fn();
export const getDataEntryMock = jest.fn();

const RPredittore = jest.fn().mockImplementation(() => ({
    validity: validityMock,
    getConfiguration: getConfigurationMock,
    getNotes: getNotesMock,
    getModel: getModelMock,
    getDataEntry: getDataEntryMock,
}));

export default RPredittore;
