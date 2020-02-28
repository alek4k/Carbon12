module.exports = class csv_reader {

  /**
   * @param {string} path Percorso da cui viene caricato il file
   *@param {object} options Le opzioni passate al lettore di csv. Vedi: https://csv.js.org/parse/options/
   */
  constructor(path, options) {
    const fs = require('fs');
    const parse = require('csv-parse/lib/sync');
    const assert = require('assert');

    let input;
    input = fs.readFileSync(path, 'utf8');

    console.log(input);

    if(options== null)
    {
      options={
      delimiter: ';',
      columns: true,
      skip_empty_lines: true
      }
    }

    this.records = parse(input, options);

    if(this.records.length>0){
      this.columns=Object.keys(this.records[0]);
    }
  }

  getData(columns){
    if(columns==null){
      return null;
    }
    let res=Array();
    this.records.array.forEach(row => {
      row.array.forEach(element, key => {
        if(columns.includes(key))
          res[key]=element;
      });
    });
    return res;
  }

  autoGetData()
  {
    let validColumns=Array();
    for(let i=1;i<this.columns.length-1;i++)
      validColumns[i-1]=this.columns[i];
    return this.getData(validColumns);
  }

  autoGetLabel(){
    return this.getData({0:"Labels"});
  }
};
