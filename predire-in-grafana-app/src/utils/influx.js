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
  query(query) {
    let result;
    $.ajax({
      async: false,
      url: `${this.host}:${this.port}/query?`,
      type: 'GET',
      contentType: 'application/octet-stream',
      data: query,
      processData: false,
      success: data => {
        result = data;
      }
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
      success: data => {
        result = data;
      }
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
      success: data => {
        result = data;
      },
      error: exception => {
        console.log("Error: " + exception);
      }
    });
    return result;
  }

}
module.exports = Influx;