/**
 * File name: view.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

export default class View {
    constructor(type, title, id, datasource) {
        this.type = type;
        this.title = title;
        this.id = id;
        this.dataSource = datasource;
        this.dashboard = {
            colors: [
                '#d44a3a',
                'rgba(237, 129, 40, 0.89)',
                '#299c46',
            ],
            gridPos: {},
            id: this.id,
            targets: [],
            valueMaps: [{
                op: '=',
                text: 'Good &#128077;',
                value: '1',
            },
            {
                op: '=',
                text: 'Bad &#128078;',
                value: '-1',
            }],
            valueName: 'current',
        };
    }

    setType(i) {
        this.type = i;
    }

    setTitle(i) {
        this.title = i;
    }

    setId(i) {
        this.id = i;
    }

    setDescription(i) {
        this.description = i;
    }

    setBackground(i) {
        this.background = i;
    }

    getType() {
        return this.type;
    }

    getTitle() {
        return this.title;
    }

    getId() {
        return this.id;
    }

    getDescription() {
        return this.description;
    }

    getBackground() {
        return this.background;
    }

    getJSON() {
        if (this.type === 'Grafico') {
            this.dashboard.gridPos.h = 8;
            this.dashboard.gridPos.w = 12;
            this.dashboard.type = 'graph';
            this.dashboard.title = this.title
                ? this.title : 'Grafico di Predizione ' + this.id;
            this.dashboard.description = this.description ? this.description : '';
            this.dashboard.datasource = this.dataSource;
        } else {
            this.dashboard.gridPos.h = 4;
            this.dashboard.gridPos.w = 4;
            this.dashboard.type = 'singlestat';
            this.dashboard.thresholds = '0, 0.5';
            this.dashboard.title = this.title
                ? this.title : 'Indicatore di Predizione ' + this.id;
            this.dashboard.description = this.description ? this.description : '';
            this.dashboard.colorBackground = this.background;
            this.dashboard.datasource = this.dataSource;
        }
        return this.dashboard;
    }
}
