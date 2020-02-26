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
