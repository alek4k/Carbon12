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
     * @param pluginV versione plugin nella configurazione in uso
     * @param trainV versione addestramento nella configurazione in uso
     * @return {boolean}
     */
    checkVersion(pluginV, trainV) {
        const cpV = this.versionToInt(pluginV);
        const ctV = this.versionToInt(trainV);
        const pV = this.versionToInt(this.getPluginVersion());
        const tV = this.versionToInt(this.getTrainVersion());
        return parseInt(pV) <= parseInt(cpV) && parseInt(tV) <= parseInt(ctV);
    }

    /**
     * Converte una stringa che rappresenta una versione in int
     * @param strVersion stringa che rappresenta la versione
     * @return {int}
     */
    versionToInt(strVersion) {
        let res = strVersion.replace('.', '');
        res = strVersion.replace('.', '');
        res = res.replace('a', '0');
        res = res.replace('b', '1');
        res = parseInt(res);
        if (Number.isNaN(res)) {
            console.log('Wrong version inside json.');
        }
        return res;
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
        return this.jsonContent.header.title;
    }

    /**
     * @return {string} plug-in version nell'header del predittore
     */
    getPluginVersion() {
        return this.jsonContent.header.plugin_version;
    }

    /**
     * @return {string} train version nell'header del predittore
     */
    getTrainVersion() {
        return this.jsonContent.header.train_version;
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
            Object.keys(dataEntry).forEach((key) => {
                this.sources.push(dataEntry[key]);
            });
        }
        return this.sources;
    }

    /**
     * @return {string} modello utilizzato per l'allenamento
     */
    getModel() {
        return this.jsonContent.model;
    }

    /**
     * @return {int} versione file allenamento
     */
    getFileVersion() {
        if (this.jsonContent.file_version) {
            return parseInt(this.jsonContent.file_version);
        }
        return 0;
    }

    /**
     * @return {string} notes
     * stringa contenente node sull'allenamento
     */
    getNotes() {
        return this.jsonContent.notes;
    }

    /**
     * @return {string} configuration
     * stringa JSON con la configurazione salvata per la creazione del modello
     */
    getConfiguration() {
        return this.jsonContent.configuration;
    }
}

module.exports.rpredittore = RPredittore;
