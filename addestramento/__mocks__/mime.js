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

const getTypeMOCK = jest.fn();

const mime = {
    getType: getTypeMOCK,
};

module.exports = mime;
