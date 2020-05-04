/**
 * File name: R_Predittore.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della classe R_Predittore
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const RPredittore = require('../../fileManager/r_predittore.js');

describe('Testing constructor', () => {
    test('Testing constructor with no data', () => {
        const data = null;
        const mP = new RPredittore(data);
        expect(mP).toEqual({
            jsonContent: {},
            sources: [],
        });
    });

    test('Testing constructor with data', () => {
        const data = {};
        const mP = new RPredittore(data);
        expect(mP).toEqual({
            jsonContent: {},
            sources: [],
        });
    });
});

describe('Testing method', () => {
    let managePredittore = null;

    beforeEach(() => {
        managePredittore = new (function testWPredittore() { })();
        managePredittore.jsonContent = {
            header: {
                title: 'Carbon12 Predire in Grafana',
                plugin_version: '1.0.0',
                train_version: '1.0.0',
            },
            data_entry: {
                source0: 'A',
                source1: 'B',
            },
            model: 'SVM',
            file_version: 0,
            notes: 'test',
            configuration: {
                D: 3,
                N: 60,
                b: 25889865728,
                kernelType: 'linear',
                w: [
                    -4838.896484375,
                    489.25675450149345,
                    1224.422537904899,
                ],
            },
        };
        managePredittore.sources = [];
    });

    afterEach(() => {
        managePredittore = null;
    });

    test('It should response that Plugin\'s and train\'s version are compatible', () => {
        managePredittore.checkVersion = RPredittore.prototype.checkVersion;
        managePredittore.versionToInt = function f() { return 1; };
        managePredittore.getPluginVersion = function f() { return 1; };
        managePredittore.getTrainVersion = function f() { return 1; };
        expect(managePredittore.checkVersion('1.0.0', '1.0.0')).toBeTruthy();
    });

    test('It should response the value of a version', () => {
        managePredittore.versionToInt = RPredittore.prototype.versionToInt;
        expect(managePredittore.versionToInt('1.0.0')).toEqual(10);
    });

    test('It should response wrong version inside json', () => {
        managePredittore.versionToInt = RPredittore.prototype.versionToInt;
        expect(managePredittore.versionToInt('l.c.0')).toEqual(NaN);
    });

    test('It should response that Plugin\'s and train\'s version are compatible', () => {
        managePredittore.validity = RPredittore.prototype.validity;
        managePredittore.jsonContent = {
            header: {},
            notes: {},
            data_entry: {},
            model: {},
            file_version: {},
            configuration: {},
        };
        managePredittore.jsonContent.key = ['header', 'notes', 'data_entry',
            'model', 'file_version', 'configuration'];
        managePredittore.getTitle = function f() { return 'Carbon12 Predire in Grafana'; };
        expect(managePredittore.validity()).toBeTruthy();
    });

    test('It should response that file.json has the expected title', () => {
        managePredittore.getTitle = RPredittore.prototype.getTitle;
        expect(managePredittore.getTitle()).toEqual('Carbon12 Predire in Grafana');
    });

    test('It should response that file.json has the Plugin expected version', () => {
        managePredittore.getPluginVersion = RPredittore.prototype.getPluginVersion;
        expect(managePredittore.getPluginVersion()).toEqual('1.0.0');
    });

    test('It should response that file.json has the Train expected version', () => {
        managePredittore.getTrainVersion = RPredittore.prototype.getTrainVersion;
        expect(managePredittore.getTrainVersion()).toEqual('1.0.0');
    });

    test('It should response that file.json has the expected sources', () => {
        managePredittore.getDataEntry = RPredittore.prototype.getDataEntry;
        expect(managePredittore.getDataEntry()).toEqual(['A', 'B']);
    });

    test('It should response that file.json has no data_entry', () => {
        managePredittore.getDataEntry = RPredittore.prototype.getDataEntry;
        managePredittore.jsonContent.data_entry = null;
        expect(managePredittore.getDataEntry()).toEqual([]);
    });

    test('It should response that file.json has the expected model', () => {
        managePredittore.getModel = RPredittore.prototype.getModel;
        expect(managePredittore.getModel()).toEqual('SVM');
    });

    test('It should response that file.json has no File version', () => {
        managePredittore.getFileVersion = RPredittore.prototype.getFileVersion;
        expect(managePredittore.getFileVersion()).toBe(0);
    });

    test('It should response that file.json has File version', () => {
        managePredittore.getFileVersion = RPredittore.prototype.getFileVersion;
        managePredittore.jsonContent.file_version = 1;
        expect(managePredittore.getFileVersion()).toBe(1);
    });

    test('It should response that file.json has the expected notes', () => {
        managePredittore.getNotes = RPredittore.prototype.getNotes;
        expect(managePredittore.getNotes()).toEqual('test');
    });

    test('It should response that file.json has the expected configuration', () => {
        managePredittore.getConfiguration = RPredittore.prototype.getConfiguration;
        const k = {};
        k.N = 60;
        k.D = 3;
        k.b = 25889865728;
        k.kernelType = 'linear';
        k.w = [
            -4838.896484375,
            489.25675450149345,
            1224.422537904899,
        ];
        expect(managePredittore.getConfiguration()).toEqual(k);
    });
});
