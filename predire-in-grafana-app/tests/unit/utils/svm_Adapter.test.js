/**
 * File name: SVM_Adapter.test.js
 * Date: 2020-05-06
 *
 * @file Test metodi della classe SVM_Adapter
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

import SvmAdapter from '../../../src/utils/models/SVM_Adapter';
import SVM, {
    fromJSONMOCK as fJMock, toJSONMOCK as tJMock, trainMOCK as tMock, predictClassMOCK as pMock,
}
    from '../../../src/utils/models/svm/svm';

jest.mock('../../../src/utils/models/svm/svm.js');

describe('Testing constructor', () => {
    test('Testing constructor', () => {
        const p = { numX: 1 };
        const svmAdapter = new SvmAdapter(p);
        const k = new SVM();
        expect(svmAdapter).toEqual({
            svm: k,
        });
    });
});

describe('Testing method', () => {
    let svmAdapter = null;

    beforeEach(() => {
        svmAdapter = new (function costruttore() {})();
        svmAdapter.svm = new SVM();
        fJMock.mockClear();
        tMock.mockClear();
    });
    afterEach(() => {
        fJMock.mockClear();
        tMock.mockClear();
    });


    test('It should return JSON file with JSON configuration', () => {
        svmAdapter.fromJSON = SvmAdapter.prototype.fromJSON;
        const j = {};
        j.N = 7;
        j.D = 3;
        j.b = 25889865728;
        j.kernelType = 'linear';
        j.w = [[1921.8840693868697], [0.4748198607372416], [-0.14483769841581307]];
        svmAdapter.fromJSON(j);
        expect(fJMock).toHaveBeenCalledTimes(1);
        expect(fJMock).toHaveBeenCalledWith(j);
        expect(svmAdapter).toEqual({
            fromJSON: SvmAdapter.prototype.fromJSON,
            svm: {
                fromJSON: fJMock,
                toJSON: tJMock,
                train: tMock,
                predictClass: pMock,
            },
        });
    });


    test('It should return JSON file with SVM configuration', () => {
        svmAdapter.train = SvmAdapter.prototype.train;
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

        expect(svmAdapter.train(data, labels)).toEqual(k);

        expect(tMock).toHaveBeenCalledTimes(1);
    });

    test('It should test SVM predict', () => {
        svmAdapter.predictClass = SvmAdapter.prototype.predictClass;
        svmAdapter.predictClass();
        expect(pMock).toHaveBeenCalledTimes(1);
    });
});
