/**
 * File name: backendSrv.js
 * Date: 2020-04-02
 *
 * @file Mock
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */
const writeFileSyncMOCK = jest.fn();
const readFileSyncMOCK = jest.fn();
const createReadStreamMOCK = jest.fn();


const fs = {
    writeFileSync: writeFileSyncMOCK,
    readFileSync: readFileSyncMOCK,
    createReadStream: createReadStreamMOCK,
};

module.exports = fs;
