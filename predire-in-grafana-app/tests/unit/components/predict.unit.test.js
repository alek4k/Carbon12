/**
 * File name: predict.js
 * Date: 2020-04-01
 *
 * @file Classe per gestione della pagina di predizione
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable import/named */
import { emitMock } from 'grafana/app/core/core';
import PredictCtrl from '../../../src/components/predict';
import GrafanaApiQueryMock, { getDashboardMock, getFolderMock, postDashboardMock }
    from '../../../src/utils/grafana_query';
import BackendSrvMock from '../../../__mocks__/backendSrvMock';
import ScopeMock, { evalAsyncMock } from '../../../__mocks__/scopeMock';
import predictLooper from '../../../src/utils/predictLooper';
import DashboardMock, { removePanelMock, getJSONMock, updateSettingsMock } from '../../../src/utils/dashboard';

jest.mock('../../../src/utils/grafana_query');
jest.mock('../../../src/utils/predictLooper');
jest.mock('../../../src/utils/dashboard');
jest.mock('grafana/app/core/core');

afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    localStorage.clear();
});

it('Testing constructor', () => {
    jest.spyOn(PredictCtrl.prototype, 'verifyDashboard').mockReturnValueOnce();

    const parLocation = '';
    const parScope = '';
    const parBackendSrv = new BackendSrvMock();
    const predict = new PredictCtrl(parLocation, parScope, parBackendSrv);

    expect(GrafanaApiQueryMock).toHaveBeenCalledTimes(1);
    expect(GrafanaApiQueryMock).toHaveBeenCalledWith(new BackendSrvMock());
    expect(predict.verifyDashboard).toHaveBeenCalledTimes(1);
    expect(predict.verifyDashboard).toHaveBeenCalledWith();
    expect(predict).toEqual({
        $location: '',
        $scope: '',
        backendSrv: new BackendSrvMock(),
        grafana: new GrafanaApiQueryMock(),
        toRemove: -1,
    });
});

