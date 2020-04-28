/**
 * File name: view.js
 * Date: 2020-04-26
 *
 * @file Classe che descrive la visualizzazione grafica del pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: Inizializzata la struttura della classe View
 */

export default class View {
    /**
     * Costruisce l'oggetto che rappresenta la visualizzazione grafica del pannello
     * @param {type} String rappresenta il tipo di visualizzazione del pannello che si desidera inizializzare
     * @param {title} String rappresenta il titolo del pannello che si desidera inizializzare
     * @param {id} Number rappresenta l'id del pannello che si desidera inizializzare
     * @param {datasource} String indica la sorgente rappresentata dal pannello che si desidera inizializzare
     */
    constructor(type, title, id, datasource) {
        this.type = type;
        this.title = title;
        this.id = id;
        this.dataSource = datasource;

        // viene inizializzata la struttura di base della visualizzazione
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

    /**
     * Imposta il tipo di visualizzazione del pannello corrente
     * @param {type} String rappresenta il tipo di visualizzazione del pannello corrente
     */
    setType(type) {
        if (type) {
            this.type = type;
        }
    }

    /**
     * Imposta il titolo del pannello corrente
     * @param {title} String rappresenta il titolo del pannello corrente
     */
    setTitle(title) {
        if (title) {
            this.title = title;
        }
    }

    /**
     * Imposta l'id del pannello corrente
     * @param {id} Number rappresenta l'id del pannello corrente
     */
    setId(id) {
        if (id) {
            this.id = id;
        }
    }

    /**
     * Imposta la descrizione del pannello corrente
     * @param {description} String rappresenta la descrizione del pannello corrente
     */
    setDescription(description) {
        if (description) {
            this.description = description;
        }
    }

    /**
     * Imposta il colore di background del pannello corrente
     * @param {background} String rappresenta il colore di background del pannello corrente
     */
    setBackground(background) {
        if (background) {
            this.background = background;
        }
    }

    /**
     * Ritorna il tipo di visualizzazione del pannello corrente
     * @returns {String} che rappresenta il tipo di visualizzazione del pannello corrente
     */
    getType() {
        return this.type;
    }

    /**
     * Ritorna il titolo del pannello corrente
     * @returns {String} che rappresenta il titolo del pannello corrente
     */
    getTitle() {
        return this.title;
    }

    /**
     * Ritorna l'id del pannello corrente
     * @returns {String} che rappresenta l'id del pannello corrente
     */
    getId() {
        return this.id;
    }

    /**
     * Ritorna la descrizione del pannello corrente
     * @returns {String} che rappresenta la descrizione del pannello corrente
     */
    getDescription() {
        return this.description;
    }

    /**
     * Ritorna il colore di background del pannello corrente
     * @returns {String} che rappresenta il colore di background del pannello corrente
     */
    getBackground() {
        return this.background;
    }

    /**
     * Genera il JSON della visualizzazione del pannello
     * @returns {Object} che rappresenta la parte grafica del pannello
     */
    getJSON() {
        if (this.type === 'Grafico') {
            this.dashboard.gridPos.h = 8;
            this.dashboard.gridPos.w = 12;
            this.dashboard.type = 'graph';
            this.dashboard.title = this.title ?
                this.title : 'Grafico di Predizione ' + this.id;
            this.dashboard.description = this.description ? this.description : '';
            this.dashboard.datasource = this.dataSource;
        } else {
            this.dashboard.gridPos.h = 4;
            this.dashboard.gridPos.w = 4;
            this.dashboard.type = 'singlestat';
            this.dashboard.thresholds = '0, 0.5';
            this.dashboard.title = this.title ?
                this.title : 'Indicatore di Predizione ' + this.id;
            this.dashboard.description = this.description ? this.description : '';
            this.dashboard.colorBackground = this.background;
            this.dashboard.datasource = this.dataSource;
        }

        return this.dashboard;
    }
}
