import * as $ from 'jquery';
import DBConnection from './db_connection.js';

class Influx extends DBConnection {
  constructor(host, port, database) {
    super(host, port, database);
  }
  
  /**
   *  Function which return results of a query
   * @param {query} String represents the query to database
   * @returns {Promise} Promise object represents query result
   */
  async query(query) {
    return $.ajax({
      url: `${this.host}:${this.port}/query?`,
      type: 'GET',
      contentType: 'application/octet-stream',
      data: query,
      processData: false,
      success: data => {
        return data;
      }
    });
  }

  /**
   *  Function which return collected sources
   * @returns {Promise} Promise object represents available sources
   */
  async getSources() {
    const query = `q=show tag values on "${this.database}" with key = "instance"`;
    return $.ajax({
      url: `${this.host}:${this.port}/query?`,
      type: 'GET',
      contentType: 'application/octet-stream',
      data: query,
      processData: false,
      success: data => {
        return data;
      }
    });
  }

  /**
   *  Function which return available parameters
   * @returns {Promise} Promise object represents available parameters
   */
  async getParams() {
    const query = `q=show field keys on ${this.database}`;
    return $.ajax({
      url: `${this.host}:${this.port}/query?`,
      type: 'GET',
      contentType: 'application/octet-stream',
      data: query,
      processData: false,
      success: data => {
        return data;
      },
      error: exception => {
        console.log("Error: " + exception);
      }
    });
  }

}
module.exports = Influx;