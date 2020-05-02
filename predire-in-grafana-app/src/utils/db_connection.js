/**
 * File name: db_connection.js
 * Date: 2020-03-20
 *
 * @file Classe che rappresenta la connessione al database
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: aggiunto campo dato per il tracciamento delle predizioni salvate
 */
class DBConnection {
    /**
     * Costruisce l'oggetto che rappresenta il database
     * @param {host} String rappresenta l'host del database
     * @param {port} Number appresenta la porta del database
     * @param {database} String rappresenta il nome del database
     */
    constructor(host, port, database) {
        if (typeof host !== 'string'
        || typeof port !== 'number'
        || typeof database !== 'string') {
            throw new Error('Incorrect values');
        }

        this.host = host;
        this.port = port;
        this.database = database;
        this.predictions = [];
    }
}

module.exports = DBConnection;
