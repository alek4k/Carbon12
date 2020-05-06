/**
 * File name: RL_Adapter.test.js
 * Date: 2020-05-06
 *
 * @file Test metodi della classe RL_Adapter
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

import RLAdapter from '../../../src/utils/models/RL_Adapter';
import Regression, {
    fromJSONMOCK as fJMock, toJSONMOCK as tJMock, trainMOCK as tMock, predictMOCK as pMock,
}
    from '../../../src/utils/models/rl/regression';

jest.mock('../../../src/utils/models/rl/regression.js');

describe('Testing constructor', () => {
    test('Testing constructor', () => {
        const p = { numX: 1 };
        const rlAdapter = new RLAdapter(p);
        const k = new Regression();
        expect(rlAdapter).toEqual({
            regression: k,
        });
    });
});

describe('Testing method', () => {
    let rlAdapter = null;

    beforeEach(() => {
        rlAdapter = new (function costruttore() {})();
        rlAdapter.regression = new Regression();
        fJMock.mockClear();
        tMock.mockClear();
    });
    afterEach(() => {
        fJMock.mockClear();
        tMock.mockClear();
    });

    test('It should return JSON configuration', () => {
        rlAdapter.fromJSON = RLAdapter.prototype.fromJSON;
        const ris = {
            N: 7,
            D: 3,
            alpha: [
                [1921.8840693868697],
                [0.4748198607372416],
                [-0.14483769841581307],
            ],
        };
        rlAdapter.fromJSON(ris);
        expect(fJMock).toHaveBeenCalledTimes(1);
        expect(fJMock).toHaveBeenCalledWith(ris);
        expect(rlAdapter).toEqual({
            fromJSON: RLAdapter.prototype.fromJSON,
            regression: {
                fromJSON: fJMock,
                toJSON: tJMock,
                train: tMock,
                predict: pMock,
            },
        });
    });

    test('It should return JSON file with RL configuration', () => {
        rlAdapter.train = RLAdapter.prototype.train;
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

        expect(rlAdapter.train()).toEqual(k);
        expect(tMock).toHaveBeenCalledTimes(1);
    });

    test('It should test SVM predict', () => {
        rlAdapter.predict = RLAdapter.prototype.predict;
        rlAdapter.predict();
        expect(pMock).toHaveBeenCalledTimes(1);
    });
});
