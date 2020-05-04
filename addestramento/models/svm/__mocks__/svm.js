/**
 * File name: model.js
 * Date: 2020-03-28
 *
 * @file Interfaccia per la gestione dei modelli
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.0.0
 *
 * Changelog: creazione interfaccia
 */

const fromJSONMOCK = jest.fn(() => {
});

const toJSONMOCK = jest.fn(() => {
    const ris = {
        _parametroN: 'numero di dati inseriti',
        N: 7,
        _parametroD: 'numero di sorgenti analizzate',
        D: 3,
        b: 25889865728,
        kernelType: 'linear',
        _parametroW: 'coefficienti della retta risultante',
        w: [
            [1921.8840693868697],
            [0.4748198607372416],
            [-0.14483769841581307],
        ],
    };
    return ris;
});

const trainMOCK = jest.fn(() => {
    const k = {};
    k._parametroN = 'numero di dati inseriti';
    k.N = 7;
    k._parametroD = 'numero di sorgenti analizzate';
    k.D = 3;
    k.b = 25889865728;
    k.kernelType = 'linear';
    k._parametroW = 'coefficienti della retta risultante';
    k.w = [
        [1921.8840693868697],
        [0.4748198607372416],
        [-0.14483769841581307],
    ];
    return k;
});

// let rgMOCK = {};

const svm = jest.fn().mockImplementation(() => ({
    // rg: rgMOCK,
    fromJSON: fromJSONMOCK,
    toJSON: toJSONMOCK,
    train: trainMOCK,
}));

/* rgMOCK = regression.mockImplementation((options) => {
    const rg = Object.create(regression.prototype);
    rg.transposeOfXTimesX = {};
    rg.transposeOfXTimesY = {};
    rg.D = options;
    rg.identity = 0;
    console.log('Bababa');
    return rg;
}); */

module.exports = {
    svm, fromJSONMOCK, toJSONMOCK, trainMOCK,
};
