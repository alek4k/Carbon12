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


import { emitMock } from 'grafana/app/core/core';
import BackendSrvMock, {getMock, postMock} from '../../../__mocks__/backendSrvMock';
import ScopeMock, { evalAsyncMock } from '../../../__mocks__/scopeMock';
import LocationMock from '../../../__mocks__/locationMock';
import PredictCtrl from '../../../src/components/predict';
import GrafanaApiQuery from '../../../src/utils/grafana_query';
import predictLooper from '../../../src/utils/predictLooper';
import Dashboard from '../../../src/utils/dashboard';


afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

it('Testing constructor', () => {
    const parLocation = new LocationMock();
    const parScope = new ScopeMock();
    const parBackendSrv = new BackendSrvMock();
    const predict = new PredictCtrl(parLocation, parScope, parBackendSrv);

    expect(predict).toEqual({
        $location: new LocationMock(),
        $scope: new ScopeMock(),
        backendSrv: new BackendSrvMock(),
        grafana: new GrafanaApiQuery(new BackendSrvMock()),
        toRemove: -1,
    });
});

describe('Testing method', () => {
    let predict;
    beforeEach(() => {
        const parLocation = new LocationMock();
        const parScope = new ScopeMock();
        const parBackendSrv = new BackendSrvMock();
        predict = new PredictCtrl(parLocation, parScope, parBackendSrv);
    });

    describe.only('verifyDashboard', () => {
        describe('when dashboardExists is true', () => {
            beforeEach(() => {
                getMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const dbList = [{ uid: 'carbon12' }, { uid: 'altro' }];
                        fun(dbList);
                    },
                }));
            });

            it('when dashboardEmpty is true', () => {
                getMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const db = {
                            dashboard: {
                                panels: [],
                                refresh: '5s',
                                tags: [
                                    'Carbon12',
                                ],
                                templating: {
                                    list: [{
                                        name: 1,
                                        query: JSON.stringify({
                                            started: 'no',
                                        }),
                                    }],
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
                        };
                        fun(db);
                    },
                }));
                getMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const db = {
                            dashboard: {
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
                        };
                        fun(db);
                    },
                }));

                predict.verifyDashboard();

                expect(getMock).toHaveBeenCalledTimes(4);
                expect(evalAsyncMock).toHaveBeenCalledTimes(2);
                expect(evalAsyncMock).toHaveBeenCalledWith();
                expect(predict).toEqual({
                    grafana: new GrafanaApiQuery(new BackendSrvMock()),
                    $scope: new ScopeMock(),
                    backendSrv: new BackendSrvMock(),
                    $location: new LocationMock(),
                    dashboardEmpty: true,
                    dashboardExists: true,
                    dashboard: new Dashboard(),
                    toRemove: -1,
                });
            });

            it('when dashboardEmpty is false', () => {
                getMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const db = {
                            dashboard: {
                                panels: [{ id: 1 }],
                                refresh: '5s',
                                tags: [
                                    'Carbon12',
                                ],
                                templating: {
                                    list: [{
                                        name: 1,
                                        query: JSON.stringify({
                                            started: 'no',
                                        }),
                                    }],
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
                        };
                        fun(db);
                    },
                }));
                getMock.mockImplementationOnce(() => ({
                    then: (fun) => {
                        const db = {
                            dashboard: {
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
                        };
                        fun(db);
                    },
                }));

                predict.verifyDashboard();

                expect(getMock).toHaveBeenCalledTimes(4);
                expect(evalAsyncMock).toHaveBeenCalledTimes(4);
                expect(evalAsyncMock).toHaveBeenCalledWith();
                console.log(predict.dashboard);
                expect(predict).toEqual({
                    grafana: new GrafanaApiQuery(new BackendSrvMock()),
                    $scope: new ScopeMock(),
                    backendSrv: new BackendSrvMock(),
                    $location: new LocationMock(),
                    dashboardEmpty: false,
                    dashboardExists: true,
                    dashboard: expect.any(Object),
                    toRemove: -1,
                    panelsList: [undefined],
                    started: [false],
                    time: ['1'],
                    timeUnit: ['secondi'],
                });
            });
        });

        it('when dashboardExists is false', () => {
            getMock.mockImplementationOnce(() => ({
                then: (fun) => {
                    const dbList = [{ uid: 'altro2' }, { uid: 'altro1' }];
                    fun(dbList);
                },
            }));

            predict.verifyDashboard();

            expect(getMock).toHaveBeenCalledTimes(3);
            expect(evalAsyncMock).toHaveBeenCalledTimes(1);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            console.log(predict.dashboard);
            expect(predict).toEqual({
                grafana: new GrafanaApiQuery(new BackendSrvMock()),
                $scope: new ScopeMock(),
                backendSrv: new BackendSrvMock(),
                $location: new LocationMock(),
                dashboardExists: false,
                toRemove: -1,
            });
        });
    });
});
