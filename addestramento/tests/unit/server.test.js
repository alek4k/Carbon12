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

const request = require('supertest');
const fs = require('fs');
const Server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');

describe('Testing constructor', () => {

});

describe('Testing method', () => {
    let server = null;

    beforeEach(() => {
        server = new Server();
        server.startServer();
    });

    afterEach(() => {
        server.server.close();
        server = null;
    });

    describe('Testing ValidityCsv method', () => {
        test('This test will not send a messagge because the structure of file.csv is correct', async () => {
            // const csvReader = new CSVr('./tests/files/dati_test.csv', null);
            expect(server.validityCsv(csvReader)).toEqual('');
        });

        test('This test will not send a messagge because the structure of file.csv is not correct', async () => {
            // const csvReader = new CSVr('./tests/files/dati_test_DatiMancanti.csv', null);
            // csvReader.setLabelsColumn(2);
            expect(server.validityCsv(csvReader)).toEqual(
                'Valori attesi nel campo Labels del file csv mancanti',
            );
        });
    });

    describe('Testing ValidityCsv method', () => {
        test('Error messagge: the structure of file.json is not correct, title is not correct', async () => {
            const managePredittore = await new RPredittore(JSON.parse(
                fs.readFileSync('./tests/files/predittore_test_NotValidStructure1.json').toString(),
            ));
            await expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual('Struttura json non valida');
        });

        test('Error messagge: the structure of file.json is not correct, arrayOfKeys error', async () => {
            const managePredittore = new RPredittore(JSON.parse(
                fs.readFileSync('./tests/files/predittore_test_NotValidStructure2.json').toString(),
            ));
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Struttura json non valida');
        });

        test('Error messagge: addestramento version is not compatible', async () => {
            const managePredittore = new RPredittore(JSON.parse(
                fs.readFileSync('./tests/files/predittore_test_NotVersionCompatibility.json').toString(),
            ));
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Versione file di addestramento non compatibile');
        });

        test('Error messagge: the n. of sources of file.csv are not equal to file.json sources', async () => {
            const managePredittore = new RPredittore(JSON.parse(
                fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry1.json').toString(),
            ));
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Le data entry non coincidono con quelle del file di addestramento');
        });

        test('Error messagge: sources of file.csv are equal to file.json sources', async () => {
            const managePredittore = new RPredittore(JSON.parse(
                fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry2.json').toString(),
            ));
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Le data entry non coincidono con quelle del file di addestramento');
        });

        test('Error messagge: Model select is not equal to file.json model', async () => {
            const managePredittore = new RPredittore(JSON.parse(
                fs.readFileSync('./tests/files/predittore_test_ErrorModel.json').toString(),
            ));
            expect(server.validityJson(managePredittore, ['A', 'B']))
                .toEqual('Il modello non coincide con quello selezionato');
        });
    });

    describe('Testing train method', () => {
        test('test addestramento', async () => {
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
    });

    describe('Testing savePredittore method', () => {
        test('salvataggio json', async () => {
            const nome = 'greg.json';
            const strPredittore = '';
            const csvReader = new CSVr('./tests/files/dati_test.csv', null);

            server.csvReader = csvReader;
            server.savePredittore(strPredittore, nome);

            const stats = fs.statSync('./greg.json');

            expect(stats).toBeTruthy();
        });
    });

    describe('Testing uploadForm method', async () => {
        
    });

    describe('Testing downloadPredittore method', async () => {
        
    });

    describe('Testing getCSVColumns method', async () => {
        
    });

    describe('Testing config method', () => {
        test('It should response the GET method', async () => {
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
    });

    describe('Testing startServer method', () => {
        test('Test for config loadCsv', async () => {
            await request(server.app)
                .post('/loadCsv')
                .expect(200);
        });
    });
});
