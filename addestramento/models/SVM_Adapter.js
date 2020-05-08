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

/**
 * fromJSON
 * @param  {JSON} json
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
