/**
 * File name: target.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */
export default class Target {
    setId(i) {
        this.id = i;
    }

    getId() {
        return this.id;
    }

    getJSON() {
        if (this.id !== null) {
            return {
                refId: 'Predizione' + this.id,
                measurement: 'predizione' + this.id,
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
            };
        }
        return undefined;
    }
}
