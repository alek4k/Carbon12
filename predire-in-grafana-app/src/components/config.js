export class PredireInGrafanaAppConfigCtrl {

  /** @ngInject */
  constructor($location){
    this.$location = $location;
  }

  redirect(){
    this.$location.url('plugins/predire-in-grafana-app/page/import');
  }
}

PredireInGrafanaAppConfigCtrl.templateUrl = 'components/config.html';
