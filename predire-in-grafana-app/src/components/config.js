/**
 * File name: config.js
 * Date: 2020-02-25
 *
 * @file Classe che rappresenta la pagina iniziale di configurazione del plug-in
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificato metodo redirect()
 */

export default class PredireInGrafanaAppConfigCtrl {
    /** @ngInject */

    /**
     * Costruisce l'oggetto che rappresenta la pagina iniziale di configurazione del plug-in
     * @param {$location} Object permette la gestione dell'URL della pagina
     */
    constructor($location) {
        this.$location = $location;
    }

    /**
     * Reindirizza l'URL della pagina corrente alla pagina import
     */
    redirect() {
        this.$location.url('plugins/predire-in-grafana-app/page/import');
    }
}

PredireInGrafanaAppConfigCtrl.templateUrl = 'components/config.html';
