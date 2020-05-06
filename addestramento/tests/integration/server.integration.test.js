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
// import fs from 'fs';
const Server = require('../../server');
const CsvReader = require('../../fileManager/csv_reader').csvreader;
const RPredittore = require('../../fileManager/r_predittore').rpredittore;

jest.unmock('nconf');

let server = null;

beforeEach(async () => {
    server = new Server();
    await server.startServer();
});

afterEach(() => {
    server.close.close();
    server = null;
});

test('This test will not send a messagge because the structure of file.csv is correct', () => {
    const csvReader = new CsvReader('./tests/files/dati_test.csv', null);
    expect(server.validityCsv(csvReader)).toEqual('');
});

test('This test will not send a messagge because the structure of file.csv is not correct', () => {
    const csvReader = new CsvReader('./tests/files/dati_test_DatiMancanti.csv', null);
    csvReader.setLabelsColumn(2);
    expect(server.validityCsv(csvReader)).toEqual(
        'Valori attesi nel campo Labels del file csv mancanti',
    );
});

test('Error messagge: the structure of file.json is not correct, title is not correct', async () => {
    const managePredittore = await new RPredittore(JSON.parse(
        readFileSync('./tests/files/predittore_test_NotValidStructure1.json').toString(),
    ));
    await expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual('Struttura json non valida');
});

test('Error messagge: the structure of file.json is not correct, arrayOfKeys error', () => {
    const managePredittore = new RPredittore(JSON.parse(
        readFileSync('./tests/files/predittore_test_NotValidStructure2.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Struttura json non valida');
});

test('Error messagge: addestramento version is not compatible', () => {
    const managePredittore = new RPredittore(JSON.parse(
        readFileSync('./tests/files/predittore_test_NotVersionCompatibility.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Versione file di addestramento non compatibile');
});

test('Error messagge: the n. of sources of file.csv are not equal to file.json sources', () => {
    const managePredittore = new RPredittore(JSON.parse(
        readFileSync('./tests/files/predittore_test_ErrorDataEntry1.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Le data entry non coincidono con quelle del file di addestramento');
});

test('Error messagge: sources of file.csv are equal to file.json sources', () => {
    const managePredittore = new RPredittore(JSON.parse(
        readFileSync('./tests/files/predittore_test_ErrorDataEntry2.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Le data entry non coincidono con quelle del file di addestramento');
});

test('Error messagge: Model select is not equal to file.json model', () => {
    const managePredittore = new RPredittore(JSON.parse(
        readFileSync('./tests/files/predittore_test_ErrorModel.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Il modello non coincide con quello selezionato');
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
        /* const data = [
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
        expect(result).toEqual(k); */
    });
    test('test addestramento SVM con predittore', () => {
        server.train = Server.prototype.train;
        
    });
    test('test addestramento RL senza predittore', () => {
        server.train = Server.prototype.train;
        
    });
    test('test addestramento RL con predittore', () => {
        server.train = Server.prototype.train;
        
    });
});
