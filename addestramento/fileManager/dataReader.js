/**
 * File name: dataReader.js
 * Date: 2020-04-24
 *
 * @file Interfaccia per la gestione dei file di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: creazione interfaccia
 */

/**
 * autoGetColumns
 * @returns {Array} Ritorna un array contenente tutte le intestazioni delle colonne del CSV.
*/

/**
 * setLabelsColumn
 * @param int columnValue indice della colonna con le labels
 * imposta il valore della colonna che contiene le labels
*/

/**
 * autoGetData
 * @returns {Array} Ritorna una matrice contenente i dati.
 * ritorna la matrice contenente i dati di addestramento.
 * */

/**
 * autoGetLabel
 * @returns {Array} Ritorna un vettore contenente le Labels
 * Ritorna un vettore contenente le Label
*/

/**
 * getDataSource
 * @returns {Array} Ritorna un vettore contenente i nomi delle sorgenti di dati.
*/

class DataReader {
    constructor() {
        if (!this.autoGetColumns) {
            throw new Error('autoGetColumns method must be implemented');
        }
        if (!this.setLabelsColumn) {
            throw new Error('setLabelsColumn method must be implemented');
        }
        if (!this.autoGetData) {
            throw new Error('autoGetData method must be implemented');
        }
        if (!this.autoGetLabel) {
            throw new Error('autoGetLabel method must be implemented');
        }

        if (!this.getDataSource) {
            throw new Error('getDataSource method must be implemented');
        }
    }
}

module.exports.datareader = DataReader;
