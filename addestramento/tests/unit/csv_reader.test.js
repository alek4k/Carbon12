const CSVr = require('../../fileManager/csv_reader.js');

const csvReader = new CSVr('./tests/files/dati_test.csv', null);

describe("Test csv reader", () => {
    test("It should response that file.csv was written correctly", () => {
        let data = [];
        data[0] = [];
        data[1] = [];
        data[2] = [];
        data[3] = [];
        data[4] = [];
        data[5] = [];
        data[6] = [];
        data[7] = [];
        data[8] = [];
        data[9] = [];
        data[0][0] = "0";
        data[0][1] = 3.635;
        data[1][0] = "0.02222222222222222";
        data[1][1] = 3.635;
        data[2][0] = "577.764.938.556.921";
        data[2][1] = 45.403;
        data[3][0] = "5.8";
        data[3][1] = 3.638;
        data[4][0] = "11.511.111.111.111.100";
        data[4][1] = 4.543;
        data[5][0] = "57.555.555.555.555.500";
        data[5][1] = 4.543;
        data[6][0] = "5.733.333.333.333.330";
        data[6][1] = 4.543;
        data[7][0] = "0";
        data[7][1] = 36.42;
        data[8][0] = "0";
        data[8][1] = 3.638;
        data[9][0] = "0.0666681481810707";
        data[9][1] = 27.473;

        let labels = [-1,-1,1,-1,1,1,1,-1,-1,-1];

        let sources = ['A', 'B'];

        expect(sources).toEqual(csvReader.getDataSource());

        expect(data).toEqual(csvReader.autoGetData());

        expect(labels).toEqual(csvReader.autoGetLabel());

    });
});
