/**
 * File name: builder.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */
import Target from './target';
import View from './view';

export default class Builder {
    buildTarget(config) {
        const target = new Target();
        target.setId(config.id);
        return target;
    }

    buildView(config) {
        const view = new View(config.type, config.title, config.id);
        view.setDataSource(config.dataSource);
        view.setDescription(config.description);
        view.setDefaultBackground(config.model === 'SVM');
        return view;
    }
}
