/**
 * File name: influx.test.js
 * Date: 2020-04-29
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import { ajaxMock } from 'jquery';

import Influx from '../../../src/utils/influx';
import DBConnection from '../../../src/utils/db_connection';

jest.mock('../../../src/utils/db_connection');

it('Testing constructor', () => {
    const parHost = 'localhost';
    const parPort = 1234;
    const parDatabase = 'telegraf';
    const influx = new Influx(parHost, parPort, parDatabase);
    expect(DBConnection).toHaveBeenCalledTimes(1);
    expect(DBConnection).toHaveBeenCalledWith(parHost, parPort, parDatabase);
    expect(influx).toEqual({
    });
});

describe('Testing method', () => {
    let influx = null;
    let oldHost;
    let oldPort;
    let oldDatabase;
    let data = null;

    beforeEach(() => {
        influx = new (function testInflux() { })();
        influx.host = 'localhost';
        influx.port = 8080;
        influx.database = 'telegraf';
        oldHost = 'localhost';
        oldPort = 8080;
        oldDatabase = 'telegraf';

        data = {
            results: [
                {
                    statement_id: 0,
                    series: [
                        {
                            name: 'CPU',
                            columns: [
                                'fieldKey',
                                'fieldType',
                            ],
                            values: [
                                [
                                    'usage_guest',
                                    'float',
                                ],
                            ],
                        }, {
                            name: 'predizioneCPU',
                            columns: [
                                'fieldKey',
                                'fieldType',
                            ],
                            values: [
                                [
                                    'usage_guest',
                                    'float',
                                ],
                            ],
                        },
                    ],
                },
            ],
        };

        ajaxMock.mockClear();
    });

    describe('query', () => {
        beforeEach(() => {
            influx.query = Influx.prototype.query;
        });

        it('success', () => {
            ajaxMock.mockImplementationOnce((req) => {
                req.success(data);
            });

            const parQuery = 'q=show field keys on telegraf';
            const returnValue = influx.query(parQuery);

            expect(returnValue).not.toEqual(undefined);
            expect(returnValue).toEqual(data.results[0].series[0].values);
            expect(ajaxMock).toHaveBeenCalledTimes(1);
            expect(ajaxMock).toHaveBeenCalledWith({
                async: false,
                url: `${oldHost}:${oldPort}/query?db=${oldDatabase}`,
                type: 'GET',
                contentType: 'application/octet-stream',
                data: parQuery,
                processData: false,
                success: expect.any(Function),
                error: expect.any(Function),
            });
            expect(influx).toEqual({
                host: oldHost,
                port: oldPort,
                database: oldDatabase,
                query: Influx.prototype.query,
            });
        });

        it('error', () => {
            ajaxMock.mockImplementationOnce((req) => {
                req.error();
            });

            const parQuery = 'q=show field keys on telegraf';
            const returnValue = influx.query(parQuery);

            expect(returnValue).toEqual(undefined);
            expect(ajaxMock).toHaveBeenCalledTimes(1);
            expect(ajaxMock).toHaveBeenCalledWith({
                async: false,
                url: `${oldHost}:${oldPort}/query?db=${oldDatabase}`,
                type: 'GET',
                contentType: 'application/octet-stream',
                data: parQuery,
                processData: false,
                success: expect.any(Function),
                error: expect.any(Function),
            });
            expect(influx).toEqual({
                host: oldHost,
                port: oldPort,
                database: oldDatabase,
                query: Influx.prototype.query,
            });
        });
    });


    describe('getLastValue', () => {
        beforeEach(() => {
            influx.getLastValue = Influx.prototype.getLastValue;
        });

        describe('with instance', () => {
            it('success', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.success(data);
                });

                const parSource = 'testSource';
                const parInstance = 'testInstance';
                const parParam = 'testParam';
                const returnValue = influx.getLastValue(parSource, parInstance, parParam);

                expect(returnValue).not.toEqual(undefined);
                expect(returnValue).toEqual(data.results[0].series[0].values[0][1]);
                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?db=${oldDatabase}`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=select ${parParam} from ${parSource} where `
                        + `instance='${parInstance}' order by time desc limit 1`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    getLastValue: Influx.prototype.getLastValue,
                });
            });

            it('error', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.error();
                });

                const parSource = 'testSource';
                const parInstance = 'testInstance';
                const parParam = 'testParam';
                const returnValue = influx.getLastValue(parSource, parInstance, parParam);

                expect(returnValue).toEqual(undefined);
                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?db=${oldDatabase}`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=select ${parParam} from ${parSource} where `
                        + `instance='${parInstance}' order by time desc limit 1`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    getLastValue: Influx.prototype.getLastValue,
                });
            });
        });

        describe('without instance', () => {
            it('success', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.success(data);
                });

                const parSource = 'testSource';
                const parInstance = undefined;
                const parParam = 'testParam';
                const returnValue = influx.getLastValue(parSource, parInstance, parParam);

                expect(returnValue).not.toEqual(undefined);
                expect(returnValue).toEqual(data.results[0].series[0].values[0][1]);
                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?db=${oldDatabase}`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=select ${parParam} from ${parSource} order by time desc limit 1`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    getLastValue: Influx.prototype.getLastValue,
                });
            });

            it('error', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.error();
                });

                const parSource = 'testSource';
                const parInstance = undefined;
                const parParam = 'testParam';
                const returnValue = influx.getLastValue(parSource, parInstance, parParam);

                expect(returnValue).toEqual(undefined);
                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?db=${oldDatabase}`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=select ${parParam} from ${parSource} order by time desc limit 1`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    getLastValue: Influx.prototype.getLastValue,
                });
            });
        });
    });

    describe('getSources', () => {
        beforeEach(() => {
            influx.getSources = Influx.prototype.getSources;
        });

        describe('with data.results[0].series defined', () => {
            it('success', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.success(data);
                });

                const returnValue = influx.getSources();

                expect(returnValue).not.toEqual([]);
                expect(returnValue).toEqual([data.results[0].series[0]]);
                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=show field keys on ${oldDatabase}`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    getSources: Influx.prototype.getSources,
                    predictions: [data.results[0].series[1].name.substr(10)],
                });
            });

            it('error', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.error();
                });

                const returnValue = influx.getSources();

                expect(returnValue).toEqual([]);
                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=show field keys on ${oldDatabase}`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    getSources: Influx.prototype.getSources,
                });
            });
        });

        describe('with data.results[0].series defined', () => {
            beforeEach(() => {
                data.results[0].series = undefined;
            });

            it('success', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.success(data);
                });

                const returnValue = influx.getSources();

                expect(returnValue).toEqual([]);
                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=show field keys on ${oldDatabase}`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    getSources: Influx.prototype.getSources,
                    predictions: [],
                });
            });

            it('error', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.error();
                });

                const returnValue = influx.getSources();

                expect(returnValue).toEqual([]);
                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=show field keys on ${oldDatabase}`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    getSources: Influx.prototype.getSources,
                });
            });
        });
    });

    describe('getInstances', () => {
        beforeEach(() => {
            influx.getInstances = Influx.prototype.getInstances;
        });

        it('success', () => {
            ajaxMock.mockImplementationOnce((req) => {
                req.success(data);
            });

            const returnValue = influx.getInstances();

            expect(returnValue).not.toEqual(undefined);
            expect(returnValue).toEqual(data.results[0].series);
            expect(ajaxMock).toHaveBeenCalledTimes(1);
            expect(ajaxMock).toHaveBeenCalledWith({
                async: false,
                url: `${oldHost}:${oldPort}/query?`,
                type: 'GET',
                contentType: 'application/octet-stream',
                data: `q=show tag values on "${oldDatabase}" with key = "instance"`,
                processData: false,
                success: expect.any(Function),
                error: expect.any(Function),
            });
            expect(influx).toEqual({
                host: oldHost,
                port: oldPort,
                database: oldDatabase,
                getInstances: Influx.prototype.getInstances,
            });
        });

        it('error', () => {
            ajaxMock.mockImplementationOnce((req) => {
                req.error();
            });

            const returnValue = influx.getInstances();

            expect(returnValue).toEqual(undefined);
            expect(ajaxMock).toHaveBeenCalledTimes(1);
            expect(ajaxMock).toHaveBeenCalledWith({
                async: false,
                url: `${oldHost}:${oldPort}/query?`,
                type: 'GET',
                contentType: 'application/octet-stream',
                data: `q=show tag values on "${oldDatabase}" with key = "instance"`,
                processData: false,
                success: expect.any(Function),
                error: expect.any(Function),
            });
            expect(influx).toEqual({
                host: oldHost,
                port: oldPort,
                database: oldDatabase,
                getInstances: Influx.prototype.getInstances,
            });
        });
    });

    describe('storeValue', () => {
        beforeEach(() => {
            influx.storeValue = Influx.prototype.storeValue;
        });

        it('success', () => {
            ajaxMock.mockImplementationOnce((req) => {
                req.success(data);
            });

            const parMeasurement = 'TestMeasurement';
            const parValue = 'TestValue';
            influx.storeValue(parMeasurement, parValue);

            expect(ajaxMock).toHaveBeenCalledTimes(1);
            expect(ajaxMock).toHaveBeenCalledWith({
                async: false,
                url: `${oldHost}:${oldPort}/write?db=${oldDatabase}`,
                type: 'POST',
                contentType: 'application/octet-stream',
                data: `${parMeasurement} value=${parValue}`,
                processData: false,
                success: expect.any(Function),
                error: expect.any(Function),
            });
            expect(influx).toEqual({
                host: oldHost,
                port: oldPort,
                database: oldDatabase,
                storeValue: Influx.prototype.storeValue,
            });
        });

        it('error', () => {
            ajaxMock.mockImplementationOnce((req) => {
                req.error();
            });

            const parMeasurement = 'TestMeasurement';
            const parValue = 'TestValue';
            influx.storeValue(parMeasurement, parValue);

            expect(ajaxMock).toHaveBeenCalledTimes(1);
            expect(ajaxMock).toHaveBeenCalledWith({
                async: false,
                url: `${oldHost}:${oldPort}/write?db=${oldDatabase}`,
                type: 'POST',
                contentType: 'application/octet-stream',
                data: `${parMeasurement} value=${parValue}`,
                processData: false,
                success: expect.any(Function),
                error: expect.any(Function),
            });
            expect(influx).toEqual({
                host: oldHost,
                port: oldPort,
                database: oldDatabase,
                storeValue: Influx.prototype.storeValue,
            });
        });
    });

    describe('deletePrediction', () => {
        beforeEach(() => {
            influx.deletePrediction = Influx.prototype.deletePrediction;
            influx.predictions = [1, 2];
        });

        describe('with a prediction inside influx.predictions', () => {
            it('success', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.success(data);
                });

                const parPrediction = influx.predictions[0];
                influx.deletePrediction(parPrediction);

                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?db=${oldDatabase}`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=drop measurement predizione${parPrediction}`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    deletePrediction: Influx.prototype.deletePrediction,
                    predictions: [2],
                });
            });

            it('error', () => {
                ajaxMock.mockImplementationOnce((req) => {
                    req.error();
                });

                const parPrediction = influx.predictions[0];
                influx.deletePrediction(parPrediction);

                expect(ajaxMock).toHaveBeenCalledTimes(1);
                expect(ajaxMock).toHaveBeenCalledWith({
                    async: false,
                    url: `${oldHost}:${oldPort}/query?db=${oldDatabase}`,
                    type: 'GET',
                    contentType: 'application/octet-stream',
                    data: `q=drop measurement predizione${parPrediction}`,
                    processData: false,
                    success: expect.any(Function),
                    error: expect.any(Function),
                });
                expect(influx).toEqual({
                    host: oldHost,
                    port: oldPort,
                    database: oldDatabase,
                    deletePrediction: Influx.prototype.deletePrediction,
                    predictions: [1, 2],
                });
            });
        });

        it('with a prediction not inside influx.predictions', () => {
            ajaxMock.mockImplementationOnce((req) => {
                req.error();
            });

            const parPrediction = 3;
            influx.deletePrediction(parPrediction);

            expect(ajaxMock).toHaveBeenCalledTimes(0);
            expect(influx).toEqual({
                host: oldHost,
                port: oldPort,
                database: oldDatabase,
                deletePrediction: Influx.prototype.deletePrediction,
                predictions: [1, 2],
            });
        });
    });

    it('deleteAllPredictions', () => {
        influx.deleteAllPredictions = Influx.prototype.deleteAllPredictions;
        const fDeletePrediction = jest.fn(() => { });
        influx.deletePrediction = fDeletePrediction;
        influx.predictions = [1, 2];

        influx.deleteAllPredictions();

        expect(influx.deletePrediction).toHaveBeenCalledTimes(influx.predictions.length);
        for (let i = 0; i < influx.predictions.length; i++) {
            expect(influx.deletePrediction)
                .toHaveBeenCalledWith(influx.predictions[i]);
        }
        expect(influx).toEqual({
            host: oldHost,
            port: oldPort,
            database: oldDatabase,
            deleteAllPredictions: Influx.prototype.deleteAllPredictions,
            deletePrediction: fDeletePrediction,
            predictions: [1, 2],
        });
    });
});
