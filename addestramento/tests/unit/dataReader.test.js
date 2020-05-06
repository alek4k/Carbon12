/**
 * File name: validity_csv.test.js
 * Date: 2020-03-18
 *
 * @file Test metodo validityCsv()
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */
const DataReader = require('../../fileManager/dataReader').datareader;

test('It should response a error message because autoGetColumns must be implemented', () => {
    DataReader.prototype.autoGetColumns = false;
    DataReader.prototype.setLabelsColumn = function f() {};
    DataReader.prototype.autoGetData = function f() {};
    DataReader.prototype.autoGetLabel = function f() {};
    DataReader.prototype.getDataSource = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DataReader(); }).toThrow(new Error(
        'autoGetColumns method must be implemented',
    ));
});

test('It should response a error message because setLabelsColumn must be implemented', () => {
    DataReader.prototype.autoGetColumns = function f() {};
    DataReader.prototype.setLabelsColumn = false;
    DataReader.prototype.autoGetData = function f() {};
    DataReader.prototype.autoGetLabel = function f() {};
    DataReader.prototype.getDataSource = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DataReader(); }).toThrow(new Error(
        'setLabelsColumn method must be implemented',
    ));
});

test('It should response a error message because autoGetData must be implemented', () => {
    DataReader.prototype.autoGetColumns = function f() {};
    DataReader.prototype.setLabelsColumn = function f() {};
    DataReader.prototype.autoGetData = false;
    DataReader.prototype.autoGetLabel = function f() {};
    DataReader.prototype.getDataSource = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DataReader(); }).toThrow(new Error(
        'autoGetData method must be implemented',
    ));
});

test('It should response a error message because autoGetLabel must be implemented', () => {
    DataReader.prototype.autoGetColumns = function f() {};
    DataReader.prototype.setLabelsColumn = function f() {};
    DataReader.prototype.autoGetData = function f() {};
    DataReader.prototype.autoGetLabel = false;
    DataReader.prototype.getDataSource = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DataReader(); }).toThrow(new Error(
        'autoGetLabel method must be implemented',
    ));
});

test('It should response a error message because getDataSource must be implemented', () => {
    DataReader.prototype.autoGetColumns = function f() {};
    DataReader.prototype.setLabelsColumn = function f() {};
    DataReader.prototype.autoGetData = function f() {};
    DataReader.prototype.autoGetLabel = function f() {};
    DataReader.prototype.getDataSource = false;

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DataReader(); }).toThrow(new Error(
        'getDataSource method must be implemented',
    ));
});
