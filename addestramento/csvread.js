class CSVread{
  constructor(path){

  }
}
//output data e labels

//funzione trasformazione csv in Array
//Funzione per la conversione del CSV in Array
function csv2array(data, delimeter) {
  // Recupera il delimitatore
  if (delimeter == undefined)
    delimeter = ';';
  if (delimeter && delimeter.length > 1)
    delimeter = ';';

  // inizializzazione variabili
  var newline = '\n';
  var eof = '';
  var i = 0;
  var c = data.charAt(i);
  var row = 0;
  var col = 0;
  var array = new Array();

  while (c != eof) {
    // salta spazi
    while (c == ' ' || c == '\t' || c == '\r') {
      c = data.charAt(++i); // leggi prossimo carattere
    }

    // ottieni valore
    var value = "";
    if (c == '\"') {
      // valore racchiuso tra virgolette doppie
      c = data.charAt(++i);

      do {
        if (c != '\"') {
          // leggi un carattere e vai a quello successivo
          value += c;
          c = data.charAt(++i);
        }

        if (c == '\"') {
          // verifica che non sia sfuggita una doppia virgoletta
          var cnext = data.charAt(i+1);
          if (cnext == '\"') {
            // questa è una doppia virgoletta scappata
            // Aggiungi una doppia virgoletta al valore e sposta in avanti
            value += '\"';
            i += 2;
            c = data.charAt(i);
          }
        }
      }
      while (c != eof && c != '\"');

      if (c == eof) {
        throw "Unexpected end of data, double-quote expected";
      }

      c = data.charAt(++i);
    }
    else {
      // valore senza virgolette
      while (c != eof && c != delimeter && c!= newline && c != ' ' && c != '\t' && c != '\r') {
        value += c;
        c = data.charAt(++i);
      }
    }

    // aggiungi il valore alla matrice
    if (array.length <= row)
      array.push(new Array());
    array[row].push(value);

    // salta gli spazi
    while (c == ' ' || c == '\t' || c == '\r') {
      c = data.charAt(++i);
    }

    // vai alla riga o colonna successiva
    if (c == delimeter) {
      // vai alla colonna successiva
      col++;
    }
    else if (c == newline) {
      // vai alla prossima riga
      col = 0;
      row++;
    }
    else if (c != eof) {
      // carattere non accettato
      throw "Delimiter expected after character " + i;
    }

    // vai al prossimo carattere
    c = data.charAt(++i);
  }

  return array;
}

//funzione costruzione array dataEntry
//estrapolazione indici dataEntry
function indiciDataEntry(datat){
  var indiciInizio=[];
  var k=0;
  for(let a=1; a<datat.length-1; a++){
    if(indiciInizio.length==0){
      indiciInizio[k]=a;
    }else{
      var val1=datat[a][0];
      a=a+1;
      var val2=datat[a][0];
      if(val1!=val2){
        k=k+1;
        indiciInizio[k]=a;
      }
      a=a-1;
    }
  }
  return indiciInizio;
};

//funzione costruzione array dataExit
//estrapolazione indici dataExit
function indiciDataExit(datat){
  var indiciFine=[];
  var k=0;
  for(let a=1; a<datat.length-1; a++){
    if(a+2==datat.length){
      k=k+1;
      indiciFine[k]=a+1;
    }else{
      var val1=datat[a][0];
      a=a+1;
      var val2=datat[a][0];
      if(val1!=val2){
        if(!k){
          indiciFine[k]=a;
        }else{
          k=k+1;
          indiciFine[k]=a;
        }
      }
      a=a-1;
    }
  }
  return indiciFine;
};

//funzione lettura tempo
//trasformazione dato Tempo datatable=> secondi
function tempoASec(tempo){
  var sec;
  var h=parseInt(tempo[11]+tempo[12]);
  var m=parseInt(tempo[14]+tempo[15]);
  var s=parseInt(tempo[17]+tempo[18]);

  sec=h*3600+m*60+s;
  return sec;
};

//funzione lettura numero
//trasformazione dato Numerico datatable=> numero
function num(strnum){
  var num=0;
  if(strnum=='null'){
    return num;
  }else{
    var strPRE="";
    var strPOST="";
    var pos=0;
    for(let l=0; l<strnum.length && strnum[l]!="."; l++){
      strPRE=strPRE+strnum[l];
      pos=l+1;
    }
    if(strnum[pos]=='.'){
      pos=pos+1;
      for(let l=pos; l<strnum.length; l++){
        strPOST=strPOST+strnum[l];
      }
    }
    num=parseInt(strPRE);
    if(strPOST.length>0){
      var cifraDecimali = parseInt(strPOST);
      var decimali = cifraDecimali/(Math.pow(10,strPOST.length));
      num= num+ decimali;
    }
  }
  return num;
};


//funzione inserimento colonna a data per monitoraggio a più dati

//funzione lettura dati per data
function letturaData(datat, idi, idf){
  var data = [];
  var k;
  for(let a=idi; a<=idf; a++){
    k=a-1-idi;
    data[k] = [];
    for(var b=1; b<3; b++) {
      if(b==1){
        data[k][0]=tempoASec(datat[a][1]);
      }
      else{
        data[k][1]=num(datat[a][2]);
      }
    }
  }
  return data;
  //array colonna da inserire a data
};


//funzione lettura dati per labels
function letturaLabels(datat,idi, idf){
  var labels=[];
  var k;
  for(let a=idi; a<=idf; a++){
    k=a-1-idi;
    labels[k] = parseInt(datat[a][3]);
  }
  return labels;
};

//funzione array sorgenti
