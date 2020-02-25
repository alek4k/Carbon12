import defaultDashboard from '../dashboards/default.json';

export class importModelCtrl{

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
          dashboard: defaultDashboard,
          folderId: 0,
          overwrite: true,
        })
        .then(db => {
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
    else{
      this.notSelectedError = 'You must select';
      if(!this.jsonImported){
        this.notSelectedError += ' a JSON file';
        if(!atLest1Source && !this.model){
          this.notSelectedError += ',';
        }
        else if(!atLest1Source || !this.model){
          this.notSelectedError += ' and';
        }
      }
      if(!atLest1Source){
        this.notSelectedError += ' at least one source';
        if(!this.model){
          this.notSelectedError += ' and';
        }
      }
      if(!this.model){
        this.notSelectedError += ' a model';
      }
      return false;
    }
  }

}

importModelCtrl.templateUrl = 'components/importModel.html';
