/**
 * File name: R_Predittore.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della classe R_Predittore
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

const fs = require('fs');
const RPredittore = require('../../fileManager/r_predittore').rpredittore;

const managePredittore = new RPredittore(JSON.parse(
    fs.readFileSync('./tests/files/predittore_test.json').toString(),
));

test('It should response that Plugin\'s and train\'s version are compatible', () => {
    expect(managePredittore.checkVersion('1.0.0', '1.0.0')).toBeTruthy();
});

test('It should response that Plugin\'s and train\'s version are compatible', () => {
    expect(managePredittore.validity()).toBeTruthy();
});

test('It should response that file.json has the expected title', () => {
    expect(managePredittore.getTitle()).toEqual('Carbon12 Predire in Grafana');
});

test('It should response that file.json has the Plugin expected version', () => {
    expect(managePredittore.getPluginVersion()).toEqual('0.0.0');
});

test('It should response that file.json has the Train expected version', () => {
    expect(managePredittore.getTrainVersion()).toEqual('0.0.0');
});

test('It should response that file.json has the expected sources', () => {
    expect(managePredittore.getDataEntry()).toEqual(['A', 'B']);
});

test('It should response that file.json has no data_entry', () => {
    expect(managePredittore.getDataEntry()).toEqual(['A', 'B']);
});

test('It should response that file.json has the expected model', () => {
    expect(managePredittore.getModel()).toEqual('SVM');
});

test('It should response that file.json has no File version', () => {
    expect(managePredittore.getFileVersion()).toBe(0);
});

test('It should response that file.json has File version', () => {
    expect(managePredittore.getFileVersion()).toBe(0);
});

test('It should response that file.json has the expected notes', () => {
    expect(managePredittore.getNotes()).toEqual('test');
});

test('It should response that file.json has the expected configuration', () => {
    const k = {};
    k.N = 60;
    k.D = 3;
    k.b = 25889865728;
    k.kernelType = 'linear';
    k.w = [
        -4838.896484375,
        489.25675450149345,
        1224.422537904899,
    ];
    expect(managePredittore.getConfiguration()).toEqual(k);
});
