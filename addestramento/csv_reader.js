module.exports = class csv_reader {

    /**
     * @param {string} path Percorso da cui viene caricato il file.
     * @param {object} options Le opzioni passate al lettore di csv. Vedi: https://csv.js.org/parse/options/
     */
    constructor(path, options) {
        const fs = require('fs');
        const parse = require('csv-parse/lib/sync');
        const assert = require('assert');


        let input = fs.readFileSync(path, 'utf8');

        //opzioni di default per csv
        if (options == null) {
            options = {
                delimiter: ';',
                bom: true,
                columns: true,
                skip_empty_lines: true
            }
        }

        //converte il csv in una matrice: records[i]=riga i, records[i][nomeColonna]=valore nella cella in riga i e colonna nomeColonna
        this.records = parse(input, options);

        //controllo da fare nel caso il csv sia vuoto
        if (this.records.length > 0) {
            //columns contiene un vettore di stringhe, ogni stringa è un nome di una colonna del csv
            this.columns = Object.keys(this.records[0]);
        }
    }

    /**
     *
     * @param {Array} columns Lista di colonne da ritornare.
     * @returns {Array} Ritorna la matrice contenente ogni riga di ogni colonna selezionata.
     */
    getData(columns) {
        if (columns == null) {
            return null;
        }

        let res = Array();
        let i = 0;
        this.records.forEach(row => {
            let validRow = Array();
            let c = 0;
            for (let key in row) {
                if (columns.includes(key)) {
                    //per ogni riga del csv, prendo i valori nelle colonne che sono specificate in columns
                    //in validRow alla fine del ciclo sarà presente la riga corrente con solo le colonne valide
                    validRow[c++] = row[key];
                }
            }
            res[i++] = validRow;
        });
        return res;
    }

    /**
     * @returns {Array} Ritorna una matrice contenente i dati.
     * Usa la formattazione Series-Dati-Labels, ed in più scarta la colonna vuota che inserisce grafana.
     * Converte i numeri in float, i null in 0 e le date in secondi.
     */
    autoGetData() {
        //seleziona tutte le colonne, eccetto quella delle data entry(Series), delle Labels e quella vuota che mette grafana
        let dataColumns = Array();
        this.columns.forEach(element => {
            if (element !== "Labels") {
                dataColumns.push(element);
            }
        });
        let res = this.getData(dataColumns);
        
        //converte i valori ottenuti nel giusto formato
        //tempo di inizio dei dati
        let timeIn = Date.parse(res[0][0]);
        for (let i = 0; i < res.length; i++) {
            //converte le date(dando per scontato che siano nella prima colonna dati) in secondi
            res[i][0] = Date.parse(res[i][0])-timeIn;
            //converte i valori in float
            for (let j = 1; j < res[i].length; j++) {
                if (res[i][j] === "null")
                    res[i][j] = 0;
                else
                    res[i][j] = parseFloat(res[i][j]);
            }
        }
        return res;
    }

    /**
     * @returns {Array} Ritorna un vettore contenente le Labels
     * Ritorna un vettore contenente le Label già convertite in int.
     */
    autoGetLabel() {
        //usa getData per ottenere la colonna delle Labels
        let labCol = Array();
        labCol[0] = "Labels";
        let res = this.getData(labCol);

        //converte le Label da String a int
        for (let i = 0; i < res.length; i++) {
            res[i] = parseInt(res[i]);
        }
        return res;
    }

    /**
     * @returns {Array} Ritorna un vettore contenente i nomi delle sorgenti di dati.
     */
    getDataSource() {
        let res = Array();
        this.columns.forEach(element => {
            if (!(element === "Labels")) {
                res.push(element);
            }
        });
        return res;
    }

    /**
     * @returns {int} Ritorna il numero di sorgenti.
     */
    countSource() {
      return this.getDataSource().length;
    }
};