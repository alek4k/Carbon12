/**
 * File name: csv_reader.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della class CSV_Reader
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const CSVr = require('../../fileManager/csv_reader.js');

let csvReader = null;

beforeEach(() => {
    csvReader = new CSVr('./tests/files/dati_test.csv', null);
});

afterEach(() => {
    csvReader = null;
});

test('It should response that function getData of file.csv work correctly with 0 columns', () => {
    csvReader.setLabelsColumn(2);
    expect(csvReader.getDataSource()).toEqual(['A', 'B']);
});

test('It should response that function getData of file.csv work correctly', () => {
    expect(csvReader.getData(['Labels'])).toEqual([
        ['-1'], ['-1'], ['1'], ['-1'], ['1'], ['1'], ['1'], ['-1'], ['-1'], ['-1']]);
});

test('It should response that file.csv data were read correctly', () => {
    const data = [
        [0, 36350749646],
        [0.02222222, 36350877193],
        [577764938556921, 45403508771929800],
        [5.8, 3638583724267630],
        [11511111111111100, 4543859649122800],
        [57555555555555500, 4543843705811550],
        [5733333333333330, 4543859649122800],
        [0, 36420285888718100],
        [0, 3638583724267630],
        [0.06666815, 27473780609756500],
    ];
    expect(csvReader.autoGetData()).toEqual(data);
});


test('It should response that file.csv has the expected label', () => {
    expect(csvReader.autoGetLabel()).toEqual([-1, -1, 1, -1, 1, 1, 1, -1, -1, -1]);
});

test('It should response that file.csv has the expected source', () => {
    expect(csvReader.getDataSource()).toEqual(['A', 'B']);
});

test('It should response that file.csv has the expected count of source', () => {
    expect(csvReader.countSource()).toEqual(2);
});
