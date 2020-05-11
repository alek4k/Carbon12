/**
 * File name: panel.test.js
 * Date: 2020-04-29
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

import Panel from '../../../src/utils/panel';
import View from '../../../src/utils/view';
import Target from '../../../src/utils/target';

describe('Testing method', () => {
    let panel = null;
    beforeEach(() => {
        panel = new Panel(new Target(0), new View('Grafico', 'TestTitle', 0));
    });

    afterEach(() => {
        panel = null;
    });

    it('getJSON', () => {
        const expectedJSON = (new View('Grafico', 'TestTitle', 0)).getJSON();
        expectedJSON.targets = [(new Target(0)).getJSON()];
        expect(panel.getJSON()).toEqual(expectedJSON);
        expect(panel).toEqual({
            view: {
                type: 'Grafico',
                title: 'TestTitle',
                id: 0,
                viewSettings: {
                    gridPos: { h: 8, w: 12 },
                    id: 0,
                    targets: [(new Target(0)).getJSON()],
                    valueName: 'current',
                    type: 'graph',
                    title: 'TestTitle',
                    description: '',
                    datasource: undefined,
                },
            },
            target: new Target(0),
        });
    });
});
