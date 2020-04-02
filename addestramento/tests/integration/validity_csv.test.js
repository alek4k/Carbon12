const Server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');


let server = new Server();

test('This test will send a messagge when the structure of file.csv is not correct', () => {
    msg= 'Struttura csv non valida';
    const csvReader = new CSVr('./tests/files/dati_test_NotValidStructure.csv', null);
    expect(server.validityCsv(csvReader)).toEqual(msg);
});

test('This test will not send a messagge because the structure of file.csv is correct', () => {
    msg= 'Struttura csv non valida';
    const csvReader = new CSVr('./tests/files/dati_test.csv', null);
    expect(server.validityCsv(csvReader)).not.toEqual(msg);
});