describe('Testing method', () => {
    let predict;
    beforeEach(() => {
        predict = new (function testPredictCtrl() { })();
    });

    describe('verifyDashboard', () => {
        beforeEach(() => {
            predict.verifyDashboard = PredictCtrl.prototype.verifyDashboard;
            predict.grafana = new GrafanaApiQueryMock();
            predict.$scope = new ScopeMock();
        });

        describe('when dashboardExists is true', () => {
            beforeEach(() => {
                getFolderMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const dbList = [{ uid: 'carbon12' }, { uid: 'altro' }];
                        fun(dbList);
                    },
                }));
            });

            it('when dashboardEmpty is true', () => {
                getJSONMock.mockReturnValue({
                    panels: [],
                });
                getDashboardMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const db = { dashboard: { panels: [] } };
                        fun(db);
                    },
                }));
                predict.dashboard = new DashboardMock();
                predict.getPanelsState = jest.fn();
                updateSettingsMock.mockReturnValueOnce(true);
                postDashboardMock.mockReturnValueOnce({
                    then: (fun) => fun(),
                });

                predict.verifyDashboard();

                expect(getFolderMock).toHaveBeenCalledTimes(1);
                expect(getFolderMock).toHaveBeenCalledWith('0');
                expect(getDashboardMock).toHaveBeenCalledTimes(1);
                expect(getDashboardMock).toHaveBeenCalledWith('predire-in-grafana');
                expect(evalAsyncMock).toHaveBeenCalledTimes(3);
                expect(evalAsyncMock).toHaveBeenCalledWith();
                expect(predict).toEqual({
                    verifyDashboard: PredictCtrl.prototype.verifyDashboard,
                    grafana: new GrafanaApiQueryMock(),
                    $scope: new ScopeMock(),
                    dashboardEmpty: true,
                    dashboardExists: true,
                    dashboard: new DashboardMock(),
                    getPanelsState: expect.any(Function),
                });
            });

            it('when dashboardEmpty is false', () => {
                getJSONMock.mockReturnValue({
                    panels: [1],
                });
                getDashboardMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const db = { dashboard: { panels: ['panel'] } };
                        fun(db);
                    },
                }));
                const mockGetPanelsState = jest.fn();
                predict.getPanelsState = mockGetPanelsState;
                predict.backendSrv = new BackendSrvMock();

                predict.verifyDashboard();

                expect(getFolderMock).toHaveBeenCalledTimes(1);
                expect(getFolderMock).toHaveBeenCalledWith('0');
                expect(getDashboardMock).toHaveBeenCalledTimes(1);
                expect(getDashboardMock).toHaveBeenCalledWith('predire-in-grafana');
                expect(predictLooper.setBackendSrv).toHaveBeenCalledTimes(1);
                expect(predictLooper.setBackendSrv)
                    .toHaveBeenCalledWith(new ScopeMock(), new BackendSrvMock());
                expect(evalAsyncMock).toHaveBeenCalledTimes(2);
                expect(evalAsyncMock).toHaveBeenCalledWith();
                expect(predict).toEqual({
                    verifyDashboard: PredictCtrl.prototype.verifyDashboard,
                    getPanelsState: mockGetPanelsState,
                    grafana: new GrafanaApiQueryMock(),
                    $scope: new ScopeMock(),
                    backendSrv: new BackendSrvMock(),
                    dashboardEmpty: false,
                    dashboardExists: true,
                    dashboard: new DashboardMock(),
                });
            });
        });

        it('when dashboardExists is false', () => {
            getFolderMock.mockImplementationOnce(() => ({
                then: (fun) => {
                    const dbList = [{ uid: 'altro1' }, { uid: 'altro2' }];
                    fun(dbList);
                },
            }));

            predict.verifyDashboard();

            expect(getFolderMock).toHaveBeenCalledTimes(1);
            expect(getFolderMock).toHaveBeenCalledWith('0');
            expect(evalAsyncMock).toHaveBeenCalledTimes(1);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            expect(predict).toEqual({
                verifyDashboard: PredictCtrl.prototype.verifyDashboard,
                grafana: new GrafanaApiQueryMock(),
                $scope: new ScopeMock(),
                dashboardExists: false,
            });
        });
    });

    describe('getPanelsState', () => {
        beforeEach(() => {
            predict.getPanelsState = PredictCtrl.prototype.getPanelsState;
            predict.dashboard = new DashboardMock();
            getJSONMock.mockReturnValue({
                panels: [1],
                templating: {
                    list: [{
                        query: {},
                    }],
                },
            });
        });

        it('when started is equal to "no"', () => {
            JSON.parse = jest.fn().mockReturnValueOnce({
                started: 'no',
            });

            predict.getPanelsState();

            expect(predict).toEqual({
                getPanelsState: PredictCtrl.prototype.getPanelsState,
                time: ['1'],
                timeUnit: ['secondi'],
                started: [false],
                panelsList: [undefined],
                dashboard: new DashboardMock(),
            });
        });

        describe('when started is not equal to "no"', () => {
            const mockTTM = jest.fn(() => 1);
            beforeEach(() => {
                predict.timeToMilliseconds = mockTTM;
            });

            it('when state end in "s"', () => {
                JSON.parse = jest.fn().mockReturnValue({
                    started: '10s',
                });

                predict.getPanelsState();

                expect(mockTTM).toHaveBeenCalledTimes(1);
                expect(mockTTM).toHaveBeenCalledWith(0);
                expect(predictLooper.startPrediction).toHaveBeenCalledTimes(1);
                expect(predictLooper.startPrediction).toHaveBeenCalledWith(0, 1);
                expect(predict).toEqual({
                    getPanelsState: PredictCtrl.prototype.getPanelsState,
                    timeToMilliseconds: mockTTM,
                    dashboard: new DashboardMock(),
                    time: ['10'],
                    timeUnit: ['secondi'],
                    started: [true],
                    panelsList: [undefined],
                });
            });

            it('when state do not end in "s"', () => {
                JSON.parse = jest.fn().mockReturnValue({
                    started: '10m',
                });

                predict.getPanelsState();

                expect(mockTTM).toHaveBeenCalledTimes(1);
                expect(mockTTM).toHaveBeenCalledWith(0);
                expect(predictLooper.startPrediction).toHaveBeenCalledTimes(1);
                expect(predictLooper.startPrediction).toHaveBeenCalledWith(0, 1);
                expect(predict).toEqual({
                    getPanelsState: PredictCtrl.prototype.getPanelsState,
                    timeToMilliseconds: mockTTM,
                    dashboard: new DashboardMock(),
                    time: ['10'],
                    timeUnit: ['minuti'],
                    started: [true],
                    panelsList: [undefined],
                });
            });
        });
    });

    describe('timeToMilliseconds', () => {
        beforeEach(() => {
            predict.timeToMilliseconds = PredictCtrl.prototype.timeToMilliseconds;
        });

        describe('when time[index] is defined', () => {
            it('when time[index] is a number and timeUnit[index] is "secondi"', () => {
                predict.time = ['1'];
                predict.timeUnit = ['secondi'];

                const parIndex = 0;
                const returnValue = predict.timeToMilliseconds(parIndex);

                expect(returnValue).toEqual(1000.0);
                expect(predict).toEqual({
                    timeToMilliseconds: PredictCtrl.prototype.timeToMilliseconds,
                    time: ['1'],
                    timeUnit: ['secondi'],
                });
            });

            it('when time[index] is a number and timeUnit[index] is not "secondi"', () => {
                console.log(parseFloat('ansj'));
                predict.time = ['1'];
                predict.timeUnit = ['altro'];

                const parIndex = 0;
                const returnValue = predict.timeToMilliseconds(parIndex);

                expect(returnValue).toEqual(60000.0);
                expect(predict).toEqual({
                    timeToMilliseconds: PredictCtrl.prototype.timeToMilliseconds,
                    time: ['1'],
                    timeUnit: ['altro'],
                });
            });

            it('when time[index] is not a number', () => {
                predict.time = ['altro'];
                const parIndex = 0;
                const returnValue = predict.timeToMilliseconds(parIndex);

                expect(returnValue).toEqual(0.0);
                expect(predict).toEqual({
                    timeToMilliseconds: PredictCtrl.prototype.timeToMilliseconds,
                    time: ['altro'],
                });
            });
        });

        it('when time[index] is not defined', () => {
            predict.time = [];

            const parIndex = 0;
            const returnValue = predict.timeToMilliseconds(parIndex);

            expect(returnValue).toEqual(0);
            expect(predict).toEqual({
                timeToMilliseconds: PredictCtrl.prototype.timeToMilliseconds,
                time: [],
            });
        });
    });

    describe('startPrediction', () => {
        const mockTTM = jest.fn();
        beforeEach(() => {
            predict.startPrediction = PredictCtrl.prototype.startPrediction;
            predict.timeToMilliseconds = mockTTM;
        });

        it('when dashboardEmpty is true', () => {
            predict.dashboardEmpty = true;

            const parIndex = 0;
            predict.startPrediction(parIndex);

            expect(mockTTM).toHaveBeenCalledTimes(1);
            expect(mockTTM).toHaveBeenCalledWith(parIndex);
            expect(emitMock).toHaveBeenCalledTimes(1);
            expect(emitMock).toHaveBeenCalledWith('alert-error', ['Dashboard vuota', '']);
            expect(predict).toEqual({
                startPrediction: PredictCtrl.prototype.startPrediction,
                timeToMilliseconds: mockTTM,
                dashboardEmpty: true,
            });
        });

        it('when dashboardEmpty is false and refreshTime is <= 0', () => {
            mockTTM.mockReturnValueOnce(0.0);
            predict.dashboardEmpty = false;

            const parIndex = 0;
            predict.startPrediction(parIndex);

            expect(mockTTM).toHaveBeenCalledTimes(1);
            expect(mockTTM).toHaveBeenCalledWith(parIndex);
            expect(emitMock).toHaveBeenCalledTimes(1);
            expect(emitMock).toHaveBeenCalledWith(
                'alert-error', ['Frequenza di predizione non supportata', ''],
            );
            expect(predict).toEqual({
                startPrediction: PredictCtrl.prototype.startPrediction,
                timeToMilliseconds: mockTTM,
                dashboardEmpty: false,
            });
        });

        it('when dashboardEmpty is false and refreshTime is >= 0', () => {
            mockTTM.mockReturnValueOnce(1);
            predict.dashboardEmpty = false;
            predict.started = [];
            predict.time = ['1'];
            predict.timeUnit = ['secondi'];
            predict.dashboard = new DashboardMock();
            predict.grafana = new GrafanaApiQueryMock();
            postDashboardMock.mockReturnValueOnce({
                then: (fun) => fun(),
            });
            predict.$scope = new ScopeMock();

            const parIndex = 0;
            predict.startPrediction(parIndex);

            expect(mockTTM).toHaveBeenCalledTimes(1);
            expect(mockTTM).toHaveBeenCalledWith(parIndex);
            expect(emitMock).toHaveBeenCalledTimes(1);
            expect(emitMock).toHaveBeenCalledWith('alert-success', ['Predizione avviata', '']);
            expect(predictLooper.startPrediction).toHaveBeenCalledTimes(1);
            expect(predictLooper.startPrediction).toHaveBeenCalledWith(0, 1);
            expect(predict).toEqual({
                startPrediction: PredictCtrl.prototype.startPrediction,
                timeToMilliseconds: mockTTM,
                dashboardEmpty: false,
                started: [true],
                time: ['1'],
                timeUnit: ['secondi'],
                $scope: new ScopeMock(),
                dashboard: new DashboardMock(),
                grafana: new GrafanaApiQueryMock(),
            });
        });
    });

    it('stopPrediction', () => {
        predict.stopPrediction = PredictCtrl.prototype.stopPrediction;
        predict.started = [true];
        predict.dashboard = new DashboardMock();
        predict.grafana = new GrafanaApiQueryMock();
        postDashboardMock.mockReturnValueOnce({
            then: (fun) => fun(),
        });
        predict.$scope = new ScopeMock();

        const parIndex = 0;
        predict.stopPrediction(parIndex);

        expect(emitMock).toHaveBeenCalledTimes(1);
        expect(emitMock).toHaveBeenCalledWith('alert-success', ['Predizione terminata', '']);
        expect(predictLooper.stopPrediction).toHaveBeenCalledTimes(1);
        expect(predictLooper.stopPrediction).toHaveBeenCalledWith(parIndex);
        expect(predict).toEqual({
            stopPrediction: PredictCtrl.prototype.stopPrediction,
            started: [false],
            $scope: new ScopeMock(),
            dashboard: new DashboardMock(),
            grafana: new GrafanaApiQueryMock(),
        });
    });

    it('removePanel', () => {
        predict.removePanel = PredictCtrl.prototype.removePanel;
        predict.started = [1];
        predict.dashboard = new DashboardMock();
        predict.grafana = new GrafanaApiQueryMock();
        postDashboardMock.mockReturnValueOnce({
            then: (fun) => fun(),
        });
        predict.verifyDashboard = jest.fn();
        predict.$scope = new ScopeMock();
        delete global.document;
        global.document = {
            getElementById: jest.fn().mockReturnValueOnce({
                remove: jest.fn(),
            }),
        };

        const parIndex = 0;
        predict.removePanel(parIndex);

        expect(removePanelMock).toHaveBeenCalledTimes(1);
        expect(removePanelMock).toHaveBeenCalledWith(0);
        expect(predictLooper.stopPrediction).toHaveBeenCalledTimes(1);
        expect(predictLooper.stopPrediction).toHaveBeenCalledWith(0);
        expect(postDashboardMock).toHaveBeenCalledTimes(1);
        expect(predict.verifyDashboard).toHaveBeenCalledTimes(1);
        expect(predict.verifyDashboard).toHaveBeenCalledWith();
        expect(predict).toEqual({
            removePanel: PredictCtrl.prototype.removePanel,
            started: [1],
            $scope: new ScopeMock(),
            dashboard: new DashboardMock(),
            grafana: new GrafanaApiQueryMock(),
            verifyDashboard: predict.verifyDashboard,
        });
    });

    describe('redirect', () => {
        const mockUrl = jest.fn();
        beforeEach(() => {
            predict.redirect = PredictCtrl.prototype.redirect;
            predict.$location = {
                url: mockUrl,
            };
        });

        it('when dashboardExists is true', () => {
            predict.dashboardExists = true;

            predict.redirect();

            expect(mockUrl).toHaveBeenCalledTimes(1);
            expect(mockUrl).toHaveBeenCalledWith('/d/carbon12/predire-in-grafana');
            expect(predict).toEqual({
                redirect: PredictCtrl.prototype.redirect,
                dashboardExists: true,
                $location: {
                    url: mockUrl,
                },
            });
        });

        it('when dashboardExists is false', () => {
            predict.dashboardExists = false;

            predict.redirect();

            expect(mockUrl).toHaveBeenCalledTimes(1);
            expect(mockUrl).toHaveBeenCalledWith('plugins/predire-in-grafana-app/page/import');
            expect(predict).toEqual({
                redirect: PredictCtrl.prototype.redirect,
                dashboardExists: false,
                $location: {
                    url: mockUrl,
                },
            });
        });
    });
});
