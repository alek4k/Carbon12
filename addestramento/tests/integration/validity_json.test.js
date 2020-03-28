const fs = require('fs');
const Server = require('../../server');
const RPredittore = require('../../fileManager/r_predittore.js');

const server = new Server();

test('Check if server will send a messagge when the structure of file.json is not correct', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotValidStructure.json').toString(),
    ));
    msg= 'Struttura json non valida';
    expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual(msg);
});

test('Check se il server invia un messagio quando la versione addestramento non è compatibile', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotVersionCompatibility.json').toString(),
    ));
    msg= 'Versione file di addestramento non compatibile';
    expect(server.validityJson(managePredittore, ['A', 'B'])).toEqual(msg);
});

test('Check se il server invia un messagio quando le solgenti presenti nei file.csv e file.json non coincidono', () =>{
    const managePredittore = new RPredittore(JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_ErrorDataEntry.json').toString(),
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
