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

import Model from './model';
import Regression from './rl/regression';

export default class RlAdapter extends Model {
    constructor(options) {
        super();
        this.regression = new Regression(options);
    }

    /**
    * Estrae le informazioni di configurazione dal JSON passato
    * @param {json} Object rappresenta il contenuto del JSON
    */
    fromJSON(json) {
        this.regression.fromJSON(json);
    }

    /**
    * Addestra la regressione lineare
    * @param {data} Array rappresenta i punti nel grafico
    * @param {expected} Array rappresenta i valori attesi per la y
    */
    train(data, expected) {
        this.regression.train(data, expected);
        console.log('train');
        return this.regression.toJSON();
    }

    /**
    * Predice il punto passato
    * @param {point} Array rappresenta i valori delle sorgenti monitorate
    * @return {Number} rappresenta la predizione associata al punto passato
    */
    predict(point) {
        return this.regression.predict(point);
    }
}
