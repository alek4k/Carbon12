/**
 * File name: r_predittore.js
 * Date: 2020-03-18
 *
 * @file classe per la lettura e scrittura del JSON con il predittore
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

// const {string} property stringa per verifica validità predittore
const property = 'Carbon12 Predire in Grafana';

/**
 * @param {string} path percorso dove viene salvato il file
 *
 * uso:
 * import class require(classPath)
 * const rwpredittore = require('./r_w_predittore');
 * istanziazione
 * var manage_predittore = new rwpredittore(pathPredittore);
 * getter
 * var campo = manage_predittore.getCampo();
 */
class WPredittore {
    constructor() {
        this.jsonContent = {};
    }

    /**
     * Impostazione header predittore
     * @param pluginVersion
     * @param trainVersion
     * @param title Titolo da inserire nell'header [opzionale]
     */
    setHeader(pluginVersion, trainVersion, title) {
        const jsonTitle = title == null ? property : title;
        this.jsonContent.header = {};
        this.jsonContent.header.title = jsonTitle;
        this.jsonContent.header.plugin_version = pluginVersion;
        this.jsonContent.header.train_version = trainVersion;
    }

    /**
     * @param {array} array sources array con l'elenco delle sorgenti
     * @param {int} n numero sorgenti
     */
    setDataEntry(array, n) {
        this.jsonContent.data_entry = {};
        let index = 0;
        for (index = 0; index < n; index++) {
            const source = 'source' + index;
            this.jsonContent.data_entry[source] = array[index];
        }
    }

    /**
     * @param model Modello utilizzato per l'addestramento
     */
    setModel(model) {
        this.jsonContent.model = model;
    }

    /**
     * @param version
     */
    setFileVersion(version) {
        this.jsonContent.file_version = version;
    }

    /**
     * @param notes
     */
    setNotes(notes) {
        this.jsonContent.notes = notes;
    }

    /**
     * @param config
     */
    setConfiguration(config) {
        this.jsonContent.configuration = config;
    }

    /**
     * @returns {string} JSON da inserire nel file del predittore
     */
    save() {
        return JSON.stringify(this.jsonContent, null, 4);
    }
}

module.exports.wpredittore = WPredittore;
