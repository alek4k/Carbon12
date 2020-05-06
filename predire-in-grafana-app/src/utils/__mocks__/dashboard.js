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

export const getJSONMock = jest.fn();
export const updateSettingsMock = jest.fn();

const Dashboard = jest.fn().mockImplementation(() => ({
    getJSON: getJSONMock,
    updateSettings: updateSettingsMock,
}));

export default Dashboard;
