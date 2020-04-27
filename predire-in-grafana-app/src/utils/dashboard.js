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
import Panel from "./panel";

export default class Dashboard {
    constructor(db){
      if(!db){
          this.dashboard = {
              panels: [],
              refresh: "5s",
              tags: [
                "Carbon12"
              ],
              templating: {
                list: []
              },
              time: {
                from: "now-5m",
                to: "now"
              },
              timepicker: {
                refresh_intervals: [
                  "5s",
                  "10s",
                  "30s",
                  "1m",
                  "5m",
                  "15m",
                  "30m",
                  "1h",
                  "2h",
                  "1d"
                ]
              },
              title: "Predire in Grafana",
              uid: "carbon12"
            }
        }
        else{
          this.dashboard = db;
        }
    }

    addPanel(panel){
      this.dashboard.panels.push(panel.getJSON());

    }

    storeSettings(panelID, settings){
      this.dashboard.templating.list.push({
        hide: 2, // nascosto
        name: panelID.toString(),
        query: settings,
        type: 'textbox',
    });
    }

    getJSON(){
      return this.dashboard;
    }

    setThresholds(thresholds, index) {
      this.dashboard.panels[index].thresholds = thresholds;
    }

    setAlert(alert, index) {
      this.dashboard.panels[index].alert = alert;
    }

    deleteThresholds(index) {
      delete this.dashboard.panels[index].thresholds;
    }

    deleteAlert(index) {
      delete this.dashboard.panels[index].alert;
    }
}