/**
 * File name: config.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

export default class PredireInGrafanaAppConfigCtrl {
    /** @ngInject */
    constructor($location) {
        this.$location = $location;
    }

    redirect() {
        this.$location.url('plugins/predire-in-grafana-app/page/import');
    }
}

PredireInGrafanaAppConfigCtrl.templateUrl = 'components/config.html';
