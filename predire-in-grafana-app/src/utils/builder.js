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
     * Ritorna un Target costruito secondo la configurazione passata
     * @param {config} Object configurazione per la costruzione del Target
     * @returns {Target} rappresenta la selezione delle sorgenti da monitorare con il pannello
     */
    buildTarget(config) {
        const target = new Target();
        target.setId(config.id);
        return target;
    }

    /**
     * Ritorna un View costruito secondo la configurazione passata
     * @param {config} Object configurazione per la costruzione del View
     * @returns {View} rappresenta la visualizzazione grafica del pannello
     */
    buildView(config) {
        const view = new View(config.type, config.title, config.id);
        view.setDataSource(config.dataSource);
        view.setDescription(config.description);
        view.setDefaultBackground(config.model === 'SVM');
        return view;
    }
}
