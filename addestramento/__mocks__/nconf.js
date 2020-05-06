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
const argvMOCK = jest.fn();
const envMOCK = jest.fn();
const fileMOCK = jest.fn();
const defaultsMOCK = jest.fn({
    PORT: 8080, TRAIN_VERSION: '0.0.0', PLUGIN_VERSION: '0.0.0',
});
const getMOCK = jest.fn(() => { defaultsMOCK(); });

const nconf = jest.fn().mockImplementation(() => ({
    argv: argvMOCK,
    env: envMOCK,
    file: fileMOCK,
    defaults: defaultsMOCK,
    get: getMOCK,
}));

module.exports = {
    nconf, argvMOCK, envMOCK, fileMOCK, defaultsMOCK, getMOCK,
};
