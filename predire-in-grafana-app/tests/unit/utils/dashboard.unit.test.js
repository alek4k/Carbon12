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

import Dashboard from '../../../src/utils/dashboard';

describe('Testing constructor', () => {
    it('passing the db param', () => {
        const parDb = {};
        const dashboard = new Dashboard(parDb);

        expect(dashboard).toEqual({
            dashboardSettings: {},
        });
    });

    it('without passing the db param', () => {
        const dashboard = new Dashboard();

        expect(dashboard).toEqual({
            dashboardSettings: {
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
            },
        });
    });
});
describe('Testing method', () => {
    let dashboard = null;
    let expDashboardSettings = null;
    beforeEach(() => {
        dashboard = new (function testGrafanaApi() { })();
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
        dashboard.dashboardSettings = {
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
    });

    afterEach(() => {
        expDashboardSettings = null;
        dashboard = null;
    });

    describe('setThresholds', () => {
        it('with type equal to "graph"', () => {
            dashboard.setThresholds = Dashboard.prototype.setThresholds;
            dashboard.dashboardSettings.panels = [{ type: 'graph' }];

            const parThresholds = [{
                value: 5,
                op: 'gt',
            }];
            const parIndex = 0;
            dashboard.setThresholds(parThresholds.slice(0), parIndex);

            expDashboardSettings.panels[parIndex] = {
                type: 'graph',
                thresholds: parThresholds,
            };
            expect(dashboard).toEqual({
                setThresholds: Dashboard.prototype.setThresholds,
                dashboardSettings: expDashboardSettings,
            });
        });

        describe('with type not equal to "graph"', () => {
            it('with op equal to "gt"', () => {
                dashboard.setThresholds = Dashboard.prototype.setThresholds;
                dashboard.dashboardSettings.panels = [{ type: 'notGraph' }];

                const parThresholds = [{
                    value: 5,
                    op: 'gt',
                }];
                const parIndex = 0;
                dashboard.setThresholds(parThresholds.slice(), parIndex);

                expDashboardSettings.panels[parIndex] = {
                    type: 'notGraph',
                    thresholds: parThresholds[0].value.toString()
                        + ',' + parThresholds[0].value.toString(),
                    colors: ['#299c46', 'rgba(237, 129, 40, 0.89)', '#d44a3a'],
                    colorBackground: true,
                };
                expect(dashboard).toEqual({
                    setThresholds: Dashboard.prototype.setThresholds,
                    dashboardSettings: expDashboardSettings,
                });
            });

            it('with op not equal to "gt"', () => {
                dashboard.setThresholds = Dashboard.prototype.setThresholds;
                dashboard.dashboardSettings.panels = [{ type: 'notGraph' }];

                const parThresholds = [{
                    value: 5,
                    op: 'lt',
                }];
                const parIndex = 0;
                dashboard.setThresholds(parThresholds.slice(), parIndex);

                expDashboardSettings.panels[parIndex] = {
                    type: 'notGraph',
                    thresholds: parThresholds[0].value.toString()
                        + ',' + parThresholds[0].value.toString(),
                    colors: ['#d44a3a', 'rgba(237, 129, 40, 0.89)', '#299c46'],
                    colorBackground: true,
                };
                expect(dashboard).toEqual({
                    setThresholds: Dashboard.prototype.setThresholds,
                    dashboardSettings: expDashboardSettings,
                });
            });
        });
    });

    describe('setAlert', () => {
        it('with type equal to "graph"', () => {
            dashboard.setAlert = Dashboard.prototype.setAlert;
            dashboard.dashboardSettings.panels = [{ type: 'graph' }];

            const parAlert = 'Alert';
            const parIndex = 0;
            dashboard.setAlert(parAlert, parIndex);

            expDashboardSettings.panels[parIndex] = {
                type: 'graph',
                alert: parAlert,
            };
            expect(dashboard).toEqual({
                setAlert: Dashboard.prototype.setAlert,
                dashboardSettings: expDashboardSettings,
            });
        });

        it('with type not equal to "graph"', () => {
            dashboard.setAlert = Dashboard.prototype.setAlert;
            dashboard.dashboardSettings.panels = [{ type: 'notGraph' }];

            const parAlert = 'Alert';
            const parIndex = 0;
            dashboard.setAlert(parAlert, parIndex);

            expDashboardSettings.panels[parIndex] = {
                type: 'notGraph',
            };
            expect(dashboard).toEqual({
                setAlert: Dashboard.prototype.setAlert,
                dashboardSettings: expDashboardSettings,
            });
        });
    });

    describe('removeThresholds', () => {
        describe('with thresholds defined', () => {
            it('with type "singlestat"', () => {
                dashboard.removeThresholds = Dashboard.prototype.removeThresholds;
                dashboard.dashboardSettings.panels = [{ type: 'singlestat', thresholds: {} }];

                const parIndex = 0;
                dashboard.removeThresholds(parIndex);

                expDashboardSettings.panels = [{ type: 'singlestat', colorBackground: false }];
                expect(dashboard).toEqual({
                    removeThresholds: Dashboard.prototype.removeThresholds,
                    dashboardSettings: expDashboardSettings,
                });
            });

            it('with type not equal "singlestat"', () => {
                dashboard.removeThresholds = Dashboard.prototype.removeThresholds;
                dashboard.dashboardSettings.panels = [{ type: 'notSinglestat', thresholds: {} }];

                const parIndex = 0;
                dashboard.removeThresholds(parIndex);

                expDashboardSettings.panels = [{ type: 'notSinglestat' }];
                expect(dashboard).toEqual({
                    removeThresholds: Dashboard.prototype.removeThresholds,
                    dashboardSettings: expDashboardSettings,
                });
            });
        });

        it('with thresholds undefined', () => {
            dashboard.removeThresholds = Dashboard.prototype.removeThresholds;
            dashboard.dashboardSettings.panels = [{ thresholds: undefined }];

            const parIndex = 0;
            dashboard.removeThresholds(parIndex);

            expDashboardSettings.panels = [{ thresholds: undefined }];
            expect(dashboard).toEqual({
                removeThresholds: Dashboard.prototype.removeThresholds,
                dashboardSettings: expDashboardSettings,
            });
        });
    });

    describe('removeAlert', () => {
        it('with alert defined', () => {
            dashboard.removeAlert = Dashboard.prototype.removeAlert;
            dashboard.dashboardSettings.panels = [{ alert: {} }];

            const parIndex = 0;
            dashboard.removeAlert(parIndex);

            expDashboardSettings.panels = [{}];
            expect(dashboard).toEqual({
                removeAlert: Dashboard.prototype.removeAlert,
                dashboardSettings: expDashboardSettings,
            });
        });

        it('with alert undefined', () => {
            dashboard.removeAlert = Dashboard.prototype.removeAlert;
            dashboard.dashboardSettings.panels = [{ alert: undefined }];

            const parIndex = 0;
            dashboard.removeAlert(parIndex);

            expDashboardSettings.panels = [{ alert: undefined }];
            expect(dashboard).toEqual({
                removeAlert: Dashboard.prototype.removeAlert,
                dashboardSettings: expDashboardSettings,
            });
        });
    });

    it('addPanel', () => {
        dashboard.addPanel = Dashboard.prototype.addPanel;
        dashboard.dashboardSettings.panels = [];

        const parPanel = {
            getJSON: jest.fn(() => 'testGetJSON'),
        };
        dashboard.addPanel(parPanel);

        expDashboardSettings.panels = ['testGetJSON'];
        expect(parPanel.getJSON).toHaveBeenCalledTimes(1);
        expect(parPanel.getJSON).toHaveBeenCalledWith();
        expect(dashboard).toEqual({
            addPanel: Dashboard.prototype.addPanel,
            dashboardSettings: expDashboardSettings,
        });
    });

    it('storeSettings', () => {
        dashboard.storeSettings = Dashboard.prototype.storeSettings;
        const updateSettingsMock = jest.fn();
        dashboard.updateSettings = updateSettingsMock;

        const parPanelID = 5;
        const parSettings = 'testSettings';
        dashboard.storeSettings(parPanelID, parSettings);

        expect(updateSettingsMock).toHaveBeenCalledTimes(1);
        expect(updateSettingsMock).toHaveBeenCalledWith();
        expDashboardSettings.templating.list = [{
            hide: 2, // nascosto
            name: parPanelID.toString(),
            query: parSettings,
            type: 'textbox',
        }];
        expect(dashboard).toEqual({
            storeSettings: Dashboard.prototype.storeSettings,
            updateSettings: updateSettingsMock,
            dashboardSettings: expDashboardSettings,
        });
    });

    describe('updateSettings', () => {
        beforeEach(() => {
            dashboard.updateSettings = Dashboard.prototype.updateSettings;
        });

        it('with panel.length equal variable.length', () => {
            const returnValue = dashboard.updateSettings();

            expect(returnValue).toEqual(false);
            expect(dashboard).toEqual({
                updateSettings: Dashboard.prototype.updateSettings,
                dashboardSettings: expDashboardSettings,
            });
        });


        it('with panel.length not equal variable.length', () => {
            expect(dashboard.dashboardSettings.panels).toEqual([]);
            expect(dashboard.dashboardSettings.templating.list).toEqual([]);
            dashboard.dashboardSettings.panels.push({ id: 1 });
            dashboard.dashboardSettings.panels.push({ id: 2 });
            dashboard.dashboardSettings.panels.push({ id: 3 });
            dashboard.dashboardSettings.panels.push({ id: 4 });
            dashboard.dashboardSettings.templating.list.push({ id: 1 });
            dashboard.dashboardSettings.templating.list.push({ id: 3 });
            dashboard.dashboardSettings.templating.list.push({ id: 4 });
            dashboard.dashboardSettings.templating.list.push({ id: 2 });
            dashboard.dashboardSettings.templating.list.push({ id: 5 });

            const returnValue = dashboard.updateSettings();

            expDashboardSettings.panels.push({ id: 1 });
            expDashboardSettings.panels.push({ id: 2 });
            expDashboardSettings.panels.push({ id: 3 });
            expDashboardSettings.panels.push({ id: 4 });
            expDashboardSettings.templating.list.push({ id: 1 });
            expDashboardSettings.templating.list.push({ id: 2 });
            expect(returnValue).toEqual(true);
            expect(dashboard).toEqual({
                updateSettings: Dashboard.prototype.updateSettings,
                dashboardSettings: expDashboardSettings,
            });
        });
    });

    it('getJSON', () => {
        dashboard.getJSON = Dashboard.prototype.getJSON;

        const returnValue = dashboard.getJSON();

        expect(returnValue).toEqual(expDashboardSettings);
        expect(dashboard).toEqual({
            getJSON: Dashboard.prototype.getJSON,
            dashboardSettings: expDashboardSettings,
        });
    });
});
