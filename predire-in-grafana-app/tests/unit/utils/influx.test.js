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


describe('Testing constructor', () => {
    it('with correct values', () => {
        const parHost = 'localhost';
        const parPort = 1234;
        const parDatabase = 'telegraf';
        const influx = new Influx(parHost, parPort, parDatabase);
        expect(influx).toEqual({
            host: parHost,
            port: parPort,
            database: parDatabase,
            predictions: [],
        });
    });
    describe('with incorrect values', () => {
        it('for host param', () => {
            const parHost = null;
            const parPort = 1234;
            const parDatabase = 'telegraf';
            // eslint-disable-next-line no-new
            expect(() => { new Influx(parHost, parPort, parDatabase); })
                .toThrow(new Error('Incorrect values'));
        });
        it('for port param', () => {
            const parHost = 'localhost';
            const parPort = undefined;
            const parDatabase = 'telegraf';
            // eslint-disable-next-line no-new
            expect(() => { new Influx(parHost, parPort, parDatabase); })
                .toThrow(new Error('Incorrect values'));
        });
        it('for database param', () => {
            const parHost = 'localhost';
            const parPort = 1234;
            const parDatabase = undefined;
            // eslint-disable-next-line no-new
            expect(() => { new Influx(parHost, parPort, parDatabase); })
                .toThrow(new Error('Incorrect values'));
        });

        it('for all params', () => {
            // eslint-disable-next-line no-new
            expect(() => { new Influx(undefined, undefined, undefined); })
                .toThrow(new Error('Incorrect values'));
        });
    });
});

describe('Testing method', () => {
    let influx = null;
    beforeEach(() => {
        influx = new (function testInflux() { })();
    });

    afterEach(() => {
        influx = null;
        ajaxMock.mockClear();
    });

    it('query', () => {
        influx.query = Influx.prototype.query;
        influx.host = 'localhost';
        influx.port = 8080;
        influx.database = 'telegraf';

        const query = 'q=show field keys on telegraf';
        influx.query(query);
        expect(ajaxMock).toHaveBeenCalledTimes(1);
        expect(ajaxMock.mock.calls[0][0]).toMatchObject({
            url: `${influx.host}:${influx.port}/query?db=${influx.database}`,
            data: query,
        });
    });

    describe('getLastValue', () => {
        it('with instance', () => {
            influx.getLastValue = Influx.prototype.getLastValue;
            influx.host = 'localhost';
            influx.port = 8080;
            influx.database = 'telegraf';

            const parSource = 'TestSource';
            const parInstance = 'TestInstance';
            const parParam = 'TestParam';
            const query = `q=select ${parParam} from ${parSource} where 
                instance='${parInstance}' order by time desc limit 1`;
            influx.getLastValue(parSource, parInstance, parParam);

            expect(ajaxMock).toHaveBeenCalledTimes(1);
            expect(ajaxMock.mock.calls[0][0]).toMatchObject({
                url: `${influx.host}:${influx.port}/query?db=${influx.database}`,
                data: query,
            });
        });

        it('without instance', () => {
            influx.getLastValue = Influx.prototype.getLastValue;
            influx.host = 'localhost';
            influx.port = 8080;
            influx.database = 'telegraf';

            const parSource = 'TestSource';
            const parParam = 'TestParam';
            const query = `q=select ${parParam} from ${parSource} order by time desc limit 1`;
            influx.getLastValue(parSource, undefined, parParam);

            expect(ajaxMock).toHaveBeenCalledTimes(1);
            expect(ajaxMock.mock.calls[0][0]).toMatchObject({
                url: `${influx.host}:${influx.port}/query?db=${influx.database}`,
                data: query,
            });
        });
    });

    it('getSources', () => {
        influx.getSources = Influx.prototype.getSources;
        influx.host = 'localhost';
        influx.port = 8080;
        influx.database = 'telegraf';

        const query = `q=show field keys on ${influx.database}`;
        influx.getSources();
        expect(ajaxMock).toHaveBeenCalledTimes(1);
        expect(ajaxMock.mock.calls[0][0]).toMatchObject({
            url: `${influx.host}:${influx.port}/query?`,
            data: query,
        });
    });

    it('getInstances', () => {
        influx.getInstances = Influx.prototype.getInstances;
        influx.host = 'localhost';
        influx.port = 8080;
        influx.database = 'telegraf';

        const query = `q=show tag values on "${influx.database}" with key = "instance"`;
        influx.getInstances();
        expect(ajaxMock).toHaveBeenCalledTimes(1);
        expect(ajaxMock.mock.calls[0][0]).toMatchObject({
            url: `${influx.host}:${influx.port}/query?`,
            data: query,
        });
    });

    it('storeValue', () => {
        influx.storeValue = Influx.prototype.storeValue;
        influx.host = 'localhost';
        influx.port = 8080;
        influx.database = 'telegraf';

        const parMeasurement = 'TestCPU';
        const parValue = 'TestValue';
        const query = `${parMeasurement} value=${parValue}`;
        influx.storeValue(parMeasurement, parValue);
        expect(ajaxMock).toHaveBeenCalledTimes(1);
        expect(ajaxMock.mock.calls[0][0]).toMatchObject({
            url: `${influx.host}:${influx.port}/write?db=${influx.database}`,
            data: query,
        });
    });

    it('deletePrediction', () => {
        influx.deletePrediction = Influx.prototype.deletePrediction;
        influx.host = 'localhost';
        influx.port = 8080;
        influx.database = 'telegraf';
        influx.predictions = [1, 2];

        const parPrediction = influx.predictions[0];
        const query = `q=drop measurement predizione${parPrediction}`;
        influx.deletePrediction(parPrediction);
        expect(ajaxMock).toHaveBeenCalledTimes(1);
        expect(ajaxMock.mock.calls[0][0]).toMatchObject({
            url: `${influx.host}:${influx.port}/query?db=${influx.database}`,
            data: query,
        });
        expect(influx.predictions).toEqual([1, 2]);
    });

    it('deleteAllPredictions', () => {
        influx.deleteAllPredictions = Influx.prototype.deleteAllPredictions;
        influx.deletePrediction = jest.fn(() => { });
        influx.host = 'localhost';
        influx.port = 8080;
        influx.database = 'telegraf';
        influx.predictions = [1, 2];


        influx.deleteAllPredictions();
        expect(influx.deletePrediction).toHaveBeenCalledTimes(influx.predictions.length);
        for (let i = 0; i < influx.predictions.length; i++) {
            console.log(influx.deletePrediction);
            expect(influx.deletePrediction)
                .toHaveBeenCalledWith(influx.predictions[i]);
        }
        expect(influx.predictions).toEqual([1, 2]);
    });
});
