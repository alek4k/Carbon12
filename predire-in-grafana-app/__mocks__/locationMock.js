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

export const urlMock = jest.fn(() => undefined);

const locationMock = jest.fn().mockImplementation(() => ({
    url: urlMock,
}));

export default locationMock;
