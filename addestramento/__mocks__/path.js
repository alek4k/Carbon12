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

const joinMOCK = jest.fn();
const basenameMOCK = jest.fn();

const path = {
    join: joinMOCK,
    basename: basenameMOCK,
};

module.exports = path;
