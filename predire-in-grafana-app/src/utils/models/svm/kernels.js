/**
 * File name: app.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */
// Kernels

function makePolyKernel(d, c) {
    return function (v1, v2) {
        let s = 0;
        for (let q = 0; q < v1.length; q++) {
            s += v1[q] * v2[q];
        }
        s += c;
        return Math.pow(s, d);
    };
}

function makeSigmoidKernel(c) {
    return function (v1, v2) {
        let s = 0;
        for (let q = 0; q < v1.length; q++) {
            s += v1[q] * v2[q];
        }
        s += c;
        return Math.tanh(s);
    };
}

function makeRbfKernel(sigma) {
    return function (v1, v2) {
        let s = 0;
        for (let q = 0; q < v1.length; q++) {
            s += (v1[q] - v2[q]) * (v1[q] - v2[q]);
        }
        return Math.exp(-s / (2.0 * sigma * sigma));
    };
}

function linearKernel(v1, v2) {
    let s = 0;
    for (let q = 0; q < v1.length; q++) {
        s += v1[q] * v2[q];
    }
    return s;
}

module.exports = {
    linearKernel,
    makePolyKernel,
    makeRbfKernel,
    makeSigmoidKernel,
};
