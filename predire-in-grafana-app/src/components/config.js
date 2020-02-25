export class PredireInGrafanaAppConfigCtrl {

  /** @ngInject */
  constructor($location){
    this.$location = $location;
  }

  redirect(){
    console.info("redirect to importNet");
    this.$location.url('plugins/predire-in-grafana-app/page/import-model');
  }
}

PredireInGrafanaAppConfigCtrl.templateUrl = 'components/config.html';
