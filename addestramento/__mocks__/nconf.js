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
const argvMOCK = jest.fn();
const envMOCK = jest.fn();
const fileMOCK = jest.fn();
const defaultsMOCK = jest.fn({
    PORT: 8080, TRAIN_VERSION: '0.0.0', PLUGIN_VERSION: '0.0.0',
});
const getMOCK = jest.fn();

const nconf = {
    argv: argvMOCK,
    env: envMOCK,
    file: fileMOCK,
    defaults: defaultsMOCK,
    get: getMOCK,
};

module.exports = nconf;
