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

    if(options== null)
    {
      options={
      delimiter: ';',
      bom: true,
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
    let i=0;
    this.records.forEach(row => {
      let validCol=Array();
      let c=0;
      for(let key in row)
      {
        if(columns.includes(key))
          validCol[c++]=row[key];
      }
      res[i++]=validCol;
    });
    return res;
  }

  autoGetData()
  {
    let dataColumns=Array();
    this.columns.forEach(element => {
      console.log(element);
      if(!(element ==="" || element==="Labels" || element==="Series"))
      {
        dataColumns.push(element);
      }
    });
    let res=this.getData(dataColumns);
    for(let i=0;i<res.length;i++)
    {
      res[i][0]=Date.parse(res[i][0]);
      for(let j=1;j<res[i].length;j++)
      {
        if(res[i][j]==="null")
          res[i][j]=0;
        else
          res[i][j]=parseFloat(res[i][j]);
      }
    }
    return res;
  }

  autoGetLabel(){
    let labCol=Array();
    labCol[0]="Labels";
    let res = this.getData(labCol);
    for(let i=0;i<res.length;i++)
    {
      res[i]=parseInt(res[i]);
    }
    return res;
  }
};
