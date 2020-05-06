/**
 * File name: server.test.js
 * Date: 2020-03-18
 *
 * @file Test comandi e gestione del server
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

// const superagent = require('superagent');

const fs = require('fs');
const wFSMock = require('fs').writeFileSyncMOCK;
const rFSMock = require('fs').readFileSyncMOCK;
const cRSMock = require('fs').createReadStreamMOCK;

const nconf = require('nconf');
/* const get = jest.requireActual('nconf').get; */
const aCMock = require('nconf').argvMOCK;
const eCMock = require('nconf').envMOCK;
const fCMock = require('nconf').fileMOCK;
const dCMock = require('nconf').defaultsMOCK;
const gMock = require('nconf').getMOCK;

const express = require('express');
const formidable = require('formidable');

const Server = require('../../server');

const CsvReader = require('../../fileManager/csv_reader.js').csvreader;
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

jest.mock('../../fileManager/csv_reader.js');
jest.mock('../../fileManager/r_predittore.js');
jest.mock('../../fileManager/w_predittore.js');
jest.mock('../../models/SVM_Adapter.js');
jest.mock('../../models/RL_Adapter.js');

describe('Testing constructor', () => {
    test('Exit program', () => {
        aCMock.mockReturnThis();
        eCMock.mockReturnThis();
        fCMock.mockImplementation(() => {
            throw new Error();
        });
        dCMock.mockReturnThis();
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
        const serv = new Server();
        expect(mockExit).toHaveBeenCalledTimes(1);
    });
    test('Testing constructor', () => {
        aCMock.mockReturnThis();
        eCMock.mockReturnThis();
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
        test('This test will not send a messagge because the structure of file.csv is not correct', () => {
            server.validityCsv = Server.prototype.validityCsv;
            const csvReader = new CsvReader();
            expect(server.validityCsv(csvReader)).toEqual(
                'Valori attesi nel file csv mancanti',
            );
            expect(aGLMock).toHaveBeenCalledTimes(1);
        });

        test('This test will not send a messagge because the structure of file.csv is correct', () => {
            server.validityCsv = Server.prototype.validityCsv;
            const csvReader = new CsvReader();
            expect(server.validityCsv(csvReader)).toEqual('');
            expect(aGLMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('Testing ValidityJson method', () => {
        const managePredittore = new RPredittore();
        test('Error messagge: the structure of file.json is not correct, title is not correct', () => {
            server.validityJson = Server.prototype.validityJson;
            expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual('Struttura json non valida');
            expect(vMock).toHaveBeenCalledTimes(1);
        });

        test('Error messagge: the structure of file.json is not correct, arrayOfKeys error', () => {
            server.validityJson = Server.prototype.validityJson;
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Struttura json non valida');
            expect(vMock).toHaveBeenCalledTimes(1);
        });

        test('Error messagge: addestramento version is not compatible', () => {
            server.validityJson = Server.prototype.validityJson;
            // nconf.mockReturnValue(Promise.resolve(new get('1.4.0')));
            // jest.mock('nconf', () => ({ get: jest.fn(() => '1.4.0') }));
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Versione file di addestramento non compatibile');
            expect(gFVMock).toHaveBeenCalledTimes(2);
            expect(gMock).toHaveBeenCalledTimes(1);
        });

        test('Error messagge: the n. of sources of file.csv are not equal to file.json sources', () => {
            server.validityJson = Server.prototype.validityJson;
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Le data entry non coincidono con quelle del file di addestramento');
            expect(cVMock).toHaveBeenCalledTimes(2);
        });

        test('Error messagge: sources of file.csv are not equal to file.json sources', () => {
            server.validityJson = Server.prototype.validityJson;
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Le data entry non coincidono con quelle del file di addestramento');
            expect(gDEMock).toHaveBeenCalledTimes(2);
        });

        test('Error messagge: Model select is not equal to file.json model', () => {
            server.validityJson = Server.prototype.validityJson;
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Il modello non coincide con quello selezionato');
            expect(gMMock).toHaveBeenCalledTimes(1);
        });

        test('JSON valido', () => {
            server.validityJson = Server.prototype.validityJson;
            server.model = 'SVM';
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('');
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
            expect(tSvmAMock).toHaveBeenCalledTimes(2);
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
            expect(tRlAMock).toHaveBeenCalledTimes(2);
        });
    });

    describe('Testing savePredittore method', () => {
        test('salvataggio json', async () => {
            server.savePredittore = Server.prototype.savePredittore;
            server.csvReader = new CsvReader();
            const nome = 'files/expense.csv';
            server.savePredittore(nome, null);

            const stats = fs.statSync('');

            expect(stats).toBeTruthy();

            expect(sFVMock).toHaveBeenCalledTimes(1);
            expect(sCMock).toHaveBeenCalledTimes(1);
            expect(sDMock).toHaveBeenCalledTimes(1);
            expect(sHMock).toHaveBeenCalledTimes(1);
            expect(sMMock).toHaveBeenCalledTimes(1);
            expect(sNMock).toHaveBeenCalledTimes(1);

            expect(wFSMock).toHaveBeenCalledTimes(1);
            // expect(writeFileSync.calledOnceWith('files/expense.csv', 'test')).to.be(true);
            /* const nome = 'greg.json';
            const strPredittore = '';
            const csvReader = new CSVr('./tests/files/dati_test.csv', null);

            server.csvReader = csvReader;
            server.savePredittore(strPredittore, nome);

            const stats = fs.statSync('./greg.json');

            expect(stats).toBeTruthy(); */
        });
    });

    describe('Testing uploadForm method', () => {

    });

    describe('Testing downloadPredittore method', () => {
        test('It should download the new predittore', async () => {
            server.downloadPredittore = Server.prototype.downloadPredittore;
            expect(server.downloadPredittore()).toEqual();
        });
    });

    describe('Testing getChartData method', () => {
        test('It should define the form\'s creation from getChartData method', async () => {
            server.getChartData = Server.prototype.getChartData;
            expect(server.getChartData()).toEqual();
        });
    });

    describe('Testing getCSVColumns method', () => {
        test('It should define the form\'s creation from getCSVColumns method', async () => {
            server.getCSVColumns = Server.prototype.getCSVColumns;
            expect(server.getCSVColumns()).toEqual();
        });
    });

    describe('Testing config method', () => {
        beforeEach(() => {
            // server.app = MockExpress();
            // server.startServer();
        });
        afterEach(() => {
            // server1.server1.close();
            server = null;
        });

        test('It should response the GET method', async () => {
            server.config = Server.prototype.config;
            express.Router = {
                request: '/',
            };
            await request(server.app)
                .get('/')
                .expect(200);
        });

        test('Test for config addestramento', async () => {
            await request(server.app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200);
        });

        /*
        test("Test for config fileupload", () =>{
            server.config();

            return request(server.app)
                .post("/fileupload")
                .expect("Content-Type", /json/)
                .expect(200);
        });
        */

        test('Test for config downloadPredittore', async () => {
            await request(server.app)
                .get('/downloadPredittore')
                .expect('Content-Type', /html/)
                .expect(200);
        });

        /*
        test("Test for config downloadFile", () =>{
            server.config();

            return request(server.app)
                .post("/downloadFile")
                .expect("Content-Type", /html/)
                .expect(200);
        });
        */
        test('Test for config loadCsv', async () => {
            await request(server.app)
                .post('/loadCsv')
                .expect(200);
        });
    });

    describe('Testing startServer method', () => {
        test('Test for config loadCsv', async () => {
            server.startServer = Server.prototype.startServer;
            server.config = function testConfig() {};
            await server.startServer();
            server.request(server)
                .get('/')
                .expect(200);
        });
    });
});
