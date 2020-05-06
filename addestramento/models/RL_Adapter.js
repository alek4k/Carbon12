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
