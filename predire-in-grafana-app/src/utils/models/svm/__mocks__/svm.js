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

export const fromJSONMock = jest.fn(() => {
});

export const toJSONMock = jest.fn(() => {
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

export const trainMock = jest.fn(() => {
    const k = {};
    k.parametroN = 'numero di dati inseriti';
    k.N = 7;
    k.parametroD = 'numero di sorgenti analizzate';
    k.D = 3;
    k.b = 25889865728;
    k.kernelType = 'linear';
    k.parametroW = 'coefficienti della retta risultante';
    k.w = [
        [1921.8840693868697],
        [0.4748198607372416],
        [-0.14483769841581307],
    ];
    return k;
});

export const predictClassMock = jest.fn();

const SVM = jest.fn().mockImplementation(() => ({
    fromJSON: fromJSONMock,
    toJSON: toJSONMock,
    train: trainMock,
    predictClass: predictClassMock,
}));

export default SVM;
