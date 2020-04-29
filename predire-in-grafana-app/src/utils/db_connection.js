/**
 * File name: db_connection.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

class DBConnection {
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
