/**
 * File name: server_proxy.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import DBConnection from './db_connection';
import Influx from './influx';

export default class ServerProxy extends DBConnection {
    constructor(host, port, database) {
        super(host, port, database);
        this.connection = null;
    }

    /**
     *  Function which creates database connection if doesn't exist
     */
    createConnection() {
        if (this.connection === null) {
            this.connection = new Influx(this.host, this.port, this.database);
        }
    }

    /**
     *  Function which return collected sources
     * @returns {Promise} Promise object represents available sources
     */
    async getSources() {
        this.createConnection();
        if (this.connection !== null) {
            return this.connection.getSources();
        }

        throw new Error('Connection error');
    }

    /**
     *  Function which return available parameters
     * @returns {Promise} Promise object represents available parameters
     */
    async getParams() {
        this.createConnection();
        if (this.connection !== null) {
            return this.connection.getParams();
        }

        throw new Error('Connection error');
    }
}
