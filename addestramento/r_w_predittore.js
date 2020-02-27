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
class R_W_Predittore{
  constructor(path){
    this.path = path;
    this.sources = [];
    this.contents = fs.readFileSync(this.path);
    this.jsonContent = JSON.parse(this.contents);
  }

  /**
  * @return {string} title nell'header del predittore
  */
  getTitle(){
    return this.jsonContent.header.title;
  }

  /**
  * @return {string} plug-in version nell'header del predittore
  */
  getPluginVersion(){
    return this.jsonContent.header.plugin_version;
  }

  /**
  * @return {string} train version nell'header del predittore
  */
  getTrainVersion(){
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
  getDataEntry(){
    var dataEntry = this.jsonContent.data_entry;
    for(var source in dataEntry) {
      this.sources.push(dataEntry[source]);
    }
    return this.sources;
  }

  /**
  * @return {string} modello utilizzato per l'allenamento
  */
  getModel(){
    return this.jsonContent.model;
  }

  /**
  * @return {string} versione file allenamento
  */
  getFileVersion(){
    return this.jsonContent.file_version;
  }

  /**
  * @return {string} configuration
  * stringa JSON con la configurazione salvata per la creazione del modello
  */
  getConfiguration(){
    return JSON.stringify(this.jsonContent.configuration);
  }

}

module.exports = R_W_Predittore;
