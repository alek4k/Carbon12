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
        const pannello = this.view.getJSON();
        pannello.targets = [];
        pannello.targets.push(this.target.getJSON());
        console.log(pannello);
        return pannello;
    }
}
