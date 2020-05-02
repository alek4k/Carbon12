/**
 * File name: panel.js
 * Date: 2020-04-06
 *
 * @file Classe che rappresenta il pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificato metodo getJSON()
 */

export default class Panel {
    /**
     * Costruisce l'oggetto che rappresenta il pannello
     * @param {target} Target rappresenta la selezione delle sorgenti da monitorare con il pannello
     * @param {view} View rappresenta la visualizzazione grafica del pannello
     */
    constructor(target, view) {
        this.target = target;
        this.view = view;
    }

    /**
     * Genera il JSON che rappresenta il pannello
     * @returns {Object} che rappresenta la configurazione del pannello
     */
    getJSON() {
        const panel = this.view.getJSON();
        panel.targets = [];
        panel.targets.push(this.target.getJSON());
        return panel;
    }
}
