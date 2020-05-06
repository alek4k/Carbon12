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

const getTypeMOCK = jest.fn();

const mime = {
    getType: getTypeMOCK,
};

module.exports = mime;
