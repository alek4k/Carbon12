/**
 * File name: RL_Adapter.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della classe RL_Adapter
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

/* eslint-disable no-underscore-dangle */
import RLAdapter from '../../../src/utils/models/RL_Adapter';

const rlAdapter = new RLAdapter({ numX: 3, numY: 1 });

test('It should return JSON with RL configuration', () => {
    const j = {};
    j.N = 7;
    j.D = 3;
    j.alpha = [[1921.8840693868697], [0.4748198607372416], [-0.14483769841581307]];
    rlAdapter.fromJSON(j);
    expect(rlAdapter.regression.N).toEqual(7);
    expect(rlAdapter.regression.D).toEqual(3);
    expect(rlAdapter.regression.coefficients).toEqual([
        [1921.8840693868697],
        [0.4748198607372416],
        [-0.14483769841581307],
    ]);
});

test('It should return JSON with RL configuration', () => {
    const data = [
        [9098, 5492],
        [9133, 5540],
        [9203, 5305],
        [9308, 5507],
        [9448, 5418],
        [9623, 5320],
        [9833, 5538],
    ];
    const labels = [5400, 5462, 5524, 5586, 5648, 5710, 5772];

    const k = {};
    k._parametroN = 'numero di dati inseriti';
    k.N = 7;
    k._parametroD = 'numero di sorgenti analizzate';
    k.D = 3;
    k._parametroAlpha = 'coefficienti della retta risultante';
    k.alpha = [
        [1921.8840693868697],
        [0.4748198607372416],
        [-0.14483769841581307],
    ];

    expect(rlAdapter.train(data, labels)).toEqual(k);
});

test('It should return prediction from RL', () => {
    const point = [14, 54];
    expect(rlAdapter.predict(point)).toEqual([1920.710311722737]);
});
