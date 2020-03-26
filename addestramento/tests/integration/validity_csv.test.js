const Server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');


let server = new Server();

test('This test will send a messagge when the structure of file.csv is not correct', () => {
    msg= 'Struttura csv non valida';
    const csvReader = new CSVr('./tests/files/dati_test.csv', null);
    expect(server.validityCsv(csvReader)).toEqual(msg);
});
