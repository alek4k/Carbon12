/**
 * File name: regression.js
 * Date: 2020-03-22
 *
 * @file classe che implementa il modello Regressione lineare
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: aggiunti commenti JSON
 */

import StrategyModel from '../strategyModel';

class Regression extends StrategyModel {
    add(xs, ys) { this.addObservation({ x: [1].concat(xs), y: [ys] }); }

    calculate() { return this.calculateCoefficients(); }

    predict(xs) { return this.hypothesize({ x: [1].concat(xs) }); }

    push(options) { this.addObservation(options); }

    /**
  * in y = ax + cb
  * @param data {array} value of x
  * @param expected {array} value of y
  */
    train(data, expected) {
        this.data = data;
        this.expected = expected;
        this.N = data.length;
        let i = 0;
        for (i = 0; i < this.N; i++) {
            data[i].unshift(1);
            const options = {
                x: data[i],
                y: [expected[i]],
            };
            console.log(options);
            this.push(options);
        }
        // calcola coefficienti
        this.calculate();
    }

    toJSON() {
        const json = {};
        json._parametroN = 'numero di dati inseriti';
        json.N = this.N
        json._parametroD = 'numero di sorgenti analizzate';
        json.D = this.D
        json._parametroAlpha = 'coefficienti della retta risultante';
        json.alpha = this.calculate();
        return json;
    }

    fromJSON(json) {
        this.N = json.N;
        this.D = json.D;
        this.coefficients = json.alpha;
    }

    constructor(options) {
        super();
        if (!options) throw new Error('missing options');
        if (!('numX' in options)) throw new Error('you must give the width of the X dimension as the property numX');
        if (!('numY' in options)) throw new Error('you must give the width of the Y dimension as the property numY');
        this.transposeOfXTimesX = this.rectMatrix({ numRows: options.numX, numColumns: options.numX });
        this.transposeOfXTimesY = this.rectMatrix({ numRows: options.numX, numColumns: options.numY });
        this.D = options.numX;
        this.identity = this.identityMatrix(options.numX);
    }

    addObservation(options) {
        if (!options) throw new Error('missing options');
        if (!(options.x instanceof Array) || !(options.y instanceof Array)) throw new Error('x and y must be given as arrays');
        this.addRowAndColumn(this.transposeOfXTimesX, { lhsColumn: options.x, rhsRow: options.x });
        this.addRowAndColumn(this.transposeOfXTimesY, { lhsColumn: options.x, rhsRow: options.y });
        // Adding an observation invalidates our coefficients.
        delete this.coefficients;
    }

    calculateCoefficients() {
        const xTx = this.transposeOfXTimesX;
        const xTy = this.transposeOfXTimesY;
        const inv = this.inverse(xTx, this.identity);
        this.coefficients = this.multiply(inv, xTy);
        return this.coefficients;
    }

    hypothesize(options) {
        if (!options) throw new Error('missing options');
        if (!(options.x instanceof Array)) throw new Error('x property must be given as an array');
        if (!this.coefficients) this.calculateCoefficients();
        const hypothesis = [];
        for (let x = 0; x < this.coefficients.length; x++) {
            const coefficientRow = this.coefficients[x];
            for (let y = 0; y < coefficientRow.length; y++) hypothesis[y] = (hypothesis[y] || 0) + coefficientRow[y] * options.x[x];
        }
        return hypothesis;
    }

    inverse(matrix, identity) {
        const size = matrix.length;
        let result = new Array(size);
        for (var i = 0; i < size; i++) result[i] = matrix[i].concat(identity[i]);
        result = this.rref(result);
        for (var i = 0; i < size; i++) result[i].splice(0, size);
        return result;
    }

    rref(A) {
        const rows = A.length;
        const columns = A[0].length;

        let lead = 0;
        for (let k = 0; k < rows; k++) {
            if (columns <= lead) return;

            var i = k;
            while (A[i][lead] === 0) {
                i++;
                if (rows === i) {
                    i = k;
                    lead++;
                    if (columns === lead) return;
                }
            }
            const irow = A[i]; const
                krow = A[k];
            A[i] = krow, A[k] = irow;

            let val = A[k][lead];
            for (var j = 0; j < columns; j++) {
                A[k][j] /= val;
            }

            for (var i = 0; i < rows; i++) {
                if (i === k) continue;
                val = A[i][lead];
                for (var j = 0; j < columns; j++) {
                    A[i][j] -= val * A[k][j];
                }
            }
            lead++;
        }
        return A;
    }

    multiply(lhs, rhs) {
        const options = { numRows: lhs.length, numColumns: rhs[0].length };
        const streamingProduct = this.rectMatrix(options);
        for (let x = 0; x < rhs.length; x++) {
            const lhsColumn = [];
            // Get the xth column of lhs.
            for (let r = 0; r < lhs.length; r++) lhsColumn.push(lhs[r][x]);
            // Get the xth row of rhs.
            const rhsRow = rhs[x];
            this.addRowAndColumn(streamingProduct, {
                lhsColumn,
                rhsRow,
            });
        }
        return streamingProduct;
    }

    identityMatrix(size) {
        const matrix = this.rectMatrix({ numRows: size, numColumns: size });
        for (let i = 0; i < size; i++) matrix[i][i] = 1;
        return matrix;
    }

    rectMatrix(options) {
        const matrix = new Array(options.numRows);
        for (let r = 0; r < options.numRows; r++) {
            const row = new Array(options.numColumns);
            matrix[r] = row;
            for (let c = 0; c < options.numColumns; c++) {
                row[c] = 0;
            }
        }
        return matrix;
    }

    addRowAndColumn(product, options) {
        for (let c = 0; c < options.lhsColumn.length; c++) for (let r = 0; r < options.rhsRow.length; r++) product[c][r] += options.lhsColumn[c] * options.rhsRow[r];
    }
}

module.exports = Regression;
