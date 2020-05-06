/**
 * File name: validity_csv.test.js
 * Date: 2020-03-18
 *
 * @file Test metodo validityCsv()
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */
const CsvReader = require('../../fileManager/csv_reader').csvreader;

let csvReader = null;

beforeEach(() => {
    csvReader = new CsvReader('./tests/files/dati_test.csv', null);
    csvReader.setLabelsColumn(2);
});

afterEach(() => {
    csvReader = null;
});

test('It should response a vector with CSV\'s columns intersections', () => {
    expect(csvReader.autoGetColumns()).toEqual(['A', 'B', 'Labels']);
});

test('It should test that LabelsColumn is setted', () => {
    expect(csvReader.labelsColumn).toEqual('Labels');
});

test('It should response that columns==null', () => {
    expect(csvReader.getData(null)).toEqual(null);
});

test('It should response that function getData of file.csv work correctly', () => {
    expect(csvReader.getData(['Labels'])).toEqual([
        ['-1'], ['-1'], ['1'], ['-1'], ['1'], ['1'], ['1'], ['-1'], ['-1'], ['-1']]);
});

test('It should response that file.csv data were read correctly', () => {
    const data = [
        [0, 36350749646],
        [0.02222222, 36350877193],
        [577764938556921, 3638583724267630],
        [5.8, 3640000000000000],
        [11511111111111100, 4543859649122800],
        [57555555555555500, 4543859649122800],
        [5733333333333330, 4543859649122800],
        [0, 3638583724267630],
        [0, 3638583724267630],
        [0.06666815, 27500000000000000],
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
