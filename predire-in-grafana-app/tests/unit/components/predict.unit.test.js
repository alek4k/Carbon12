/**
 * File name: predict.js
 * Date: 2020-04-01
 *
 * @file Classe per gestione della pagina di predizione
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modificato metodo resetButtonsState(String)
 */

import PredictCtrl from '../../../src/components/predict';
import GrafanaApiQueryMock, { getDashboardMock, getFolderMock }
    from '../../../src/utils/grafana_query';
import BackendSrvMock from '../../../__mocks__/backendSrvMock';
import ScopeMock, { evalAsyncMock } from '../../../__mocks__/scopeMock';
import predictLooper from '../../../src/utils/predictLooper';
import { appEvents, emitMock } from 'grafana/app/core/core';

jest.mock('../../../src/utils/grafana_query');
jest.mock('../../../src/utils/predictLooper');
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
        dashboardExists: false,
        dashboardEmpty: true,
    });
});

describe('Testing method', () => {
    let predict;
    beforeEach(() => {
        predict = new (function testPredictCtrl() { })();
    });

    describe('verifyDashboard', () => {
        describe('when dashboardExists is true', () => {
            it('when dashboardEmpty is true', () => {
                predict.verifyDashboard = PredictCtrl.prototype.verifyDashboard;
                predict.grafana = new GrafanaApiQueryMock();
                getFolderMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const dbList = [{ uid: 'carbon12' }, { uid: 'altro' }];
                        fun(dbList);
                    },
                }));
                getDashboardMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const db = { dashboard: { panels: [] } };
                        fun(db);
                    },
                }));
                const mockResetButtonState = jest.fn();
                predict.resetButtonsState = mockResetButtonState;
                predict.$scope = new ScopeMock();

                predict.verifyDashboard();

                expect(getFolderMock).toHaveBeenCalledTimes(1);
                expect(getFolderMock).toHaveBeenCalledWith('0');
                expect(getDashboardMock).toHaveBeenCalledTimes(1);
                expect(getDashboardMock).toHaveBeenCalledWith('predire-in-grafana');
                expect(mockResetButtonState).toHaveBeenCalledTimes(1);
                expect(mockResetButtonState).toHaveBeenCalledWith();
                expect(evalAsyncMock).toHaveBeenCalledTimes(2);
                expect(evalAsyncMock).toHaveBeenCalledWith();
                expect(predict).toEqual({
                    verifyDashboard: PredictCtrl.prototype.verifyDashboard,
                    resetButtonsState: mockResetButtonState,
                    grafana: new GrafanaApiQueryMock(),
                    $scope: new ScopeMock(),
                    dashboardEmpty: true,
                    dashboardExists: true,
                });
            });

            it('when dashboardEmpty is false', () => {
                predict.verifyDashboard = PredictCtrl.prototype.verifyDashboard;
                predict.grafana = new GrafanaApiQueryMock();
                getFolderMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const dbList = [{ uid: 'carbon12' }, { uid: 'altro' }];
                        fun(dbList);
                    },
                }));
                getDashboardMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const db = { dashboard: { panels: ['panel'] } };
                        fun(db);
                    },
                }));
                const mockResetButtonState = jest.fn();
                predict.resetButtonsState = mockResetButtonState;
                const mockGetPanelsState = jest.fn();
                predict.getPanelsState = mockGetPanelsState;
                predict.$scope = new ScopeMock();
                predict.backendSrv = new BackendSrvMock();

                predict.verifyDashboard();

                expect(getFolderMock).toHaveBeenCalledTimes(1);
                expect(getFolderMock).toHaveBeenCalledWith('0');
                expect(getDashboardMock).toHaveBeenCalledTimes(1);
                expect(getDashboardMock).toHaveBeenCalledWith('predire-in-grafana');
                expect(mockResetButtonState).toHaveBeenCalledTimes(1);
                expect(mockResetButtonState).toHaveBeenCalledWith('no');
                expect(predictLooper.setBackendSrv).toHaveBeenCalledTimes(1);
                expect(predictLooper.setBackendSrv)
                    .toHaveBeenCalledWith(new ScopeMock(), new BackendSrvMock());
                expect(evalAsyncMock).toHaveBeenCalledTimes(2);
                expect(evalAsyncMock).toHaveBeenCalledWith();
                expect(predict).toEqual({
                    verifyDashboard: PredictCtrl.prototype.verifyDashboard,
                    resetButtonsState: mockResetButtonState,
                    getPanelsState: mockGetPanelsState,
                    grafana: new GrafanaApiQueryMock(),
                    $scope: new ScopeMock(),
                    backendSrv: new BackendSrvMock(),
                    dashboardEmpty: false,
                    dashboardExists: true,
                });
            });
        });

        it('when dashboardExists is false', () => {
            predict.verifyDashboard = PredictCtrl.prototype.verifyDashboard;
            predict.grafana = new GrafanaApiQueryMock();
            getFolderMock.mockImplementationOnce(() => ({
                then: (fun) => {
                    const dbList = [{ uid: 'altro1' }, { uid: 'altro2' }];
                    fun(dbList);
                },
            }));
            const mockResetButtonState = jest.fn();
            predict.resetButtonsState = mockResetButtonState;
            predict.$scope = new ScopeMock();

            predict.verifyDashboard();

            expect(getFolderMock).toHaveBeenCalledTimes(1);
            expect(getFolderMock).toHaveBeenCalledWith('0');
            expect(mockResetButtonState).toHaveBeenCalledTimes(1);
            expect(mockResetButtonState).toHaveBeenCalledWith();
            expect(evalAsyncMock).toHaveBeenCalledTimes(1);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            expect(predict).toEqual({
                verifyDashboard: PredictCtrl.prototype.verifyDashboard,
                resetButtonsState: mockResetButtonState,
                grafana: new GrafanaApiQueryMock(),
                $scope: new ScopeMock(),
                dashboardExists: false,
            });
        });
    });

    describe('resetButtonsState', () => {
        beforeEach(() => {
            localStorage.setItem('btn1', 'no');
            localStorage.setItem('btn2', 'altro');
            localStorage.setItem('key3', 'altro');
            predict.resetButtonsState = PredictCtrl.prototype.resetButtonsState;
        });

        it('with onStatus defined', () => {
            const parOnStatus = 'status';
            predict.resetButtonsState(parOnStatus);

            expect({ ...localStorage }).toEqual({
                btn2: 'altro',
                key3: 'altro',
            });
            expect(predictLooper.stopPrediction).toHaveBeenCalledTimes(0);
            expect(predict).toEqual({
                resetButtonsState: PredictCtrl.prototype.resetButtonsState,
            });
        });

        it('with onStatus undefined', () => {
            const parOnStatus = undefined;
            predict.resetButtonsState(parOnStatus);

            expect({ ...localStorage }).toEqual({
                btn1: 'no',
                key3: 'altro',
            });
            expect(predictLooper.stopPrediction).toHaveBeenCalledTimes(1);
            expect(predictLooper.stopPrediction).toHaveBeenCalledWith(2);
            expect(predict).toEqual({
                resetButtonsState: PredictCtrl.prototype.resetButtonsState,
            });
        });
    });

    describe('getPanelsState', () => {
        beforeEach(() => {
            predict.getPanelsState = PredictCtrl.prototype.getPanelsState;
            predict.started = [];
            predict.panelsList = [];
        });

        it('when localStorage.getItem is equal to "no"', () => {
            localStorage.setItem('btn0', 'no');

            const parPanels = [{ title: 'testPanelTitle' }];
            predict.getPanelsState(parPanels);

            expect({ ...localStorage }).toEqual({
                btn0: 'no',
            });
            expect(predict).toEqual({
                getPanelsState: PredictCtrl.prototype.getPanelsState,
                time: ['1'],
                timeUnit: ['secondi'],
                started: [false],
                panelsList: ['testPanelTitle'],
            });
        });

        describe('when localStorage.getItem is not equal to "no"', () => {
            const mockTTM = jest.fn(() => 1);
            beforeEach(() => {
                predict.timeToMilliseconds = mockTTM;
            });

            it('when localStorage.getItem end with s', () => {
                localStorage.setItem('btn0', '15s');

                const parPanels = [{ title: 'testPanelTitle' }];
                predict.getPanelsState(parPanels);

                expect({ ...localStorage }).toEqual({
                    btn0: '15s',
                });
                expect(mockTTM).toHaveBeenCalledTimes(1);
                expect(mockTTM).toHaveBeenCalledWith(0);
                expect(predictLooper.startPrediction).toHaveBeenCalledTimes(1);
                expect(predictLooper.startPrediction).toHaveBeenCalledWith(0, 1);
                expect(predict).toEqual({
                    getPanelsState: PredictCtrl.prototype.getPanelsState,
                    timeToMilliseconds: mockTTM,
                    time: ['15'],
                    timeUnit: ['secondi'],
                    started: [true],
                    panelsList: ['testPanelTitle'],
                });
            });

            it('when localStorage.getItem don\'t end with s', () => {
                localStorage.setItem('btn0', '15m');

                const parPanels = [{ title: 'testPanelTitle' }];
                predict.getPanelsState(parPanels);

                expect({ ...localStorage }).toEqual({
                    btn0: '15m',
                });
                expect(mockTTM).toHaveBeenCalledTimes(1);
                expect(mockTTM).toHaveBeenCalledWith(0);
                expect(predictLooper.startPrediction).toHaveBeenCalledTimes(1);
                expect(predictLooper.startPrediction).toHaveBeenCalledWith(0, 1);
                expect(predict).toEqual({
                    getPanelsState: PredictCtrl.prototype.getPanelsState,
                    timeToMilliseconds: mockTTM,
                    time: ['15'],
                    timeUnit: ['minuti'],
                    started: [true],
                    panelsList: ['testPanelTitle'],
                });
            });
        });

        it('when localStorage.getItem is not defined', () => {
            const parPanels = [{ title: 'testPanelTitle' }];
            predict.getPanelsState(parPanels);

            expect({ ...localStorage }).toEqual({
                btn0: 'no',
            });
            expect(predict).toEqual({
                getPanelsState: PredictCtrl.prototype.getPanelsState,
                time: ['1'],
                timeUnit: ['secondi'],
                started: [false],
                panelsList: ['testPanelTitle'],
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

            const parIndex = 0;
            predict.startPrediction(parIndex);

            expect(mockTTM).toHaveBeenCalledTimes(1);
            expect(mockTTM).toHaveBeenCalledWith(parIndex);
            expect({ ...localStorage }).toEqual({ btn0: '1s'});
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
            });
        });
    });

    it('stopPrediction', () => {
        predict.stopPrediction = PredictCtrl.prototype.stopPrediction;
        predict.started = [true];

        const parIndex = 0;
        predict.stopPrediction(parIndex);

        expect({ ...localStorage }).toEqual({
            btn0: 'no',
        });
        expect(emitMock).toHaveBeenCalledTimes(1);
        expect(emitMock).toHaveBeenCalledWith('alert-success', ['Predizione terminata', '']);
        expect(predictLooper.stopPrediction).toHaveBeenCalledTimes(1);
        expect(predictLooper.stopPrediction).toHaveBeenCalledWith(parIndex);
        expect(predict).toEqual({
            stopPrediction: PredictCtrl.prototype.stopPrediction,
            started: [false],
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
