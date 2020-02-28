// importo la dashboard già configurata con il pannello 'Carbon12 Graph Prediction'
import defaultDashboard from '../dashboards/default.json';

export class importCtrl{

  /** @ngInject */
  constructor($location, backendSrv){
    this.$location = $location;
    this.backendSrv = backendSrv;
    this.jsonImported = false;
    this.jsonError = '';
    this.notSelectedError = '';

    // creo la connessione con il database
    
    const Influx = require('../utils/connection.js');
    let influx = new Influx();
    

    // prelevo le risorse monitorate da influx
    
    influx.getSources().then(function(result) {

      // result è un oggetto che contiene le sorgenti e altre informazioni utili. 
      // Con l'istruzione: 
      //    result.results[0].series
      // ottieni un array di oggetti che rappresentano le sorgenti e i dettagli.
      //
      // ad esempio con l'istruzione:
      //    result.results[0].series[0].name
      // ottieni il nome della prima sorgente monitorata
      // se ad esempio vuoi ottenere il numero di CPU puoi usare
      //    result.results[0].series[0].values.length - 1
      //
      // gli stessi campi sono disponibili per tutte le risorse, ti basta variare l'indice dell'array series 
      // per accedere alle altre sorgenti
      // !! Non variare mai l'indice di results, esiste solo l'indice 0.
      // 
      // per la lista delle sorgenti ti conviene fare
      //    console.log(result.results[0].series);
      // cosi dalla console puoi vederti la lista delle varie sorgenti ed altre cagate
      
      console.log(result.results[0].series);
    });
  

  }

  uploadFile(json){
    this.jsonImported = true;
    this.jsonError = '';
  }

  loadText(){
    try{
      // prima di caricare il testo del JSON controllo la sua sintassi con parse()
      this.uploadFile(JSON.parse(this.jsonText));
    }
    catch(err){
      this.jsonError = err.message;
    }
  }

  createPanel(){
    if(this.checkForm()){
      return this.backendSrv
        .post('api/dashboards/import', {
          // creo e salvo la dashboard contenente il pannello 'Carbon12 Graph Prediction'
          dashboard: defaultDashboard,
          folderId: 0,
          overwrite: true,
        })
        .then(db => {
          // reindirizzo alla pagina della dashboard appena creata
          this.$location.url(db.importedUrl);
        })
    }
  }

  checkForm(){
    let atLest1Source = this.cpu || this.ram || this.diskio;
    if(this.jsonImported && atLest1Source && this.model){
      this.notSelectedError = '';
      return true;
    }
    // generazione della stringa d'errore
    else{
      this.notSelectedError = 'È necessario selezionare';
      if(!this.jsonImported){
        this.notSelectedError += ' un file JSON';
        if(!atLest1Source && !this.model){
          this.notSelectedError += ',';
        }
        else if(!atLest1Source || !this.model){
          this.notSelectedError += ' e';
        }
      }
      if(!atLest1Source){
        this.notSelectedError += ' almeno una sorgente';
        if(!this.model){
          this.notSelectedError += ' e';
        }
      }
      if(!this.model){
        this.notSelectedError += ' un modello';
      }
      return false;
    }
  }

}

importCtrl.templateUrl = 'components/import.html';
