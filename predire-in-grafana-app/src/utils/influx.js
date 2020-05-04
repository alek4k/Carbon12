/**
 * File name: influx.js
 * Date: 2020-03-20
 *
 * @file Classe che rappresenta il database Influx
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: aggiunto metodo deleteAllPredictions()
 */

import $ from 'jquery';
import DBConnection from './db_connection';

export default class Influx extends DBConnection {
    /**
     * Ritorna il risultato di una query
     * @param {query} String rappresenta la query per il database
     * @returns {Array} Array che contiene i risultati della query
     */
    query(query) {
        let result;
        $.ajax({
            async: false,
            url: `${this.host}:${this.port}/query?db=${this.database}`,
            type: 'GET',
            contentType: 'application/octet-stream',
            data: query,
            processData: false,
            success: (data) => {
                result = data.results[0].series[0].values;
            },
            error: (test, status, exception) => {
                console.log(`Error: ${exception}`);
            },
        });
        return result;
    }

    /**
     * Ritorna l'ultimo valore raccolto nel database per la sorgente, l'istanza ed il parametro specificati
     * @param {source} String rappresenta la sorgente
     * @param {instance} String rappresenta l'istanza
     * @param {param} String rappresenta il parametro
     * @returns {Number} Number che contiene l'ultimo valore memorizzato
     */
    getLastValue(source, instance, param) {
        const query = instance
            ? `q=select ${param} from ${source} where `
            + `instance='${instance}' order by time desc limit 1`
            : `q=select ${param} from ${source} order by time desc limit 1`;
        let result;
        $.ajax({
            async: false,
            url: `${this.host}:${this.port}/query?db=${this.database}`,
            type: 'GET',
            contentType: 'application/octet-stream',
            data: query,
            processData: false,
            success: (data) => {
                result = data.results[0].series[0].values[0][1];
            },
            error: (test, status, exception) => {
                console.log(`Error: ${exception}`);
            },
        });
        return result;
    }

    /**
     * Ritorna le datasources monitorate
     * @returns {Array} Array contenente i nomi delle datasources monitorate
     */
    getSources() {
        const query = `q=show field keys on ${this.database}`;
        const result = [];
        $.ajax({
            async: false,
            url: `${this.host}:${this.port}/query?`,
            type: 'GET',
            contentType: 'application/octet-stream',
            data: query,
            processData: false,
            success: (data) => {
                const sources = data.results[0].series !== undefined ? data.results[0].series : [];
                this.predictions = [];
                sources.forEach((source) => {
                    if (!source.name.startsWith('predizione')) {
                        // filtro le sorgenti 'predizioneN'
                        result.push(source);
                    } else {
                        this.predictions.push(source.name.substr(10));
                    }
                });
            },
            error: (test, status, exception) => {
                console.log(`Error: ${exception}`);
            },
        });
        return result;
    }

    /**
     * Ritorna i parametri disponibili per le datasources
     * @returns {Array} Array contenente i nomi delle datasources monitorate
     */
    getInstances() {
        const query = `q=show tag values on "${this.database}" with key = "instance"`;
        let result;
        $.ajax({
            async: false,
            url: `${this.host}:${this.port}/query?`,
            type: 'GET',
            contentType: 'application/octet-stream',
            data: query,
            processData: false,
            success: (data) => {
                result = data.results[0].series;
            },
            error: (test, status, exception) => {
                console.log(`Error: ${exception}`);
            },
        });
        return result;
    }

    /**
     * Scrive sul database il valore passato nel relativo measurement
     * @param {measurement} String rappresenta il measurement su cui salvare il dato
     * @param {value} Number rappresenta il valore da salvare sul database
     */
    storeValue(measurement, value) {
        const query = `${measurement} value=${value}`;
        $.ajax({
            async: false,
            url: `${this.host}:${this.port}/write?db=${this.database}`,
            type: 'POST',
            contentType: 'application/octet-stream',
            data: query,
            processData: false,
            success: () => {
                console.log('Value stored successfully');
            },
            error: (test, status, exception) => {
                console.log(`Error: ${exception}`);
            },
        });
    }

    /**
     * Elimina dal database la predizione il cui numero è uguale a quello passato
     * @param {prediction} Number rappresenta il numero della predizione da eliminare
     */
    deletePrediction(prediction) {
        const query = `q=drop measurement predizione${prediction}`;
        if (this.predictions.indexOf(prediction) >= 0) {
            $.ajax({
                async: false,
                url: `${this.host}:${this.port}/query?db=${this.database}`,
                type: 'GET',
                contentType: 'application/octet-stream',
                data: query,
                processData: false,
                success: () => {
                    this.predictions.splice(this.predictions.indexOf(prediction), 1);
                    console.log('Measurement was dropped.');
                },
                error: (test, status, exception) => {
                    console.log(`Error: ${exception}`);
                },
            });
        }
    }

    /**
     * Elimina dal database tutte le predizioni
     */
    deleteAllPredictions() {
        const oldPred = this.predictions;
        for (let i = 0; i < oldPred.length; i++) {
            this.deletePrediction(oldPred[i]);
        }
    }
}
