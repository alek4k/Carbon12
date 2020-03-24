/**
 * File name: factoryModel.js
 * Date: 2020-03-21
 *
 * @file interfaccia di creazione dei modelli di machine learning: design pattern Abstract Factory
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */
import StrategyModel from './strategyModel';
import SVM from './svm/svm';
import Regression from './rl/regression';

class FactoryModel {
    constructor() {
        this.strategyModel = null;
    }

    getInstance(type) {
        switch (type) {
        case SVM:
            return new SVM();
        case RL:
            return new Regression();
        default:
            return new StrategyModel();
        }
    }
}

module.exports = FactoryModel;
