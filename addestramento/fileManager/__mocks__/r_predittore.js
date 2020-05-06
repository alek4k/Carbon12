/**
 * File name: validity_csv.test.js
 * Date: 2020-03-18
 *
 * @file Mocks getData()
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

const validityMOCK = jest.fn()
    .mockReturnValue(true);

const getFileVersionMOCK = jest.fn()
    .mockReturnValue(10);

const checkVersionMOCK = jest.fn()
    .mockReturnValue(true);

const getDataEntryMOCK = jest.fn()
    .mockReturnValue(['A', 'B']);

const getModelMOCK = jest.fn()
    .mockReturnValue('SVM');

const getConfigurationMOCK = jest.fn(() => {
    const k = {};
    return k;
});

const rpredittore = jest.fn().mockImplementation(() => ({
    validity: validityMOCK,
    getFileVersion: getFileVersionMOCK,
    checkVersion: checkVersionMOCK,
    getDataEntry: getDataEntryMOCK,
    getModel: getModelMOCK,
    getConfiguration: getConfigurationMOCK,
}));

module.exports = {
    rpredittore,
    validityMOCK,
    getFileVersionMOCK,
    checkVersionMOCK,
    getDataEntryMOCK,
    getModelMOCK,
    getConfigurationMOCK,
};
