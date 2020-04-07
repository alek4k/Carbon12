/**
 * File name: app.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const SvmAdapter = require('../../models/SVM_Adapter');

const svmAdapter = new SvmAdapter();

test('It should return JSON file with SVM configuration', () => {
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
// https://jestjs.io/docs/en/expect#expectarraycontainingarray
