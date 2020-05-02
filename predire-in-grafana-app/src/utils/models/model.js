/**
 * File name: model.js
 * Date: 2020-03-28
 *
 * @file Interfaccia per la gestione dei modelli
 * Authors:
 *      @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: creazione interfaccia
 */

/**
 * fromJSON
 * @param  {JSON} config
 * stringa JSON con la configurazione salvata per la creazione del modello
 */

/**
 * train
 * @param {Array} data
 * array N*D con i dati di addestramento: N #tuple, D #sorgenti
 * @param {Array} expected
 * array[N] con i valori attesi o classificazione dei dati per l'addestramento
 * @return {JSON} config
 * stringa JSON con la configurazione salvata del modello da usare per predire
 */
class Model {
    constructor() {
        if (!this.fromJSON) {
            throw new Error('fromJSON method must be implemented');
        }
        if (!this.train) {
            throw new Error('train method must be implemented');
        }
    }
}

module.exports = Model;
