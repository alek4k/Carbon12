/**
 * File name: strategyModel.js
 * Date: 2020-03-21
 *
 * @file interfaccia per i modelli di machine learning: design pattern Strategy
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */


/**
 * constructor()
 * train(data, labels)
 * toJSON()
 * fromJSON(json)
 * predict()
 */

class StrategyModel {
    constructor() {
        this.strategy = null;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    getStrategy() {
        return this.strategy;
    }

    train(data, expected) {
        this.strategy.train(data, expected);
    }

    toJSON() {
        this.strategy.toJSON();
    }

    fromJSON(json) {
        this.strategy.fromJSON(json);
    }

    predict(point) {
        this.strategy.predict(point);
    }
}

module.exports = StrategyModel;
