/**
 * File name: influx.test.js
 * Date: 2020-04-29
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

import { ajaxMock } from 'jquery';

import Influx from '../../../src/utils/influx';

it('Testing constructor', () => {
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

describe('Testing method', () => {
    let influx = null;
    const oldHost = 'localhost';
    const oldPort = 8080;
    const oldDatabase = 'telegraf';

    beforeEach(() => {
        influx = new Influx(oldHost, oldPort, oldDatabase);

        ajaxMock.mockReset();
    });

    it('deleteAllPredictions', () => {
        influx.predictions = [1, 2];
        ajaxMock.mockImplementation((obj) => {
            obj.success();
        });

        influx.deleteAllPredictions();

        expect(ajaxMock).toHaveBeenCalledTimes(2);
        expect(influx).toEqual({
            host: oldHost,
            port: oldPort,
            database: oldDatabase,
            predictions: [],
        });
    });
});
