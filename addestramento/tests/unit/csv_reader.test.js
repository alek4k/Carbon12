const CSVr = require('../../fileManager/csv_reader.js');

const csvReader = new CSVr('./tests/files/dati_test.csv', null);


test("It should response that function getData of file.csv work correctly if columns=0", () => {
    expect(csvReader.getDataSource()).toEqual(['A', 'B']);
});

test('It should response that function getData of file.csv work correctly', () => {
    let col= ['Labels'];
    expect(csvReader.getData(col)).toEqual([["-1"],["-1"],["1"],["-1"],["1"],["1"],["1"],["-1"],["-1"],["-1"]]);
});

test("It should response that file.csv data were read correctly", () => {
    let data = [
        [0, 36350749646.49240],
        [0.02222222222222222, 36350877192.98240],
        [5777649385.56921, 454035087719.29800],
        [5.8, 36385837242.67630],
        [115111111111.11100, 45438596491.22800],
        [575555555555.55500, 45438437058.11550],
        [57333333333.33330, 45438596491.22800],
        [0, 364202858887.18100],
        [0, 36385837242.67630],
        [0.0666681481810707, 274737806097.56500]
    ];
    let ret= csvReader.autoGetData();
    expect(csvReader.autoGetData()).toEqual(data);
    ///expect(csvReader.autoGetData()).toEqual(expect.arrayContaining(data));
    
    //data.forEach(x=> expect(ret).toContain(x));
});

test("It should response that file.csv has the expected label", () => {
    expect(csvReader.autoGetLabel()).toEqual([-1,-1,1,-1,1,1,1,-1,-1,-1]);
});

test('It should response that file.csv has the expected source', () => {
    expect(csvReader.getDataSource()).toEqual(['A', 'B']);
});

test('It should response that file.csv has the expected count of source', () => {
    expect(csvReader.countSource()).toEqual(2);
});