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

import Dashboard from '../../../src/utils/dashboard';
import Panel from '../../../src/utils/panel';
import Target from '../../../src/utils/target';
import View from '../../../src/utils/view';

describe('Testing method', () => {
    let dashboard = null;
    let expDashboardSettings = null;
    beforeEach(() => {
        expDashboardSettings = {
            panels: [],
            refresh: '5s',
            tags: [
                'Carbon12',
            ],
            templating: {
                list: [],
            },
            time: {
                from: 'now-5m',
                to: 'now',
            },
            timepicker: {
                refresh_intervals: [
                    '5s',
                    '10s',
                    '30s',
                    '1m',
                    '5m',
                    '15m',
                    '30m',
                    '1h',
                    '2h',
                    '1d',
                ],
            },
            title: 'Predire in Grafana',
            uid: 'carbon12',
        };
        dashboard = new Dashboard({
            panels: [],
            refresh: '5s',
            tags: [
                'Carbon12',
            ],
            templating: {
                list: [],
            },
            time: {
                from: 'now-5m',
                to: 'now',
            },
            timepicker: {
                refresh_intervals: [
                    '5s',
                    '10s',
                    '30s',
                    '1m',
                    '5m',
                    '15m',
                    '30m',
                    '1h',
                    '2h',
                    '1d',
                ],
            },
            title: 'Predire in Grafana',
            uid: 'carbon12',
        });
    });

    afterEach(() => {
        expDashboardSettings = null;
        dashboard = null;
    });

    it('addPanel', () => {
        dashboard.dashboardSettings.panels = [];

        const parPanel = new Panel(new Target(0), new View('Grafico', 'TestTitle', 0));
        dashboard.addPanel(parPanel);

        expDashboardSettings.panels = [(new View('Grafico', 'TestTitle', 0)).getJSON()];
        expDashboardSettings.panels[0].targets = [(new Target(0)).getJSON()];
        expect(dashboard).toEqual({
            dashboardSettings: expDashboardSettings,
        });
    });

    it('removePanel', () => {
        dashboard.dashboardSettings.panels = [
            new Panel(new Target(0), new View('Grafico', 'TestTitle', 0))];

        const parIndex = 0;
        dashboard.removePanel(parIndex);

        expect(dashboard).toEqual({
            dashboardSettings: expDashboardSettings,
        });
    });

    it('storeSettings', () => {
        const parPanelID = 5;
        const parSettings = 'testSettings';
        dashboard.storeSettings(parPanelID, parSettings);

        expDashboardSettings.templating.list = [{
            hide: 2, // nascosto
            name: parPanelID.toString(),
            query: JSON.stringify(parSettings),
            type: 'textbox',
        }];
        expect(dashboard).toEqual({
            dashboardSettings: expDashboardSettings,
        });
    });
});
