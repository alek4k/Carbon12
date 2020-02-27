module.exports = class csv_reader {

  /**
   * @param {string} path Percorso da cui viene caricato il file
   */
  constructor(path) {
    const fs = require('fs');
    const parse = require('csv-parse/lib/sync');
    const assert = require('assert');

    let input;
    input = fs.readFileSync(path, 'utf8');

    console.log(input);

    this.records = parse(input, {
      columns: true,
      skip_empty_lines: true
    });
  }
};
