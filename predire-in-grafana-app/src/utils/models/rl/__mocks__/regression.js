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

export const predictMOCK = jest.fn(() => {
});

export const fromJSONMOCK = jest.fn(() => {
});

export const toJSONMOCK = jest.fn(() => {
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

export const trainMOCK = jest.fn(() => {
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

// let rgMOCK = {};

const Regression = jest.fn().mockImplementation(() => ({
    // rg: rgMOCK,
    fromJSON: fromJSONMOCK,
    toJSON: toJSONMOCK,
    train: trainMOCK,
    predict: predictMOCK,
}));

export default Regression;
