/**
 * File name: SVM_Adapter.js
 * Date: 2020-03-28
 *
 * @file Classe Adapter per la libreria SVM
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: creazione classe
 */

import Model from './model';
import SVM from './svm/svm';

export default class SvmAdapter extends Model {
    constructor() {
        super();
        this.svm = new SVM();
    }

    /**
    * Estrae le informazioni di configurazione dal JSON passato
    * @param {json} Object rappresenta il contenuto del JSON
    */
    fromJSON(json) {
        this.svm.fromJSON(json);
    }

    /**
    * Addestra la regressione lineare
    * @param {data} Array rappresenta i punti nel grafico
    * @param {expected} Array rappresenta i valori attesi per la y
    */
    train(data, expected) {
        const options = {
            kernel: 'linear',
            karpathy: true,
        };
        this.svm.train(data, expected, options);
        return this.svm.toJSON();
    }

    /**
    * Predice il punto passato
    * @param {point} Array rappresenta i valori delle sorgenti monitorate 
    * @return {Number} rappresenta la predizione associata al punto passato
    */
    predictClass(point) {
        return this.svm.predictClass(point);
    }
}
