/**
 * File name: influx.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */


/* eslint-disable import/no-unresolved */
import * as $ from 'jquery';
import DBConnection from './db_connection';

class Influx extends DBConnection {
    /**
     *  Ritora il risultato di una query
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
                result = data.results[0].series[0].values[0][1];
            },
            error: (test, status, exception) => {
                console.log(`Error: ${exception}`);
            },
        });
        return result;
    }

    /**
     *  Ritorna l'ultimo valore raccolto nel database per la sorgente ed il parametro specificati
     * @param {source} String rappresenta la sorgente
     * @param {param} String rappresenta il parametro
     * @returns {Number} Number che contiene l'ultimo valore memorizzato
     */
    getLastValue(source, param) {
        const query = `q=select ${param} from ${source} order by time desc limit 1`;
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
     *  Ritorna le datasources monitorate
     * @returns {Array} Array contenente i nomi delle datasources monitorate
     */
    getSources() {
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
                result = data;
            },
            error: (test, status, exception) => {
                console.log(`Error: ${exception}`);
            },
        });
        return result;
    }

    /**
     *  Ritorna i parametri disponibili per le datasources
     * @returns {Array} Array che contiene i nomi dei parametri disponibili
     */
    getParams() {
        const query = `q=show field keys on ${this.database}`;
        let result;
        $.ajax({
            async: false,
            url: `${this.host}:${this.port}/query?`,
            type: 'GET',
            contentType: 'application/octet-stream',
            data: query,
            processData: false,
            success: (data) => {
                result = data;
            },
            error: (test, status, exception) => {
                console.log(`Error: ${exception}`);
            },
        });
        return result;
    }

    /**
     *  Scrive sul database il valore passato nel relativo measurement
     *
     * @param {measurement} String che rappresenta il measurement su cui salvare il dato
     * @param {value} Number che rappresenta il valore da salvare sul database
     */
    storeValue(measurement, value) {
        const query = `${measurement} value=${value}`;
        console.info(query);
        let result;
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
        return result;
    }
}

module.exports = Influx;
