/**
 * File name: dashboard.js
 * Date: 2020-04-06
 *
 * @file Classe che rappresenta la dashboard
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificati metodi removeThresholds(Number) e removeAlert(Number)
 */

export default class Dashboard {
    /**
     * Costruisce l'oggetto che rappresenta la dashboard
     * @param {db} Object appresenta il contenuto della dashbaord passata
     */
    constructor(db) {
        if (!db) {
            // impostazioni di base di una dashboard
            this.dashboardSettings = {
                panels: [],
                refresh: '5s',
                tags: [
                    'Carbon12',
                ],
                templating: {
                    list: [],
                },
                time: {
                    from: 'now-5m',
                    to: 'now',
                },
                timepicker: {
                    refresh_intervals: [
                        '5s',
                        '10s',
                        '30s',
                        '1m',
                        '5m',
                        '15m',
                        '30m',
                        '1h',
                        '2h',
                        '1d',
                    ],
                },
                title: 'Predire in Grafana',
                uid: 'carbon12',
            };
        } else {
            this.dashboardSettings = db;
        }
    }

    /**
     * Imposta la soglia del pannello della dashboard corrispondete all'indice passato
     * @param {thresholds} Object rappresenta le impostazioni della soglia da settare
     * @param {index} Number rappresenta l'indice del pannello della dashboard al quale verrà settata la soglia
     */
    setThresholds(thresholds, index) {
        if (this.dashboardSettings.panels[index].type === 'graph') {
            this.dashboardSettings.panels[index].thresholds = thresholds;
        } else {
            this.dashboardSettings.panels[index].thresholds = thresholds[0].value.toString()
                 + ',' + thresholds[0].value.toString();
            this.dashboardSettings.panels[index].colors = thresholds[0].op === 'gt'
                ? ['#299c46','rgba(237, 129, 40, 0.89)','#d44a3a',]
                : ['#d44a3a','rgba(237, 129, 40, 0.89)','#299c46',];
            this.dashboardSettings.panels[index].colorBackground = true;
        }
    }

    /**
     * Imposta l'alert del pannello della dashboard corrispondete all'indice passato
     * @param {thresholds} Object rappresenta le impostazioni dell'alert da settare
     * @param {index} Number rappresenta l'indice del pannello della dashboard al quale verrà settato l'alert
     */
    setAlert(alert, index) {
        if (this.dashboardSettings.panels[index].type === 'graph') {
            this.dashboardSettings.panels[index].alert = alert;
        }
    }

    /**
     * Rimuove la soglia del pannello della dashboard corrispondete all'indice passato
     * @param {index} Number rappresenta l'indice del pannello della dashboard al quale verrà rimossa la soglia
     */
    removeThresholds(index) {
        if (this.dashboardSettings.panels[index].thresholds !== undefined) {
            delete this.dashboardSettings.panels[index].thresholds;
            if (this.dashboardSettings.panels[index].type === 'singlestat') {
                this.dashboardSettings.panels[index].colorBackground = false;
            }
        }
    }

    /**
     * Rimuove l'alert nel pannello della dashboard corrispondete all'indice passato
     * @param {index} Number rappresenta l'indice del pannello della dashboard al quale verrà rimosso l'alert
     */
    removeAlert(index) {
        if (this.dashboardSettings.panels[index].alert !== undefined) {
            delete this.dashboardSettings.panels[index].alert;
        }
    }

    /**
     * Aggiunge il pannello passato alla dashboard corrente
     * @param {index} Number rappresenta l'indice del pannello della dashboard al quale verrà rimosso l'alert
     */
    addPanel(panel) {
        this.dashboardSettings.panels.push(panel.getJSON());
    }

    /**
     * Salva nelle variabili globali della dashboard le impostazioni passate
     * @param {panelID} Number rappresenta l'indice del pannello al quale si riferiscono le impostazioni
     * @param {settings} Object rappresenta le impostazioni da salvare nelle variabili globali della dashboard
     */
    storeSettings(panelID, settings) {
        this.dashboardSettings.templating.list.push({
            hide: 2, // nascosto
            name: panelID.toString(),
            query: settings,
            type: 'textbox',
        });
    }

    /**
     * Ritorna il JSON del contenuto della dashboard
     * @returns {Object} rappresenta il contenuto della dashboard corrente
     */
    getJSON() {
        return this.dashboardSettings;
    }
}
