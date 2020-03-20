import DBConnection from './db_connection.js';
import Influx from './influx.js';

class ServerProxy extends DBConnection {
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
    } else {
      throw new Error('Connection error');
    }
  }

  /**
  *  Function which return available parameters
  * @returns {Promise} Promise object represents available parameters
  */
  async getParams() {
    this.createConnection();
    if (this.connection !== null) {
      return this.connection.getParams();
    } else {
      throw new Error('Connection error');
    }
  }
}

module.exports = ServerProxy;