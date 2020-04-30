/**
 * File name: panel.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

export default class Panel {
    constructor(target, view) {
        this.target = target;
        this.view = view;
    }

    getJSON() {
        const panel = this.view.getJSON();
        panel.targets = [];
        panel.targets.push(this.target.getJSON());
        return panel;
    }
}
