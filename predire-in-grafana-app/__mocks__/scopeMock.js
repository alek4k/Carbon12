/**
 * File name: eventsMock.js
 * Date: 2020-04-02
 *
 * @file Mock
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version b.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const ScopeMock = jest.fn().mockImplementation(() => ({
    $evalAsync: jest.fn(),
}));

export default ScopeMock;
