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

export const fromJSONMock = jest.fn();
export const predictClassMock = jest.fn(() => 1);

const RL = jest.fn().mockImplementation(() => ({
    fromJSON: fromJSONMock,
    predictClass: predictClassMock,
}));

export default RL;
