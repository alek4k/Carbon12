/**
 * File name: backendSrv.js
 * Date: 2020-04-02
 *
 * @file Mock
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version b.Y.Z
 *
 * Changelog: modifiche effettuate
 */
/* const writeFileSyncMOCK = jest.fn();
const readFileSyncMOCK = jest.fn();
const createReadStreamMOCK = jest.fn(); */
const express = jest.fn(() => ({
    set: jest.fn(),
    use: jest.fn(),
}));
express.Router = jest.fn();
express.static = jest.fn();
module.exports = express;
