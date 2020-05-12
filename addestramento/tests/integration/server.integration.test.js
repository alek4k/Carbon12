/**
 * File name: validity_csv.test.js
 * Date: 2020-03-18
 *
 * @file Test metodo validityCsv()
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */
const fs = require('fs');
const nconf = require('nconf');
const express = require('express');
const mime = require('mime');
const path = require('path');
const formidable = require('formidable');

const Server = require('../../server');
const CsvReader = require('../../fileManager/csv_reader').csvreader;
const RPredittore = require('../../fileManager/r_predittore').rpredittore;

jest.mock('nconf');
jest.mock('mime');
jest.mock('path');
jest.mock('formidable');

let server = null;
beforeEach(async () => {
    nconf.argv.mockReturnThis();
    nconf.env.mockReturnThis();
    nconf.file.mockReturnThis();
    express.Router.mockReturnValue({ get: jest.fn(), post: jest.fn() });
    server = new Server();
    await server.startServer();
});

afterEach(() => {
    server = null;
});

test('This test will not send a message because the structure of file.csv is correct', () => {
    const csvReader = new CsvReader('./tests/files/dati_test.csv', null);
    csvReader.setLabelsColumn(2);
    expect(server.validityCsv(csvReader)).toEqual('');
});

test('This test will not send a mesagge because the structure of file.csv is not correct', () => {
    const csvReader = new CsvReader('./tests/files/dati_test_DatiMancanti.csv', null);
    csvReader.setLabelsColumn(2);
    expect(server.validityCsv(csvReader)).toEqual(
        'Valori attesi nel file csv mancanti',
    );
});

test('Error messagge: the structure of file.json is not correct, title is not correct', async () => {
    const managePredittore = await new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotValidStructure1.json').toString(),
    ));
    await expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual('Struttura json non valida');
});

test('Error messagge: the structure of file.json is not correct, arrayOfKeys error', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotValidStructure2.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Struttura json non valida');
});

test('Error messagge: addestramento version is not compatible', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotVersionCompatibility.json').toString(),
    ));
    nconf.get.mockReturnValueOnce('0.0.0');
    nconf.get.mockReturnValueOnce('0.0.0');
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Versione file di addestramento non compatibile');
});

test('Error messagge: the n. of sources of file.csv are not equal to file.json sources', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry1.json').toString(),
    ));
    nconf.get.mockReturnValueOnce('0.0.0');
    nconf.get.mockReturnValueOnce('0.0.0');
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Le data entry non coincidono con quelle del file di addestramento');
});

test('Error messagge: sources of file.csv are equal to file.json sources', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry2.json').toString(),
    ));
    nconf.get.mockReturnValueOnce('0.0.0');
    nconf.get.mockReturnValueOnce('0.0.0');
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Le data entry non coincidono con quelle del file di addestramento');
});

test('Error messagge: Model select is not equal to file.json model', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorModel.json').toString(),
    ));
    nconf.get.mockReturnValueOnce('0.0.0');
    nconf.get.mockReturnValueOnce('0.0.0');
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Il modello non coincide con quello selezionato');
});

test('Error messagge: Model select is not equal to file.json model', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    ));
    nconf.get.mockReturnValueOnce('0.0.0');
    nconf.get.mockReturnValueOnce('0.0.0');
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('');
});

describe('Testing train method', () => {
    test('test addestramento SVM senza predittore', () => {
        server.model = 'SVM';
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

        const k = [
            ['_parametroN'],
            ['N'],
            ['_parametroD'],
            ['D'],
            ['_parametroB'],
            ['b'],
            ['kernelType'],
            ['_parametroW'],
            ['w'],
        ];
        const config = '';
        const jsondata = server.train(data, labels, config);
        const result = [];
        for (const i in jsondata) {
            if ({}.hasOwnProperty.call(jsondata, i)) {
                result.push([i]);
            }
        }
        expect(result).toEqual(k);
    });

    test('test addestramento SVM con predittore', () => {
        server.model = 'SVM';
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

        const k = [
            ['_parametroN'],
            ['N'],
            ['_parametroD'],
            ['D'],
            ['_parametroB'],
            ['b'],
            ['kernelType'],
            ['_parametroW'],
            ['w'],
        ];
        const config = new RPredittore(JSON.parse(
            fs.readFileSync('./tests/files/predittore_test.json').toString(),
        ));
        const jsondata = server.train(data, labels, config.getConfiguration());
        const result = [];
        for (const i in jsondata) {
            if ({}.hasOwnProperty.call(jsondata, i)) {
                result.push([i]);
            }
        }
        expect(result).toEqual(k);
    });

    test('test addestramento RL senza predittore', () => {
        server.model = 'RL';
        const data = [
            [9098, 5492],
            [9133, 5540],
            [9203, 5305],
            [9308, 5507],
            [9448, 5418],
            [9623, 5320],
            [9833, 5538],
        ];
        const labels = [5400, 5462, 5524, 5586, 5648, 5710, 5772];

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
        const config = '';
        expect(server.train(data, labels, config)).toEqual(k);
    });
    test('test addestramento RL con predittore', () => {
        server.model = 'RL';
        const data = [
            [9098, 5492],
            [9133, 5540],
            [9203, 5305],
            [9308, 5507],
            [9448, 5418],
            [9623, 5320],
            [9833, 5538],
        ];
        const labels = [5400, 5462, 5524, 5586, 5648, 5710, 5772];

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
        const config = new RPredittore(JSON.parse(
            fs.readFileSync('./tests/files/predittoreRL_test.json').toString(),
        ));
        expect(server.train(data, labels, config.getConfiguration())).toEqual(k);
    });
});

test('Testing savePredittore', () => {
    const nome = 'test.json';
    const strPredittore = '';
    server.csvReader = new CsvReader('./tests/files/dati_test.csv', null);

    server.savePredittore(strPredittore, nome);

    const stats = fs.statSync('./test.json');

    expect(stats).toBeTruthy();
});

test('Start server', () => {
    server.startServer();

    expect(server).toEqual({
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
            listen: expect.any(Function),
        },
        router: {
            get: expect.any(Function),
            post: expect.any(Function),
        },
        server: undefined,
    });
});
