/**
 * File name: RL_Adapter.js
 * Date: 2020-03-28
 *
 * @file Classe Adapter per la libreria Regression
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: creazione classe
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

const Model = require('./model').model;
const Regression = require('./rl/regression').regression;

class RlAdapter extends Model {
    constructor(options) {
        super();
        this.regression = new Regression(options);
    }

    fromJSON(json) {
        this.regression.fromJSON(json);
    }

    train(data, expected) {
        this.regression.train(data, expected);
        console.log('train');
        return this.regression.toJSON();
    }
}

module.exports.rladapter = RlAdapter;
