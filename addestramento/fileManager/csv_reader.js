/**
 * File name: csv_reader.js
 * Date: 2020-03-23
 *
 * @file classe per la lettura del file CSV
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: sistemata lettura dati
 */

const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const dataReader = require('./dataReader.js');

module.exports = class csvReader extends dataReader {
    /**
     * @param {string} path Percorso da cui viene caricato il file.
     * @param {object} options Le opzioni passate al lettore di csv. Vedi: https://csv.js.org/parse/options/
     */

    constructor(path, options) {
        super();
        const input = fs.readFileSync(path, 'utf8');
        let readOptions = options;
        // opzioni di default per csv
        if (options == null) {
            readOptions = {
                delimiter: ';',
                bom: true,
                columns: true,
                skip_empty_lines: true,
            };
        }

        // converte il csv in una matrice: records[i]=riga i, records[i][nomeColonna]=valore nella cella in riga i e colonna nomeColonna
        this.records = parse(input, readOptions);

        // controllo da fare nel caso il csv sia vuoto
        if (this.records.length > 0) {
            // columns contiene un vettore di stringhe, ogni stringa è un nome di una colonna del csv
            this.columns = Object.keys(this.records[0]);
        }
        this.labelsColumn = null;
    }

    /**
     * @returns {Array} Ritorna un vettore contenente tutte le intestazioni delle colonne del CSV.
     */
    autoGetColumns() {
        return this.columns;
    }

    /**
     * @param int columnValue indice della colonna con le labels
     * imposta il valore della colonna che contiene le labels
     */
    setLabelsColumn(columnValue) {
        this.labelsColumn = this.columns[columnValue];
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

        const res = [];
        let i = 0;
        this.records.forEach((row) => {
            const validRow = [];
            let c = 0;
            for (const key in row) {
                if (columns.includes(key)) {
                    validRow[c++] = row[key];
                    // per ogni riga del csv, prendo i valori nelle colonne che sono specificate in columns
                    // in validRow alla fine del ciclo sarà presente la riga corrente con solo le colonne valide
                }
            }
            res[i++] = validRow;
        });
        return res;
    }

    /**
     * @returns {Array} Ritorna una matrice contenente i dati.
     * Converte i numeri in float, i null in 0 e le date in secondi.
     */
    autoGetData() {
        // seleziona tutte le colonne, eccetto quella delle data entry(Series), delle Labels e quella vuota che mette grafana
        const dataColumns = [];
        this.columns.forEach((element) => {
            if (!(element === this.labelsColumn)) {
                dataColumns.push(element);
            }
        });
        const res = this.getData(dataColumns);
        // converte i valori ottenuti nel giusto formato
        for (let i = 0; i < res.length; i++) {
            // converte i valori in float
            for (let j = 0; j < res[i].length; j++) {
                if (res[i][j] === 'null') {
                    res[i][j] = 0;
                } else {
                    res[i][j] = res[i][j].replace(',', '.');
                    res[i][j] = parseFloat(res[i][j]);
                    res[i][j] = Math.round(res[i][j] * 1e8) / 1e8;
                }
            }
        }
        return res;
    }


    /**
     * @returns {Array} Ritorna un vettore contenente le Labels
     * Ritorna un vettore contenente le Label già convertite in int.
     */
    autoGetLabel() {
        // usa getData per ottenere la colonna delle Labels
        const labCol = [];
        labCol[0] = this.labelsColumn;
        const res = this.getData(labCol);

        // converte le Label da String a int
        for (let i = 0; i < res.length; i++) {
            res[i] = parseInt(res[i]);
        }
        return res;
    }

    /**
     * @returns {Array} Ritorna un vettore contenente i nomi delle sorgenti di dati.
     */
    getDataSource() {
        const res = [];
        this.columns.forEach((element) => {
            if (!(element === this.labelsColumn)) {
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
