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

const joinMOCK = jest.fn();
const basenameMOCK = jest.fn();

const path = {
    join: joinMOCK,
    basename: basenameMOCK,
};

module.exports = path;
