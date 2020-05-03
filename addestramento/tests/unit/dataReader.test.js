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
const DR = require('../../fileManager/dataReader.js');

test('It should response a error message because autoGetColumns must be implemented', () => {
    DR.prototype.autoGetColumns = false;
    DR.prototype.setLabelsColumn = function f() {};
    DR.prototype.autoGetData = function f() {};
    DR.prototype.autoGetLabel = function f() {};
    DR.prototype.getDataSource = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DR(); }).toThrow(new Error(
        'autoGetColumns method must be implemented',
    ));
});

test('It should response a error message because setLabelsColumn must be implemented', () => {
    DR.prototype.autoGetColumns = function f() {};
    DR.prototype.setLabelsColumn = false;
    DR.prototype.autoGetData = function f() {};
    DR.prototype.autoGetLabel = function f() {};
    DR.prototype.getDataSource = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DR(); }).toThrow(new Error(
        'setLabelsColumn method must be implemented',
    ));
});

test('It should response a error message because autoGetData must be implemented', () => {
    DR.prototype.autoGetColumns = function f() {};
    DR.prototype.setLabelsColumn = function f() {};
    DR.prototype.autoGetData = false;
    DR.prototype.autoGetLabel = function f() {};
    DR.prototype.getDataSource = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DR(); }).toThrow(new Error(
        'autoGetData method must be implemented',
    ));
});

test('It should response a error message because autoGetLabel must be implemented', () => {
    DR.prototype.autoGetColumns = function f() {};
    DR.prototype.setLabelsColumn = function f() {};
    DR.prototype.autoGetData = function f() {};
    DR.prototype.autoGetLabel = false;
    DR.prototype.getDataSource = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DR(); }).toThrow(new Error(
        'autoGetLabel method must be implemented',
    ));
});

test('It should response a error message because getDataSource must be implemented', () => {
    DR.prototype.autoGetColumns = function f() {};
    DR.prototype.setLabelsColumn = function f() {};
    DR.prototype.autoGetData = function f() {};
    DR.prototype.autoGetLabel = function f() {};
    DR.prototype.getDataSource = false;

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new DR(); }).toThrow(new Error(
        'getDataSource method must be implemented',
    ));
});
