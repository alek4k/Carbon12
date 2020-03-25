const server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');


describe("Test integration csv reader", () => {
    test("It should response that file.csv was written correctly", () => {
        let s = new server();
        s.startServer();
        const csvReader = new CSVr('./tests/files/dati_test.csv', null);

        expect(s.validityCsv(csvReader)).toBeFalsy();
    });
});

