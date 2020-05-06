/**
 * File name: panel.test.js
 * Date: 2020-04-29
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import Panel from '../../../src/utils/panel';
import View from '../../../src/utils/view';
import Target from '../../../src/utils/target';

jest.mock('../../../src/utils/view');
jest.mock('../../../src/utils/target');

it('Testing constructor', () => {
    const panel = new Panel(new Target(), new View());

    expect(panel).toEqual({ target: new Target(), view: new View() });
});

describe('Testing method', () => {
    let panel = null;
    beforeEach(() => {
        panel = new (function testPanel() { })();
    });

    afterEach(() => {
        panel = null;
    });

    it('getJSON', () => {
        panel.getJSON = Panel.prototype.getJSON;

        const view = new View();
        const target = new Target();
        panel.view = view;
        panel.target = target;

        const expectedJSON = view.getJSON();
        expectedJSON.targets = [target.getJSON()];
        expect(panel.getJSON()).toEqual(expectedJSON);
        expect(panel).toEqual({
            getJSON: Panel.prototype.getJSON,
            view: new View(),
            target: new Target(),
        });
    });
});
