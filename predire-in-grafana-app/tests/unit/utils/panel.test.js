/**
 * File name: target.test.js
 * Date: 2020-04-28
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
    const parTarget = new Target();
    const parView = new View();
    const panel = new Panel(parTarget, parView);
    expect(panel).toEqual({ target: parTarget, view: parView });
});

describe('Testing method', () => {
    let panel = null;
    beforeEach(() => {
        panel = new Panel();
    });

    afterEach(() => {
        panel = null;
    });

    it('getJSON', () => {
        const view = new View();
        const target = new Target();
        panel.target = target;
        panel.view = view;
        const expectedJSON = view.getJSON();
        expectedJSON.targets = [target.getJSON()];
        expect(panel.getJSON()).toEqual(expectedJSON);
    });
});
