/**
 * File name: view.js
 * Date: 2020-05-06
 *
 * @file Classe che descrive la visualizzazione grafica del pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: Inizializzata la struttura della classe View
 */

export const fromJSONMock = jest.fn();
export const predictMock = jest.fn(() => 1);

const SVM = jest.fn().mockImplementation(() => ({
    fromJSON: fromJSONMock,
    predict: predictMock,
}));

export default SVM;
