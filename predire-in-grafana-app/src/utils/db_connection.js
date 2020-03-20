class DBConnection {
  constructor(host, port, database) {
    if (host === undefined ||
        port === undefined ||
        database === undefined ||
        host === '' ||
        isNaN(port) ||
        host === '') {
          throw new Error('Incorrect values');
    }

    this.host = host;
    this.port = port;
    this.database = database;
  }
}

module.exports = DBConnection;