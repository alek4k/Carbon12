/**
 * File name: builder.js
 * Date: 2020-03-20
 *
 * @file Classe che costruisce il target e la view del pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificato metodo buildView(Object)
 */

import Target from './target';
import View from './view';

export default class Builder {
    /**
     * Costruisce l'oggetto che rappresenta un builder
     * @param {config} Object Rappresenta la configurazione da usare per la costruzione degli oggetti
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Ritorna un Target costruito secondo la configurazione passata
     * @param {config} Object configurazione per la costruzione del Target
     * @returns {Target} rappresenta la selezione delle sorgenti da monitorare con il pannello
     */
    buildTarget() {
        const target = new Target(this.config.id);
        return target;
    }

    /**
     * Ritorna un View costruito secondo la configurazione passata
     * @param {config} Object configurazione per la costruzione del View
     * @returns {View} rappresenta la visualizzazione grafica del pannello
     */
    buildView() {
        const view = new View(this.config.type, this.config.title, this.config.id);
        view.setDataSource(this.config.dataSource);
        view.setDescription(this.config.description);
        if (this.config.model === 'SVM') {
            view.setDefaultBackground();
        }
        return view;
    }
}
