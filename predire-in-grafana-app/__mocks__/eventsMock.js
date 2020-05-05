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

export const emitMock = jest.fn();

const EventsMock = jest.fn().mockImplementation(() => ({
    emit: emitMock,
}));

const appEvents = new EventsMock();
export { appEvents };
