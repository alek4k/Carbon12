/**
 * File name: target.js
 * Date: 2020-04-06
 *
 * @file Classe che rappresenta la selezione delle sorgenti da monitorare con il pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificato metodo getJSON()
 */


export default class Target {
    /**
     * Costruisce l'oggetto che rappresenta la selezione delle sorgenti da monitorare con il pannello
     * @param {id} Number rappresenta l'id del pannello che si desidera inizializzare
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Imposta l'id del pannello corrente
     * @param {id} Number rappresenta l'id del pannello corrente
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Ritorna l'id del pannello corrente
     * @returns {Number} che rappresenta l'id del pannello corrente
     */
    getId() {
        return this.id;
    }

    /**
     * Genera il JSON della selezione delle sorgenti da monitorare con il pannello
     * @returns {Object} che rappresenta la selezione delle sorgenti da monitorare con il pannello
     */
    getJSON() {
        if (this.id !== null && this.id !== undefined) {
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
