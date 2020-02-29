/**
 * classe per la lettura e scrittura del JSON con il predittore
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
const fs = require("fs");
//const {string} property stringa per verifica validità predittore
const property = "Carbon12 Predire in Grafana";

class R_W_Predittore {
    constructor(path) {
        this.path = path;
        this.sources = [];
        this.contents = null;
        if (path != null) this.contents = fs.readFileSync(this.path);
        this.jsonContent = null;
        if (this.contents != null)
            this.jsonContent = JSON.parse(this.contents);
        else
            this.jsonContent = {};
    }

    /**
     * @return {bool} verifica validità predittore in ingresso
     */
    validity() {
        if (this.jsonContent.header.title == property)
            return true;
        else
            return false;
    }

    /**
     * @return {string} title nell'header del predittore
     */
    getTitle() {
        if (this.jsonContent.header.title)
            return this.jsonContent.header.title;
        else
            return '';
    }

    /**
     * Impostazione header predittore
     * @param plugin_version
     * @param train_version
     * @param title Titolo da inserire nell'header [opzionale]
     */
    setHeader(plugin_version, train_version, title) {
        if (title == null) title = property;
        this.jsonContent.header = {};
        this.jsonContent.header.title = title;
        this.jsonContent.header.plugin_version = plugin_version;
        this.jsonContent.header.train_version = train_version;
    }

    /**
     * @return {string} plug-in version nell'header del predittore
     */
    getPluginVersion() {
        if (this.jsonContent.header.plugin_version)
            return this.jsonContent.header.plugin_version;
        else
            return '';
    }

    /**
     * @return {string} train version nell'header del predittore
     */
    getTrainVersion() {
        if (this.jsonContent.header.train_version)
            return this.jsonContent.header.train_version;
        else
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
      if(this.jsonContent.data_entry){
        var dataEntry = this.jsonContent.data_entry;
        for (var source in dataEntry) {
            this.sources.push(dataEntry[source]);
        }
      }
      return this.sources;
    }

    /**
     * @param {array} sources array con l'elenco delle sorgenti
     * @param {int} n numero sorgenti
     */
    setDataEntry(array, n) {
      this.jsonContent.data_entry = {};
      let index = 0;
      for(index = 0; index < n; index++){
        let source = "source"+index;
        this.jsonContent.data_entry[source] = array[index]; 
      }
    }

    /**
     * @return {string} modello utilizzato per l'allenamento
     */
    getModel() {
        if (this.jsonContent.model)
            return this.jsonContent.model;
        else
            return '';
    }

    /**
     *
     * @param model Modello utilizzato per l'addestramento
     */
    setModel(model) {
        this.jsonContent.model = model;
    }

    /**
     * @return {string} versione file allenamento
     */
    getFileVersion() {
        if (this.jsonContent.file_version)
            return this.jsonContent.file_version;
        else
            return '';
    }

    /**
     *
     * @param version
     */
    setFileVersion(version) {
        this.jsonContent.file_version = version;
    }

    /**
     * @return {string} configuration
     * stringa JSON con la configurazione salvata per la creazione del modello
     */
    getConfiguration() {
        if (this.jsonContent.configuration)
            return JSON.stringify(this.jsonContent.configuration);
        else
            return '';
    }

    /**
     *
     * @param config
     */
    setConfiguration(config) {
        this.jsonContent.configuration = config;
    }

    /**
     *
     * @returns {string} JSON da inserire nel file del predittore
     */
    save() {
        return JSON.stringify(this.jsonContent, null, 4);
    }
}

module.exports = R_W_Predittore;
