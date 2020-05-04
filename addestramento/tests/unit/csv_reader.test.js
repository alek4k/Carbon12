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

describe('Testing constructor', () => {
    test('Testing constructor with path and data', () => {
        const path = './tests/files/dati_test.csv';
        const option = {
            delimiter: ';',
            bom: true,
            columns: true,
            skip_empty_lines: true,
        };
        const rCSV = new CSVr(path, option);
        expect(rCSV).toEqual({
            records: [
                {
                    A: 'null',
                    B: '36350749646',
                    Labels: '-1',
                },
                {
                    A: '0.02222222222222222',
                    B: '36350877193',
                    Labels: '-1',
                },
                {
                    A: '577764938556921',
                    B: '3638583724267630',
                    Labels: '1',
                },
                {
                    A: '5.8',
                    B: '3640000000000000',
                    Labels: '-1',
                },
                {
                    A: '11511111111111100',
                    B: '4543859649122800',
                    Labels: '1',
                },
                {
                    A: '57555555555555500',
                    B: '4543859649122800',
                    Labels: '1',
                },
                {
                    A: '5733333333333330',
                    B: '4543859649122800',
                    Labels: '1',
                },
                {
                    A: '0',
                    B: '3638583724267630',
                    Labels: '-1',
                },
                {
                    A: '0',
                    B: '3638583724267630',
                    Labels: '-1',
                },
                {
                    A: '0.06666815',
                    B: '27500000000000000',
                    Labels: '-1',
                },
            ],
            columns: ['A', 'B', 'Labels'],
            labelsColumn: null,
        });
    });

    test('Testing constructor without option', () => {
        const path = './tests/files/dati_test.csv';
        const rCSV = new CSVr(path, null);
        expect(rCSV).toEqual({
            records: [
                {
                    A: 'null',
                    B: '36350749646',
                    Labels: '-1',
                },
                {
                    A: '0.02222222222222222',
                    B: '36350877193',
                    Labels: '-1',
                },
                {
                    A: '577764938556921',
                    B: '3638583724267630',
                    Labels: '1',
                },
                {
                    A: '5.8',
                    B: '3640000000000000',
                    Labels: '-1',
                },
                {
                    A: '11511111111111100',
                    B: '4543859649122800',
                    Labels: '1',
                },
                {
                    A: '57555555555555500',
                    B: '4543859649122800',
                    Labels: '1',
                },
                {
                    A: '5733333333333330',
                    B: '4543859649122800',
                    Labels: '1',
                },
                {
                    A: '0',
                    B: '3638583724267630',
                    Labels: '-1',
                },
                {
                    A: '0',
                    B: '3638583724267630',
                    Labels: '-1',
                },
                {
                    A: '0.06666815',
                    B: '27500000000000000',
                    Labels: '-1',
                },
            ],
            columns: ['A', 'B', 'Labels'],
            labelsColumn: null,
        });
    });

    test('Testing constructor with records.length = 0', () => {
        const path = './tests/files/dati_test_NotValidStructure.csv';
        const rCSV = new CSVr(path, null);
        expect(rCSV).toEqual({
            records: [],
            labelsColumn: null,
        });
    });
});

describe('Testing method', () => {
    beforeEach(() => {
        csvReader = new (function testCSVreader() {})();
        csvReader.records= [
            {
                A: 'null',
                B: '36350749646',
                Labels: '-1',
            },
            {
                A: '0.02222222222222222',
                B: '36350877193',
                Labels: '-1',
            },
            {
                A: '577764938556921',
                B: '3638583724267630',
                Labels: '1',
            },
            {
                A: '5.8',
                B: '3640000000000000',
                Labels: '-1',
            },
            {
                A: '11511111111111100',
                B: '4543859649122800',
                Labels: '1',
            },
            {
                A: '57555555555555500',
                B: '4543859649122800',
                Labels: '1',
            },
            {
                A: '5733333333333330',
                B: '4543859649122800',
                Labels: '1',
            },
            {
                A: '0',
                B: '3638583724267630',
                Labels: '-1',
            },
            {
                A: '0',
                B: '3638583724267630',
                Labels: '-1',
            },
            {
                A: '0.06666815',
                B: '27500000000000000',
                Labels: '-1',
            },
        ];
        csvReader.columns = ['A', 'B', 'Labels'];
        csvReader.labelsColumn = 'Labels';
    });

    afterEach(() => {
        csvReader = null;
    });

    test('It should response a vector with CSV\'s columns intersections', () => {
        csvReader.autoGetColumns = CSVr.prototype.autoGetColumns;
        expect(csvReader.autoGetColumns()).toEqual(['A', 'B', 'Labels']);
    });

    test('It should test that LabelsColumn is setted', () => {
        csvReader.setLabelsColumn = CSVr.prototype.setLabelsColumn;
        csvReader.setLabelsColumn(2);
        expect(csvReader.labelsColumn).toEqual('Labels');
    });

    test('It should response that columns==null', () => {
        csvReader.getData = CSVr.prototype.getData;
        expect(csvReader.getData(null)).toEqual(null);
    });

    test('It should response that function getData of file.csv work correctly', () => {
        csvReader.getData = CSVr.prototype.getData;
        expect(csvReader.getData(['Labels'])).toEqual([
            ['-1'], ['-1'], ['1'], ['-1'], ['1'], ['1'], ['1'], ['-1'], ['-1'], ['-1']]);
    });

    test('It should response that file.csv data were read correctly', () => {
        csvReader.autoGetData = CSVr.prototype.autoGetData;
        csvReader.getData = function f() {
            const result = [
                ['0', '36350749646'],
                ['0.02222222', '36350877193'],
                ['577764938556921', '3638583724267630'],
                ['5.8', '3640000000000000'],
                ['11511111111111100', '4543859649122800'],
                ['57555555555555500', '4543859649122800'],
                ['5733333333333330', '4543859649122800'],
                ['0', '3638583724267630'],
                ['0', '3638583724267630'],
                ['0.06666815', '27500000000000000'],
            ];
            return result;
        };
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
        csvReader.autoGetLabel = CSVr.prototype.autoGetLabel;
        csvReader.getData = function f() {
            const result = ['-1', '-1', '1', '-1', '1', '1', '1', '-1', '-1', '-1'];
            return result;
        };
        expect(csvReader.autoGetLabel()).toEqual([-1, -1, 1, -1, 1, 1, 1, -1, -1, -1]);
    });

    test('It should response that file.csv has the expected source', () => {
        csvReader.getDataSource = CSVr.prototype.getDataSource;
        expect(csvReader.getDataSource()).toEqual(['A', 'B']);
    });

    test('It should response that file.csv has the expected count of source', () => {
        csvReader.countSource = CSVr.prototype.countSource;
        csvReader.getDataSource = function f() {
            const result = ['A', 'B'];
            return result;
        };
        expect(csvReader.countSource()).toEqual(2);
    });
});
