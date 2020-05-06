/**
 * File name: validity_csv.test.js
 * Date: 2020-03-18
 *
 * @file Mocks getData()
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.0.0
 *
 * Changelog: modifiche effettuate
 */

const setLabelsColumnMOCK = jest.fn(() => {});

const autoGetDataMOCK = jest.fn(() => {
    const result = [];
    return result;
});

const autoGetLabelMOCK = jest
    .fn()
    .mockReturnValueOnce([])
    .mockReturnValue(['Labels']);

const getDataSourceMOCK = jest.fn(() => ['A', 'B']);

const countSourceMOCK = jest.fn(() => 2);

const csvreader = jest.fn().mockImplementation(() => ({
    setLabelsColumn: setLabelsColumnMOCK,
    autoGetData: autoGetDataMOCK,
    autoGetLabel: autoGetLabelMOCK,
    getDataSource: getDataSourceMOCK,
    countSource: countSourceMOCK,
}));

module.exports = {
    csvreader,
    setLabelsColumnMOCK,
    autoGetDataMOCK,
    autoGetLabelMOCK,
    getDataSourceMOCK,
    countSourceMOCK,
};
