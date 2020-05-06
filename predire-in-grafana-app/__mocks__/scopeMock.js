/**
 * File name: eventsMock.js
 * Date: 2020-04-02
 *
 * @file Mock
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

export const evalAsyncMock = jest.fn();

const ScopeMock = jest.fn().mockImplementation(() => ({
    $evalAsync: evalAsyncMock,
}));

export default ScopeMock;
