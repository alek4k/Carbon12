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

import DBConnection from '../../../src/utils/db_connection';

describe('Testing constructor', () => {
    it('with correct values', () => {
        const parHost = 'localhost';
        const parPort = 1234;
        const parDatabase = 'telegraf';
        const influx = new DBConnection(parHost, parPort, parDatabase);
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
            expect(() => { new DBConnection(parHost, parPort, parDatabase); })
                .toThrow(new Error('Incorrect values'));
        });

        it('for port param', () => {
            const parHost = 'localhost';
            const parPort = undefined;
            const parDatabase = 'telegraf';
            // eslint-disable-next-line no-new
            expect(() => { new DBConnection(parHost, parPort, parDatabase); })
                .toThrow(new Error('Incorrect values'));
        });

        it('for database param', () => {
            const parHost = 'localhost';
            const parPort = 1234;
            const parDatabase = undefined;
            // eslint-disable-next-line no-new
            expect(() => { new DBConnection(parHost, parPort, parDatabase); })
                .toThrow(new Error('Incorrect values'));
        });

        it('for all params', () => {
            // eslint-disable-next-line no-new
            expect(() => { new DBConnection(undefined, undefined, undefined); })
                .toThrow(new Error('Incorrect values'));
        });
    });
});
