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

export const emitMock = jest.fn();

const EventsMock = {
    emit: emitMock,
};

export { EventsMock as appEvents };
