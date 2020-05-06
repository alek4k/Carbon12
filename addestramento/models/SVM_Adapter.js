/**
 * File name: SVM_Adapter.js
 * Date: 2020-03-28
 *
 * @file Classe Adapter per la libreria SVM
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: creazione classe
 */

const Model = require('./model').model;
const SVM = require('./svm/svm').svm;

class SvmAdapter extends Model {
    constructor() {
        super();
        this.svm = new SVM();
    }

    fromJSON(json) {
        this.svm.fromJSON(json);
    }

    train(data, expected) {
        const options = {
            kernel: 'linear',
            karpathy: true,
        };
        this.svm.train(data, expected, options);
        return this.svm.toJSON();
    }
}

module.exports.svmadapter = SvmAdapter;
