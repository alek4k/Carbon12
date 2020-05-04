/**
 * File name: R_Predittore.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della classe R_Predittore
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const fs = require('fs');
const RPredittore = require('../../fileManager/r_predittore.js');

const managePredittore = new RPredittore(JSON.parse(
    fs.readFileSync('./tests/files/predittore_test.json').toString(),
));

test('It should response that Plugin\'s and train\'s version are compatible', () => {
    expect(managePredittore.checkVersion('1.0.0', '1.0.0')).toBeTruthy();
});

test('It should response that Plugin\'s and train\'s version are compatible', () => {
    expect(managePredittore.validity()).toBeTruthy();
});
