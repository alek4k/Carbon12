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

export const urlMock = jest.fn(() => {
    return undefined;
});

const locationMock = jest.fn().mockImplementation(() => ({
    url: urlMock,
}));

export default locationMock;
