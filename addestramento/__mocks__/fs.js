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
const writeFileSyncMOCK = jest.fn();
const readFileSyncMOCK = jest.fn();
const createReadStreamMOCK = jest.fn();


const fs = jest.fn().mockImplementation(() => ({
    writeFileSync: writeFileSyncMOCK,
    readFileSync: readFileSyncMOCK,
    createReadStream: createReadStreamMOCK,
}));

module.exports = {
    fs, writeFileSyncMOCK, readFileSyncMOCK, createReadStreamMOCK,
};
