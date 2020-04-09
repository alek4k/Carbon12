/**
 * File name: W_Predittore.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della classe W_Predittore
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const WPredittore = require('../../fileManager/w_predittore.js');

const managePredittore = new WPredittore();

test('It should response that managePredittore has the expected header', () => {
    managePredittore.setHeader('b.3.0', 'b.3.0', 'Carbon12 Predire in Grafana');
    expect(managePredittore.jsonContent.header.title).toEqual('Carbon12 Predire in Grafana');
    expect(managePredittore.jsonContent.header.plugin_version).toEqual('b.3.0');
    expect(managePredittore.jsonContent.header.train_version).toEqual('b.3.0');
});

test('It should response that managePredittore has the expected data entry', () => {
    managePredittore.setDataEntry(['A', 'B'], 2);
    expect(managePredittore.jsonContent.data_entry).toEqual({ source0: 'A', source1: 'B' });
});

test('It should response that managePredittore has the expected model', () => {
    managePredittore.setModel('SVM');
    expect(managePredittore.jsonContent.model).toEqual('SVM');
});

test('It should response that managePredittore has the expected file version', () => {
    managePredittore.setFileVersion(1);
    expect(managePredittore.jsonContent.file_version).toEqual(1);
});

test('It should response that managePredittore has the expected notes', () => {
    managePredittore.setNotes('sample text');
    expect(managePredittore.jsonContent.notes).toEqual('sample text');
});

test('It should response that managePredittore has the expected configuration', () => {
    const configuration = {
        _parametroN: 'numero di dati inseriti',
        N: 89,
        _parametroD: 'numero di sorgenti analizzate',
        D: 2,
        _parametroAlpha: 'coefficienti della retta risultante',
        alpha: [
            [2.432],
            [3.456],
        ],
    };
    managePredittore.setConfiguration(configuration);
    expect(managePredittore.jsonContent.configuration).toEqual(configuration);
});
