const fs = require('fs');
const Server = require('../../server');
const RPredittore = require('../../fileManager/r_predittore.js');

const server = new Server();

test('Check if server will send a messagge when the structure of file.json is not correct, title is not correct', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotValidStructure1.json').toString(),
    ));
    msg= 'Struttura json non valida';
    expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual(msg);
});

test('Check if server will send a messagge when the structure of file.json is not correct, one or more arrayOfKeys are not correct', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotValidStructure2.json').toString(),
    ));
    msg= 'Struttura json non valida';
    expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual(msg);
});

test('Check if server will send a messagge when addestramento version is not compatible', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotVersionCompatibility.json').toString(),
    ));
    msg= 'Versione file di addestramento non compatibile';
    expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual(msg);
});

test('Check if server will send a messagge when the numers of sources of file.csv are equal to file.json sources', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry1.json').toString(),
    ));
    msg= 'Le data entry non coincidono con quelle del file di addestramento';
    expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual(msg);
});

test('Check if server will send a messagge when sources of file.csv are equal to file.json sources', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry2.json').toString(),
    ));
    msg= 'Le data entry non coincidono con quelle del file di addestramento';
    expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual(msg);
});

test('Check se il server invia un messagio quando il modello selezionato non coincide con quello presente in file.json', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorModel.json').toString(),
    ));
    msg= 'Il modello non coincide con quello selezionato';
    expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual(msg);
});
