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
     * @param {db} Object rappresenta il contenuto della dashboard passata
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
                ? ['#299c46', 'rgba(237, 129, 40, 0.89)', '#d44a3a']
                : ['#d44a3a', 'rgba(237, 129, 40, 0.89)', '#299c46'];
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
     * @param {panel} Panel rappresenta il pannello che dovrà essere aggiunto alla dashboard
     */
    addPanel(panel) {
        this.dashboardSettings.panels.push(panel.getJSON());
    }

    /**
     * Rimuove il pannello della dashboard relativo all'indice passato
     * @param {index} Number rappresenta l'indice del pannello della dashboard da rimuovere
     */
    removePanel(index) {
        this.dashboardSettings.panels.splice(index, 1);
        this.updateSettings();
    }

    /**
     * Salva nelle variabili globali della dashboard le impostazioni passate
     * @param {panelID} Number rappresenta l'indice del pannello al quale si riferiscono le impostazioni
     * @param {settings} Object rappresenta le impostazioni da salvare nelle variabili globali della dashboard
     */
    storeSettings(panelID, settings) {
        this.updateSettings();
        this.dashboardSettings.templating.list.push({
            hide: 2, // nascosto
            name: panelID.toString(),
            query: JSON.stringify(settings),
            type: 'textbox',
        });
    }

    /**
     * Aggiorna le variabili globali della dashboard e ritorna se sono state apportate modifiche
     * @returns {Boolean} rappresenta se sono state apportate modifiche alle variabili globali della dashboard
     */
    updateSettings() {
        const panels = this.dashboardSettings.panels;
        let variables = this.dashboardSettings.templating.list;
        const newVariables = [];
        let isBeenUpdated = false;
        // panels.length <= variables.length
        panels.forEach((panel) => {
            let found = false;
            for (let i = 0; !found && i < variables.length; ++i) {
                if (panel.id === parseInt(variables[i].name, 10)) {
                    found = true;
                    newVariables.push(variables[i]);
                    variables.splice(i, 1);
                } else {
                    isBeenUpdated = true;
                }
            }
        });
        this.dashboardSettings.templating.list = newVariables;
        return isBeenUpdated || variables.length > 1;
    }

    /**
     * Imposta lo stato della predizione del pannello relativo all'indice passato
     * @param {index} Number rappresenta l'indice del pannello della dashboard al quale impostare lo stato
     * @param {state} Number rappresenta lo stato da impostare al pannello
     */
    setPredictionStarted(index, state) {
        const settings = JSON.parse(this.dashboardSettings.templating.list[index].query);
        settings.started = state;
        this.dashboardSettings.templating.list[index].query = JSON.stringify(settings);
    }

    /**
     * Ritorna il JSON del contenuto della dashboard
     * @returns {Object} rappresenta il contenuto della dashboard corrente
     */
    getJSON() {
        return this.dashboardSettings;
    }
}
