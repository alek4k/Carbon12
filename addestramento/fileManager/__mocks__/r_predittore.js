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

const validityMOCK = jest
    .fn()
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(false)
    .mockReturnValue(true);

const getFileVersionMOCK = jest
    .fn()
    .mockReturnValueOnce(0)
    .mockReturnValue(10);

const checkVersionMOCK = jest
    .fn()
    .mockReturnValueOnce(false)
    .mockReturnValue(true);

const getDataEntryMOCK = jest
    .fn()
    .mockReturnValueOnce(['A'])
    .mockReturnValueOnce(['C', 'D'])
    .mockReturnValue(['A', 'B']);

const getModelMOCK = jest
    .fn()
    .mockReturnValueOnce('RL')
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
