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

let server = null;

beforeEach(() => {
    server = new Server();
    server.startServer();
});

afterEach(() => {
    server.server.close();
    server = null;
});

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

test('Test for config loadCsv', async () => {
    await request(server.app)
        .post('/loadCsv')
        .expect(200);
});

test('test addestramento', () => {
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

test('salvataggio json', () => {
    const nome = 'greg.json';
    const strPredittore = '';
    const csvReader = new CSVr('./tests/files/dati_test.csv', null);

    server.csvReader = csvReader;
    server.savePredittore(strPredittore, nome);

    const stats = fs.statSync('./greg.json');

    expect(stats).toBeTruthy();
});
