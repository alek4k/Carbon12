/**
 * File name: target.test.js
 * Date: 2020-04-28
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
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
        target = new Target();
    });

    afterEach(() => {
        target = null;
    });

    it('setId', () => {
        const newId = 2;
        target.setId(newId);
        expect(target.id).toEqual(newId);
    });

    it('getId', () => {
        const testId = 3;
        target.id = testId;
        expect(target.getId()).toEqual(testId);
    });

    describe('getJSON', () => {
        it('when id has been set', () => {
            target.id = 7;
            expect(target.getJSON()).toEqual({
                refId: 'Predizione' + target.id,
                measurement: 'predizione' + target.id,
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
        });

        it('when id has not been set', () => {
            console.log(target.id);
            expect(target.getJSON()).toEqual(undefined);
        });
    });
});
