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

export const getDashboardMock = jest.fn();
export const postDashboardMock = jest.fn();
export const getFolderMock = jest.fn();

const GrafanaApiQuery = jest.fn().mockImplementation(() => ({
    getDashboard: getDashboardMock,
    postDashboard: postDashboardMock,
    getFolder: getFolderMock,
}));

export default GrafanaApiQuery;
