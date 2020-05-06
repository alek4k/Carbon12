/**
 * File name: target.test.js
 * Date: 2020-04-28
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

import Target from '../../../src/utils/target';

it('Testing constructor', () => {
    const parId = 1;
    const target = new Target(parId);
    expect(target).toEqual({ id: parId });
});

describe('Testing method', () => {
    let target = null;
    beforeEach(() => {
        target = new (function testTarget() { })();
    });

    afterEach(() => {
        target = null;
    });

    it('setId', () => {
        target.setId = Target.prototype.setId;

        const parId = 2;
        target.setId(parId);

        expect(target).toEqual({
            setId: Target.prototype.setId,
            id: parId,
        });
    });

    it('getId', () => {
        target.getId = Target.prototype.getId;
        target.id = 3;
        const expId = target.id;

        expect(target.getId()).toEqual(expId);
        expect(target).toEqual({
            getId: Target.prototype.getId,
            id: expId,
        });
    });

    describe('getJSON', () => {
        beforeEach(() => {
            target.getJSON = Target.prototype.getJSON;
        });

        it('when id has been set', () => {
            target.id = 7;
            const expId = target.id;


            expect(target.getJSON()).toEqual({
                refId: 'Predizione' + expId,
                measurement: 'predizione' + expId,
                policy: 'default',
                resultFormat: 'time_series',
                orderByTime: 'ASC',
                select: [
                    [{
                        type: 'field',
                        params: [
                            'value',
                        ],
                    }, {
                        type: 'last',
                        params: [],
                    }],
                ],
                groupBy: [{
                    type: 'time',
                    params: [
                        '$__interval',
                    ],
                }, {
                    type: 'fill',
                    params: [
                        'previous',
                    ],
                }],
            });
            expect(target).toEqual({
                getJSON: Target.prototype.getJSON,
                id: expId,
            });
        });

        it('when id has not been set', () => {
            expect(target.getJSON()).toEqual(undefined);
            expect(target).toEqual({
                getJSON: Target.prototype.getJSON,
            });
        });
    });
});
