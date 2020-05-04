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
const Server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');
const RPredittore = require('../../fileManager/r_predittore.js');

let server = null;

beforeEach(() => {
    server = new Server();
});

afterEach(() => {
    server.server.close();
    server = null;
});

test('This test will not send a messagge because the structure of file.csv is correct', () => {
    const csvReader = new CSVr('./tests/files/dati_test.csv', null);
    expect(server.validityCsv(csvReader)).toEqual('');
});

test('This test will not send a messagge because the structure of file.csv is not correct', () => {
    const csvReader = new CSVr('./tests/files/dati_test_DatiMancanti.csv', null);
    csvReader.setLabelsColumn(2);
    expect(server.validityCsv(csvReader)).toEqual(
        'Valori attesi nel campo Labels del file csv mancanti',
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
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Versione file di addestramento non compatibile');
});

test('Error messagge: the n. of sources of file.csv are not equal to file.json sources', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry1.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Le data entry non coincidono con quelle del file di addestramento');
});

test('Error messagge: sources of file.csv are equal to file.json sources', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry2.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Le data entry non coincidono con quelle del file di addestramento');
});

test('Error messagge: Model select is not equal to file.json model', () => {
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorModel.json').toString(),
    ));
    expect(server.validityJson(managePredittore, ['A', 'B']))
        .toEqual('Il modello non coincide con quello selezionato');
});
