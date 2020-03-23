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
     *  Function which return results of a query
     * @param {query} String represents the query to database
     * @returns {Promise} Promise object represents query result
     */
    query(query) {
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
        });
        return result;
    }

    /**
     *  Function which return collected sources
     * @returns {Promise} Promise object represents available sources
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
        });
        return result;
    }

    /**
     *  Function which return available parameters
     * @returns {Promise} Promise object represents available parameters
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
        });
        return result;
    }
}

module.exports = Influx;
