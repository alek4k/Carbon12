/**
 * File name: server.test.js
 * Date: 2020-05-06
 *
 * @file Test comandi e gestione del server
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

// const superagent = require('superagent');

const fs = require('fs');
const nconf = require('nconf');
const express = require('express');
const mime = require('mime');
const path = require('path');
const formidable = require('formidable');

const Server = require('../../server');

const CsvReader = require('../../fileManager/csv_reader.js').csvreader;
const aGCMock = require('../../fileManager/csv_reader.js').autoGetColumnsMOCK;
const cSMock = require('../../fileManager/csv_reader.js').countSourceMOCK;
const gDSMock = require('../../fileManager/csv_reader.js').getDataSourceMOCK;
const aGLMock = require('../../fileManager/csv_reader.js').autoGetLabelMOCK;
const aGDMock = require('../../fileManager/csv_reader.js').autoGetDataMOCK;
const sLCMock = require('../../fileManager/csv_reader.js').setLabelsColumnMOCK;

const RPredittore = require('../../fileManager/r_predittore').rpredittore;
const vMock = require('../../fileManager/r_predittore').validityMOCK;
const gFVMock = require('../../fileManager/r_predittore').getFileVersionMOCK;
const cVMock = require('../../fileManager/r_predittore').checkVersionMOCK;
const gDEMock = require('../../fileManager/r_predittore').getDataEntryMOCK;
const gMMock = require('../../fileManager/r_predittore').getModelMOCK;
const gCMock = require('../../fileManager/r_predittore').getConfigurationMOCK;

const WPredittore = require('../../fileManager/w_predittore').wpredittore;
const sHMock = require('../../fileManager/w_predittore').setHeaderMOCK;
const sDMock = require('../../fileManager/w_predittore').setDataEntryMOCK;
const sMMock = require('../../fileManager/w_predittore').setModelMOCK;
const sFVMock = require('../../fileManager/w_predittore').setFileVersionMOCK;
const sNMock = require('../../fileManager/w_predittore').setNotesMOCK;
const sCMock = require('../../fileManager/w_predittore').setConfigurationMOCK;
const sMOCK = require('../../fileManager/w_predittore').saveMOCK;

const SvmAdapter = require('../../models/SVM_Adapter').svmadapter;
const fJSvmAMock = require('../../models/SVM_Adapter').fromJSONMOCK;
const tSvmAMock = require('../../models/SVM_Adapter').trainMOCK;

const RlAdapter = require('../../models/RL_Adapter').rladapter;
const fJRlAMock = require('../../models/RL_Adapter').fromJSONMOCK;
const tRlAMock = require('../../models/RL_Adapter').trainMOCK;

jest.mock('nconf');
jest.mock('fs');
jest.mock('mime');
jest.mock('path');
jest.mock('formidable');

jest.mock('../../fileManager/csv_reader.js');
jest.mock('../../fileManager/r_predittore.js');
jest.mock('../../fileManager/w_predittore.js');
jest.mock('../../models/SVM_Adapter.js');
jest.mock('../../models/RL_Adapter.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Testing constructor', () => {
    test('Exit program', () => {
        nconf.argv.mockReturnThis();
        nconf.env.mockReturnThis();
        nconf.file.mockImplementation(() => {
            throw new Error();
        });
        nconf.defaults.mockReturnThis();
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
        const serv = new Server();
        expect(mockExit).toHaveBeenCalledTimes(1);
    });
    test('Testing constructor', () => {
        nconf.argv.mockReturnThis();
        nconf.env.mockReturnThis();
        const ser = new Server();
        const k = {
            csvReader: null,
            model: 'SVM',
            sources: null,
            notes: null,
            nomePredittore: '',
            error: '',
            FILE_VERSION: 0,
            app: {
                set: expect.any(Function),
                use: expect.any(Function),
            },
            router: undefined,
        };
        expect(ser).toEqual(k);
    });
});

describe('Testing method', () => {
    let server = null;

    beforeEach(() => {
        server = new (function testServer() { })();
        aGLMock.mockClear();
        vMock.mockClear();
    });

    afterEach(() => {
        server = null;
        aGLMock.mockClear();
        // mock.restore();
    });

    describe('Testing ValidityCsv method', () => {
        let csvReader;
        beforeEach(() => {
            csvReader = new CsvReader();
        });
        test('This test will not send a messagge because the structure of file.csv is not correct', () => {
            server.validityCsv = Server.prototype.validityCsv;
            expect(server.validityCsv(csvReader)).toEqual(
                'Valori attesi nel file csv mancanti',
            );
            expect(aGLMock).toHaveBeenCalledTimes(1);
        });

        test('This test will not send a messagge because the structure of file.csv is correct', () => {
            server.validityCsv = Server.prototype.validityCsv;
            expect(server.validityCsv(csvReader)).toEqual('');
            expect(aGLMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('Testing ValidityJson method', () => {
        let managePredittore;

        beforeEach(() => {
            managePredittore = new RPredittore();
        });

        test('Error messagge: the structure of file.json is not correct, title is not correct', () => {
            server.validityJson = Server.prototype.validityJson;
            vMock.mockReturnValueOnce(false);
            expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual('Struttura json non valida');
            expect(vMock).toHaveBeenCalledTimes(1);
        });

        test('Error messagge: the structure of file.json is not correct, arrayOfKeys error', () => {
            server.validityJson = Server.prototype.validityJson;
            vMock.mockReturnValueOnce(false);
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Struttura json non valida');
            expect(vMock).toHaveBeenCalledTimes(1);
        });

        test('Error messagge: addestramento version is not compatible', () => {
            server.validityJson = Server.prototype.validityJson;
            gFVMock.mockReturnValueOnce(0);
            cVMock.mockReturnValueOnce(false);
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Versione file di addestramento non compatibile');
            expect(gFVMock).toHaveBeenCalledTimes(2);
            expect(cVMock).toHaveBeenCalledTimes(1);
            expect(nconf.get).toHaveBeenCalledTimes(2);
        });

        test('Error messagge: the n. of sources of file.csv are not equal to file.json sources', () => {
            server.validityJson = Server.prototype.validityJson;
            gDEMock.mockReturnValueOnce(['A']);
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Le data entry non coincidono con quelle del file di addestramento');
            expect(gDEMock).toHaveBeenCalledTimes(1);
            expect(nconf.get).toHaveBeenCalledTimes(2);
        });

        test('Error messagge: sources of file.csv are not equal to file.json sources', () => {
            server.validityJson = Server.prototype.validityJson;
            gDEMock.mockReturnValueOnce(['C', 'D']);
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Le data entry non coincidono con quelle del file di addestramento');
            expect(gDEMock).toHaveBeenCalledTimes(1);
            expect(nconf.get).toHaveBeenCalledTimes(2);
        });

        test('Error messagge: Model select is not equal to file.json model', () => {
            server.validityJson = Server.prototype.validityJson;
            gMMock.mockReturnValueOnce('RL');
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Il modello non coincide con quello selezionato');
            expect(gMMock).toHaveBeenCalledTimes(1);
            expect(nconf.get).toHaveBeenCalledTimes(2);
        });

        test('JSON valido', () => {
            server.validityJson = Server.prototype.validityJson;
            server.model = 'SVM';
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('');
            expect(nconf.get).toHaveBeenCalledTimes(2);
        });
    });

    describe('Testing train method', () => {
        test('test addestramento SVM senza predittore', () => {
            server.train = Server.prototype.train;
            server.model = 'SVM';

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
            expect(server.train()).toEqual(k);
            expect(fJSvmAMock).toHaveBeenCalledTimes(0);
            expect(tSvmAMock).toHaveBeenCalledTimes(1);
        });
        test('test addestramento SVM con predittore', () => {
            server.train = Server.prototype.train;
            server.model = 'SVM';

            const data = [
                [1, 0],
                [2, 3],
                [5, 4],
                [2, 7],
                [0, 3],
                [-1, 0],
                [-3, -4],
            ];
            const labels = [1, 1, 1, 1, 1, -1, -1];
            const pred = {
                N: 7,
                D: 3,
                alpha: [
                    [1921.8840693868697],
                    [0.4748198607372416],
                    [-0.14483769841581307],
                ],
            };

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

            expect(server.train(data, labels, pred)).toEqual(k);
            expect(fJSvmAMock).toHaveBeenCalledTimes(1);
            expect(fJSvmAMock).toHaveBeenCalledWith(pred);
            expect(tSvmAMock).toHaveBeenCalledTimes(1);
        });
        test('test addestramento RL senza predittore', () => {
            server.train = Server.prototype.train;
            server.model = 'RL';

            const data = [
                [1, 0],
                [2, 3],
                [5, 4],
                [2, 7],
                [0, 3],
                [-1, 0],
                [-3, -4],
            ];
            const labels = [1, 1, 1, 1, 1, -1, -1];

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

            expect(server.train(data, labels, null)).toEqual(k);
            expect(fJRlAMock).toHaveBeenCalledTimes(0);
            expect(tRlAMock).toHaveBeenCalledTimes(1);
        });
        test('test addestramento RL con predittore', () => {
            server.train = Server.prototype.train;
            server.model = 'RL';

            const data = [
                [1, 0],
                [2, 3],
                [5, 4],
                [2, 7],
                [0, 3],
                [-1, 0],
                [-3, -4],
            ];
            const labels = [1, 1, 1, 1, 1, -1, -1];
            const pred = {
                N: 7,
                D: 3,
                alpha: [
                    [1921.8840693868697],
                    [0.4748198607372416],
                    [-0.14483769841581307],
                ],
            };

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

            expect(server.train(data, labels, pred)).toEqual(k);
            expect(fJRlAMock).toHaveBeenCalledTimes(1);
            expect(fJRlAMock).toHaveBeenCalledWith(pred);
            expect(tRlAMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('Testing savePredittore method', () => {
        test('salvataggio json', async () => {
            server.savePredittore = Server.prototype.savePredittore;
            server.csvReader = new CsvReader();
            const nome = 'files/expense.csv';
            server.savePredittore(null, nome);

            expect(sFVMock).toHaveBeenCalledTimes(1);
            expect(sCMock).toHaveBeenCalledTimes(1);
            expect(sDMock).toHaveBeenCalledTimes(1);
            expect(sHMock).toHaveBeenCalledTimes(1);
            expect(sMMock).toHaveBeenCalledTimes(1);
            expect(sNMock).toHaveBeenCalledTimes(1);

            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Testing uploadForm method', () => {

    });

    describe('Testing downloadPredittore method', () => {
        test('It should download the new predittore', () => {
            server.downloadPredittore = Server.prototype.downloadPredittore;
            const setHeaderMOCK = jest.fn();
            const res = {
                setHeader: setHeaderMOCK,
            };
            const pipeMOCK = jest.fn();
            fs.createReadStream.mockReturnValueOnce({ pipe: pipeMOCK });
            expect(server.downloadPredittore(null, res)).toEqual();

            expect(mime.getType).toHaveBeenCalledTimes(1);
            expect(path.join).toHaveBeenCalledTimes(1);
            expect(path.basename).toHaveBeenCalledTimes(1);
            expect(setHeaderMOCK).toHaveBeenCalledTimes(2);
            expect(fs.createReadStream).toHaveBeenCalledTimes(1);
            expect(pipeMOCK).toHaveBeenCalledTimes(1);
        });
    });

    describe('Testing getChartData method', () => {
        test('It should define the form\'s creation from getChartData method', async () => {
            server.getChartData = Server.prototype.getChartData;
            server.csvReader = new CsvReader();

            const endMOCK = jest.fn();
            const res = {
                end: endMOCK,
            };

            formidable.parseMOCK.mockReturnThis();
            formidable.onMOCK.mockImplementationOnce((str, fun) => { fun(undefined, 'test'); });
            formidable.onMOCK.mockImplementationOnce((str, fun) => { fun(); });
            expect(server.getChartData(undefined, res)).toEqual();
        });
    });

    describe('Testing getCSVColumns method', () => {
        test('It should define the form\'s creation from getCSVColumns method', async () => {
            server.getCSVColumns = Server.prototype.getCSVColumns;
            server.csvReader = new CsvReader();

            const endMOCK = jest.fn();
            const res = {
                end: endMOCK,
            };

            formidable.parseMOCK.mockReturnThis();
            formidable.onMOCK.mockImplementationOnce((str, fun) => { fun(undefined, 'test'); });
            formidable.onMOCK.mockImplementationOnce((str, fun) => { fun(); });
            expect(server.getCSVColumns(undefined, res)).toEqual();
            expect(aGCMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('Testing config method', () => {
        test('It should response the GET method', async () => {
            server.config = Server.prototype.config;
            server.source = [];
            server.model = 'SVM';
            server.uploadForm = jest.fn();
            server.downloadPredittore = jest.fn();
            server.getChartData = jest.fn();
            server.getCSVColumns = jest.fn();
            const useMock = jest.fn();
            const getMock = jest.fn();
            const postMock = jest.fn();
            server.app = { use: useMock };
            server.ruter = { get: getMock, post: postMock };
            const req = {};
            const renderMOCK = jest.fn();
            const res = {
                render: renderMOCK,
            };
            getMock.mockImplementation((str, fun) => {
                fun(req, res);
            });
            postMock.mockImplementation((str, fun) => {
                fun(req, res);
            });
            expect(server.config()).toEqual();
        });
    });

    describe('Testing startServer method', () => {
        test.only('Test for config loadCsv', async () => {
            server.startServer = Server.prototype.startServer;
            server.config = function testConfig() {};
            const listenMock = jest.fn()
            server.app = { listen: listenMock };
            server.startServer();
            expect(listenMock).toHaveBeenCalledTimes(1);
        });
    });
});
