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

export const getJSONMock = jest.fn();
export const updateSettingsMock = jest.fn();
export const removePanelMock = jest.fn();
export const setPredictionStartedMock = jest.fn();

const Dashboard = jest.fn().mockImplementation(() => ({
    getJSON: getJSONMock,
    updateSettings: updateSettingsMock,
    removePanel: removePanelMock,
    setPredictionStarted: setPredictionStartedMock,
}));

export default Dashboard;
