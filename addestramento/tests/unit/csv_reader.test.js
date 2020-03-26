const CSVr = require('../../fileManager/csv_reader.js');


describe("Test csv reader", () => {
    test("It should response that file.csv was written correctly", () => {
        const csvReader = new CSVr('./tests/files/dati_test.csv', null);

        expect(csvReader.getDataSource()).toEqual(['A', 'B']);

        expect(csvReader.autoGetData()).toEqual([
            [0, 3635074964649240],
            [0.02222222222222222, 3635087719298240],
            [577764938556921, 45403508771929800],
            [5.8, 3638583724267630],
            [11511111111111100, 4543859649122800],
            [57555555555555500, 4543843705811550],
            [5733333333333330, 4543859649122800],
            [0, 36420285888718100],
            [0, 3638583724267630],
            [0.0666681481810707, 27473780609756500]
        ]);

        expect(csvReader.autoGetLabel()).toEqual([-1,-1,1,-1,1,1,1,-1,-1,-1]);
    });
});
