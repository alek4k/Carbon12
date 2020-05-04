/**
 * File name: grafana_query.js
 * Date: 2020-03-19
 *
 * @file Classe che gestisce la comunicazione con il backend di Grafana
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

export default class GrafanaApiQuery {
    /**
     * Costruisce l'oggetto che comunicherà con il backend di Grafana
     * @param {backendSrv} Object rappresenta il backend di Grafana
     */
    constructor(backendSrv) {
        this.backendSrv = backendSrv;
    }

    /**
     * Ritorna una Promise che rappresenterà le sorgenti dati disponibili in Grafana
     * @returns {Promise} rappresenterà le sorgenti dati disponibili in Grafana
     */
    getDataSources() {
        return this.backendSrv.get('api/datasources');
    }

    /**
     * Aggiunge una sorgente dati a Grafana e ne ritorna l'esito con una Promise
     * @param {name} String rappresenta il nome della nuova sorgente dati
     * @param {database} String rappresenta il nome del database associato alla sorgente dati
     * @param {host} String rappresenta l'host del database
     * @param {port} String rappresenta la porta del database
     * @returns {Promise} rappresenterà la sorgente dati aggiunta in Grafana
     */
    postDataSource(name, database, host, port) {
        return this.backendSrv.post('api/datasources', {
            name,
            type: 'influxdb',
            access: 'proxy',
            database,
            url: host + ':' + port,
            readOnly: false,
            editable: true,
        });
    }

    /**
     * Ritorna una Promise che rappresenterà la cartella richiesta ove presente in Grafana
     * @param {folderId} String rappresenta l'id della cartella da ottenere
     * @returns {Promise} rappresenterà la cartella richiesta
     */
    getFolder(folderId) {
        return this.backendSrv.get('api/search?folderIds=' + folderId);
    }

    /**
     * Ritorna una Promise che rappresenterà la dashboard richiesta ove presente in Grafana
     * @param {name} String rappresenta il nome della dashboard da ottenere
     * @returns {Promise} rappresenterà la dashboard richiesta
     */
    getDashboard(name) {
        return this.backendSrv.get('api/dashboards/db/' + name);
    }

    /**
     * Aggiunge una dashboard a Grafana e ne ritorna l'esito con una Promise
     * @param {dashboard} Object rappresenta il contenuto della dashboard da salvare
     * @returns {Promise} rappresenterà la dashboard aggiunta in Grafana
     */
    postDashboard(dashboard) {
        return this.backendSrv.post('api/dashboards/db', {
            dashboard,
            folderId: 0,
            overwrite: true,
        });
    }

    /**
     * Ritorna una Promise che rappresenterà tutti gli alert presenti in Grafana
     * @returns {Promise} rappresenterà gli alert presenti in Grafana
     */
    getAlerts() {
        return this.backendSrv.get('api/alert-notifications');
    }

    /**
     * Aggiunge un alert a Grafana e ne ritorna l'esito con una Promise
     * @param {teamsUrl} String rappresenta l'URL del WebHook di Microsoft Teams da settare nell'alert
     * @returns {Promise} rappresenterà l'alert aggiunto in Grafana
     */
    postAlert(teamsUrl) {
        return this.backendSrv.post('api/alert-notifications', {
            uid: 'predire-in-grafana-alert',
            name: 'Predire in Grafana Alert',
            type: 'teams',
            settings: {
                url: teamsUrl,
            },
        });
    }

    /**
     * Modifica un alert in Grafana e ne ritorna l'esito con una Promise
     * @param {teamsUrl} String rappresenta l'URL del WebHook di Microsoft Teams da settare nell'alert
     * @returns {Promise} rappresenterà l'alert aggiornato
     */
    updateAlert(teamsUrl) {
        return this.backendSrv.put('api/alert-notifications/uid/predire-in-grafana-alert', {
            uid: 'predire-in-grafana-alert',
            name: 'Predire in Grafana Alert',
            type: 'teams',
            settings: {
                url: teamsUrl,
            },
        });
    }
}
