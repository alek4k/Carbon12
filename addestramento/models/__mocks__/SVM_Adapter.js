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

const svmadapter = jest.fn().mockImplementation(() => ({
    fromJSON: fromJSONMOCK,
    train: trainMOCK,
}));

module.exports = {
    svmadapter, fromJSONMOCK, trainMOCK,
};
