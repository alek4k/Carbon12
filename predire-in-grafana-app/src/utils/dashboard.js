/**
 * File name: dashboard.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

export default class Dashboard {
    constructor(db) {
        if (!db) {
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

    setThresholds(thresholds, index) {
        if (this.dashboardSettings.panels[index].type === 'graph') {
            this.dashboardSettings.panels[index].thresholds = thresholds;
        } else {
            this.dashboardSettings.panels[index].thresholds = thresholds[0].value.toString()
                 + ',' + thresholds[0].value.toString();
            this.dashboardSettings.panels[index].colors = thresholds[0].op === 'gt'
                ? ['#299c46','rgba(237, 129, 40, 0.89)','#d44a3a',]
                : ['#d44a3a','rgba(237, 129, 40, 0.89)','#299c46',];
            if (this.dashboardSettings.panels[index].type === 'singlestat') {
                this.dashboardSettings.panels[index].colorBackground = true;
            }
        }
    }

    setAlert(alert, index) {
        if (this.dashboardSettings.panels[index].type === 'graph') {
            this.dashboardSettings.panels[index].alert = alert;
        }
    }

    removeThresholds(index) {
        if (this.dashboardSettings.panels[index].thresholds !== undefined) {
            delete this.dashboardSettings.panels[index].thresholds;
            if (this.dashboardSettings.panels[index].type === 'singlestat') {
                this.dashboardSettings.panels[index].colorBackground = false;
            }
        }
    }

    removeAlert(index) {
        if (this.dashboardSettings.panels[index].alert !== undefined) {
            delete this.dashboardSettings.panels[index].alert;
        }
    }

    addPanel(panel) {
        this.dashboardSettings.panels.push(panel.getJSON());
    }

    storeSettings(panelID, settings) {
        this.dashboardSettings.templating.list.push({
            hide: 2, // nascosto
            name: panelID.toString(),
            query: settings,
            type: 'textbox',
        });
    }

    getJSON() {
        return this.dashboardSettings;
    }
}
