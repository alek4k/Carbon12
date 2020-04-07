/**
 * File name: app.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const Server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');


const server = new Server();

test('This test will send a messagge when the structure of file.csv is not correct', () => {
    const csvReader = new CSVr('./tests/files/dati_test_NotValidStructure.csv', null);
    expect(server.validityCsv(csvReader)).toEqual('Struttura csv non valida');
});

test('This test will not send a messagge because the structure of file.csv is correct', () => {
    const csvReader = new CSVr('./tests/files/dati_test.csv', null);
    expect(server.validityCsv(csvReader)).not.toEqual('Struttura csv non valida');
});
