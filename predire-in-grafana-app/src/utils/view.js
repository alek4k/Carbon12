/**
 * File name: view.js
 * Date: 2020-04-06
 *
 * @file Classe per la visualizzazione del pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: aggiunto metodo setDefaultBackground(Boolean)
 */

export default class View {
    /**
     * Costruisce l'oggetto che rappresenta la visualizzazione grafica del pannello
     * @param {type} String rappresenta il tipo di visualizzazione del pannello che si desidera inizializzare
     * @param {title} String rappresenta il titolo del pannello che si desidera inizializzare
     * @param {id} Number rappresenta l'id del pannello che si desidera inizializzare
     */
    constructor(type, title, id) {
        this.type = type;
        this.title = title;
        this.id = id;

        // viene inizializzata la struttura di base della visualizzazione
        this.viewSettings = {
            gridPos: {},
            id: this.id,
            targets: [],
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
     * Imposta la sorgente dati del pannello corrente
     * @param {dataSource} Number rappresenta la sorgente dati del pannello corrente
     */
    setDataSource(dataSource) {
        if (dataSource) {
            this.dataSource = dataSource;
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
     * Imposta il background di default al pannello corrente
     */
    setDefaultBackground() {
        // questo background è pensato per facilitare la visualizzazione dell'indicatore dell'SVM
        this.viewSettings.colors = [
            '#d44a3a',
            'rgba(237, 129, 40, 0.89)',
            '#299c46',
        ];
        this.viewSettings.thresholds = '0, 0';
        this.viewSettings.valueMaps = [{
            op: '=',
            text: 'Good &#128077;',
            value: '1',
        }, {
            op: '=',
            text: 'Bad &#128078;',
            value: '-1',
        }];
    }

    /**
     * Ritorna il tipo di visualizzazione del pannello corrente
     * @returns {String} rappresenta il tipo di visualizzazione del pannello corrente
     */
    getType() {
        return this.type;
    }

    /**
     * Ritorna il titolo del pannello corrente
     * @returns {String} rappresenta il titolo del pannello corrente
     */
    getTitle() {
        return this.title;
    }

    /**
     * Ritorna l'id del pannello corrente
     * @returns {Number} rappresenta l'id del pannello corrente
     */
    getId() {
        return this.id;
    }

    /**
     * Ritorna la sorgente dati del pannello corrente
     * @returns {String} rappresenta la sorgente dati del pannello corrente
     */
    getDataSource() {
        return this.dataSource;
    }

    /**
     * Ritorna la descrizione del pannello corrente
     * @returns {String} rappresenta la descrizione del pannello corrente
     */
    getDescription() {
        return this.description;
    }

    /**
     * Genera il JSON della visualizzazione del pannello
     * @returns {Object} rappresenta la parte grafica del pannello
     */
    getJSON() {
        if (this.type === 'Grafico') {
            this.viewSettings.gridPos.h = 8;
            this.viewSettings.gridPos.w = 12;
            this.viewSettings.type = 'graph';
            this.viewSettings.title = this.title
                ? this.title : 'Grafico di Predizione ' + this.id;
        } else {
            // il tipo è singlestat
            this.viewSettings.gridPos.h = 4;
            this.viewSettings.gridPos.w = 4;
            this.viewSettings.type = 'singlestat';
            this.viewSettings.title = this.title
                ? this.title : 'Indicatore di Predizione ' + this.id;
            this.viewSettings.colorBackground = this.viewSettings.thresholds !== undefined;
        }
        this.viewSettings.description = this.description ? this.description : '';
        this.viewSettings.datasource = this.dataSource;

        return this.viewSettings;
    }
}
