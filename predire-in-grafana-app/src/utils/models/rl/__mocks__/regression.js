/**
 * File name: model.js
 * Date: 2020-05-06
 *
 * @file Interfaccia per la gestione dei modelli
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: creazione interfaccia
 */

export const predictMock = jest.fn(() => {
});

export const fromJSONMock = jest.fn(() => {
});

export const toJSONMock = jest.fn(() => {
    const ris = {
        _parametroN: 'numero di dati inseriti',
        N: 7,
        _parametroD: 'numero di sorgenti analizzate',
        D: 3,
        _parametroAlpha: 'coefficienti della retta risultante',
        alpha: [
            [1921.8840693868697],
            [0.4748198607372416],
            [-0.14483769841581307],
        ],
    };
    return ris;
});

export const trainMock = jest.fn(() => {
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
    return k;
});

// let rgMock = {};

const Regression = jest.fn().mockImplementation(() => ({
    // rg: rgMock,
    fromJSON: fromJSONMock,
    toJSON: toJSONMock,
    train: trainMock,
    predict: predictMock,
}));

export default Regression;
