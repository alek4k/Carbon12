/**
 * File name: RL_Adapter.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della classe RL_Adapter
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const RLAdapter = require('../../models/RL_Adapter').rladapter;
const Regression = require('../../models/rl/regression').regression;
const fJMock = require('../../models/rl/regression').fromJSONMOCK;
const tJMock = require('../../models/rl/regression').toJSONMOCK;
const tMock = require('../../models/rl/regression').trainMOCK;

jest.mock('../../models/rl/regression.js');

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
});
