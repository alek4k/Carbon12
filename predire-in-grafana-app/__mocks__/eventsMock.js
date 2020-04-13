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

class EventsMock {
    emit(string, array) {}
}

const o = new EventsMock();
export { o as appEvents };
