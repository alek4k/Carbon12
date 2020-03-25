/**
 * File name: r_redittore.js
 * Date: 2020-03-23
 *
 * @file classe per la lettura e scrittura del JSON con il predittore
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modificato costruttore
 */

// const {string} property stringa per verifica validità predittore
const property = 'Carbon12 Predire in Grafana';
const arrayOfKeys = ['header', 'notes', 'data_entry', 'model', 'file_version', 'configuration'];

/**
 * @param {Object} contenuto in formato json
 *
 * uso:
 * import class require(classPath)
 * const rwpredittore = require('./r_w_predittore');
 * istanziazione
 * var manage_predittore = new rwpredittore(data);
 * getter
 * var campo = manage_predittore.getCampo();
 */
class RPredittore {
    constructor(data) {
        this.sources = [];
        this.jsonContent = data !== null ? data : {};
    }

    /**
     * Controllo versione plugin, train
     * @param pluginV versione plugin
     * @param trainV versione addestramento
     * @return {boolean}
     */
    checkVersion(pluginV, trainV) {
        return this.getPluginVersion() >= pluginV && this.getTrainVersion() >= trainV;
    }

    /**
     * Controlla che il JSON inserito abbia la struttura desiderata
     * @return {boolean} verifica validità predittore in ingresso
     */
    validity() {
        return arrayOfKeys.every(
            (key) => Object.prototype.hasOwnProperty.call(this.jsonContent, key),
        ) && this.getTitle() === property;
    }

    /**
     * @return {string} title nell'header del predittore
     */
    getTitle() {
        if (this.jsonContent.header.title) {
            return this.jsonContent.header.title;
        }
        return '';
    }

    /**
     * @return {string} plug-in version nell'header del predittore
     */
    getPluginVersion() {
        if (this.jsonContent.header.plugin_version) {
            return this.jsonContent.header.plugin_version;
        }
        return '';
    }

    /**
     * @return {string} train version nell'header del predittore
     */
    getTrainVersion() {
        if (this.jsonContent.header.train_version) {
            return this.jsonContent.header.train_version;
        }
        return '';
    }

    /**
     * @return {array} this.sources Array con l'elenco delle sorgenti
     * uso:
     *   var sourcesArray = managePredittore.getDataEntry();
     *   sourcesArray.forEach((item) => {
     *     ...
     *   });
     */
    getDataEntry() {
        if (this.jsonContent.data_entry) {
            this.sources = [];
            const dataEntry = this.jsonContent.data_entry;
            for (const source in dataEntry) {
                if ({}.hasOwnProperty.call(dataEntry, source)) {
                    this.sources.push(dataEntry[source]);
                }
            }
        }
        return this.sources;
    }

    /**
     * @return {string} modello utilizzato per l'allenamento
     */
    getModel() {
        if (this.jsonContent.model) {
            return this.jsonContent.model;
        }
        return '';
    }

    /**
     * @return {string} versione file allenamento
     */
    getFileVersion() {
        if (this.jsonContent.file_version) {
            return this.jsonContent.file_version;
        }
        return '';
    }

    /**
     * @return {string} notes
     * stringa contenente node sull'allenamento
     */
    getNotes() {
        if (this.jsonContent.notes) {
            return this.jsonContent.notes;
        }
        return '';
    }

    /**
     * @return {string} configuration
     * stringa JSON con la configurazione salvata per la creazione del modello
     */
    getConfiguration() {
        if (this.jsonContent.configuration) {
            return this.jsonContent.configuration;
        }
        return '';
    }
}

module.exports = RPredittore;
