/**
 * File name: SVM_Adapter.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della classe SVM_Adapter
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

const SvmAdapter = require('../../models/SVM_Adapter').svmadapter;

const svmAdapter = new SvmAdapter();

test('It should return JSON with SVM configuration', () => {
    const j = {};
    j.N = 7;
    j.D = 3;
    j.b = 25889865728;
    j.kernelType = 'linear';
    j.w = [[1921.8840693868697], [0.4748198607372416], [-0.14483769841581307]];
    svmAdapter.fromJSON(j);
    expect(svmAdapter.svm.N).toEqual(7);
    expect(svmAdapter.svm.D).toEqual(3);
    expect(svmAdapter.svm.b).toEqual(25889865728);
    expect(svmAdapter.svm.kernelType).toEqual('linear');
    expect(svmAdapter.svm.w).toEqual([
        [1921.8840693868697],
        [0.4748198607372416],
        [-0.14483769841581307],
    ]);
});

test('It should return JSON with SVM configuration', () => {
    const data = [
        [1, 0],
        [2, 3],
        [5, 4],
        [2, 7],
        [0, 3],
        [-1, 0],
        [-3, -4],
        [-2, -2],
        [-1, -1],
        [-5, -2],
    ];
    const labels = [1, 1, 1, 1, 1, -1, -1, -1, -1, -1];

    const k = [
        ['_parametroN'],
        ['N'],
        ['_parametroD'],
        ['D'],
        ['_parametroB'],
        ['b'],
        ['kernelType'],
        ['_parametroW'],
        ['w'],
    ];

    const jsondata = svmAdapter.train(data, labels);
    const result = [];
    for (const i in jsondata) {
        if ({}.hasOwnProperty.call(jsondata, i)) {
            result.push([i]);
        }
    }
    expect(result).toEqual(k);
});
