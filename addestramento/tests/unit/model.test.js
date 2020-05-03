/**
 * File name: RL_Adapter.test.js
 * Date: 2020-03-18
 *
 * @file Test metodi della classe RL_Adapter
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const Model = require('../../models/model');

test('It should response a error message because fromJSON must be implemented', () => {
    Model.prototype.fromJSON = false;
    Model.prototype.train = function f() {};

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new Model(); }).toThrow(new Error(
        'fromJSON method must be implemented',
    ));
});

test('It should response a error message because train must be implemented', () => {
    Model.prototype.fromJSON = function f() {};
    Model.prototype.train = false;

    // eslint-disable-next-line no-unused-vars
    expect(() => { const dataR = new Model(); }).toThrow(new Error(
        'train method must be implemented',
    ));
});
