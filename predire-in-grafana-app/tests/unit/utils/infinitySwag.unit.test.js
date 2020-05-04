/**
 * File name: influx.test.js
 * Date: 2020-04-29
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

/* eslint-disable import/named */
import InfinitySwag from '../../../src/utils/infinitySwag';
import BackendSrvMock from '../../../__mocks__/backendSrvMock';
import ScopeMock, { $evalAsyncMock } from '../../../__mocks__/scopeMock';
import Influx, { getLastValueMock } from '../../../src/utils/influx';
import GrafanaApiQuery, { getDashboardMock, postDashboardMock }
    from '../../../src/utils/grafana_query';
import Dashboard, { getJSONMock, updateSettingsMock } from '../../../src/utils/dashboard';
import SVM, { fromJSONMock as fromJSONMockSVM, predictClassMock as predictClassMockSVM }
    from '../../../src/utils/models/SVM_Adapter';
import RL, { fromJSONMock as fromJSONMockRL, predictMock as predictMockRL }
    from '../../../src/utils/models/RL_Adapter';

jest.mock('../../../src/utils/influx');
jest.mock('../../../src/utils/grafana_query');
jest.mock('../../../src/utils/models/SVM_Adapter');
jest.mock('../../../src/utils/models/RL_Adapter');
jest.mock('../../../src/utils/dashboard');

it('Testing exported object', () => {
    expect(InfinitySwag).toEqual({
        $scope: null,
        backendSrv: null,
        db: [],
        predictions: [],
    });
});

describe('Testing method', () => {
    const infinitySwagProto = Object.getPrototypeOf(InfinitySwag);
    let infinitySwag = null;
    let dash = null;
    beforeEach(() => {
        infinitySwag = new (function Object() { })();
        dash = {
            dashboard: {
                templating: {
                    list: [{
                        query: {
                            name: 'TestQueryName1',
                            host: 'TestQueryHost1',
                            port: '1000',
                            database: 'TestQueryDatabase1',
                            sources: [],
                            instances: [],
                            params: [],
                            model: 'SVM',
                            predittore: {
                                D: 1,
                            },
                        },
                    }, {
                        query: {
                            name: 'TestQueryName2',
                            host: 'TestQueryHost2',
                            port: '1000',
                            database: 'TestQueryDatabase2',
                            sources: [],
                            instances: [],
                            params: [],
                            model: 'RL',
                            predittore: {
                                D: 1,
                            },
                        },
                    }],
                },
            },
        };
    });

    afterEach(() => {
        infinitySwag = null;
        jest.clearAllMocks();
    });

    it('setBackendSrv', () => {
        infinitySwag.setBackendSrv = infinitySwagProto.setBackendSrv;
        infinitySwag.setConfig = jest.fn();

        const parScope = new ScopeMock();
        const parBackendSrv = new BackendSrvMock();
        infinitySwag.setBackendSrv(parScope, parBackendSrv);

        expect(infinitySwag.setConfig).toHaveBeenCalledTimes(1);
        expect(infinitySwag).toEqual({
            $scope: parScope,
            backendSrv: parBackendSrv,
            setBackendSrv: infinitySwagProto.setBackendSrv,
            setConfig: infinitySwag.setConfig,
        });
    });

    describe('setConfig', () => {
        const oldDash = {
            dashboard: {
                templating: {
                    list: [{
                        query: {
                            name: 'TestQueryName1',
                            host: 'TestQueryHost1',
                            port: '1000',
                            database: 'TestQueryDatabase1',
                            sources: [],
                            instances: [],
                            params: [],
                            model: 'SVM',
                            predittore: {
                                D: 1,
                            },
                        },
                    }, {
                        query: {
                            name: 'TestQueryName2',
                            host: 'TestQueryHost2',
                            port: '1000',
                            database: 'TestQueryDatabase2',
                            sources: [],
                            instances: [],
                            params: [],
                            model: 'RL',
                            predittore: {
                                D: 1,
                            },
                        },
                    }],
                },
            },
        };
        beforeEach(() => {
            infinitySwag.setConfig = infinitySwagProto.setConfig;
            infinitySwag.backendSrv = new BackendSrvMock();
            infinitySwag.$scope = new ScopeMock();
        });

        it('when dashboard.updateSettings() return true', () => {
            const fSetInflux = jest.fn();
            infinitySwag.setInflux = fSetInflux;
            const getThenMock = jest.fn((fun) => {
                fun(dash);
            });
            getDashboardMock.mockImplementationOnce(() => ({
                then: getThenMock,
            }));
            updateSettingsMock.mockImplementationOnce(() => true);
            getJSONMock.mockImplementationOnce(() => ({
                templating: {
                    list: 'testVariable1',
                },
            }));
            const postThenMock = jest.fn((fun) => {
                fun();
            });
            postDashboardMock.mockImplementationOnce(() => ({
                then: postThenMock,
            }));
            getJSONMock.mockImplementationOnce(() => ({
                templating: {
                    list: 'testVariable2',
                },
            }));

            infinitySwag.setConfig();

            expect(getDashboardMock).toHaveBeenCalledTimes(1);
            expect(getDashboardMock).toHaveBeenCalledWith('predire-in-grafana');
            expect(getThenMock).toHaveBeenCalledTimes(1);
            expect(getThenMock).toHaveBeenCalledWith(expect.any(Function));
            expect(Dashboard).toHaveBeenCalledTimes(1);
            expect(Dashboard).toHaveBeenCalledWith(oldDash.dashboard);
            expect(updateSettingsMock).toHaveBeenCalledTimes(1);
            expect(updateSettingsMock).toHaveBeenCalledWith();
            expect(postDashboardMock).toHaveBeenCalledTimes(1);
            expect(getJSONMock).toHaveBeenCalledTimes(2);
            expect(getJSONMock).toHaveBeenCalledWith();
            expect(postDashboardMock).toHaveBeenCalledWith({
                templating: {
                    list: 'testVariable2',
                },
            });
            expect(postThenMock).toHaveBeenCalledTimes(1);
            expect(postThenMock).toHaveBeenCalledWith(expect.any(Function));
            expect(fSetInflux).toHaveBeenCalledTimes(1);
            expect(fSetInflux).toHaveBeenCalledWith();
            expect($evalAsyncMock).toHaveBeenCalledTimes(2);
            expect($evalAsyncMock).toHaveBeenCalledWith();
            expect(infinitySwag).toEqual({
                $scope: new ScopeMock(),
                backendSrv: new BackendSrvMock(),
                grafana: new GrafanaApiQuery(),
                setConfig: infinitySwagProto.setConfig,
                setInflux: fSetInflux,
                variables: 'testVariable1',
            });
        });

        it('when dashboard.updateSettings() return false', () => {
            const fSetInflux = jest.fn();
            infinitySwag.setInflux = fSetInflux;
            const getThenMock = jest.fn((fun) => {
                fun(dash);
            });
            getDashboardMock.mockImplementationOnce(() => ({
                then: getThenMock,
            }));
            updateSettingsMock.mockImplementationOnce(() => false);
            getJSONMock.mockImplementationOnce(() => ({
                templating: {
                    list: 'testVariable1',
                },
            }));

            infinitySwag.setConfig();

            expect(getDashboardMock).toHaveBeenCalledTimes(1);
            expect(getDashboardMock).toHaveBeenCalledWith('predire-in-grafana');
            expect(getThenMock).toHaveBeenCalledTimes(1);
            expect(getThenMock).toHaveBeenCalledWith(expect.any(Function));
            expect(Dashboard).toHaveBeenCalledTimes(1);
            expect(Dashboard).toHaveBeenCalledWith(oldDash.dashboard);
            expect(updateSettingsMock).toHaveBeenCalledTimes(1);
            expect(updateSettingsMock).toHaveBeenCalledWith();
            expect(getJSONMock).toHaveBeenCalledTimes(1);
            expect(getJSONMock).toHaveBeenCalledWith();
            expect(fSetInflux).toHaveBeenCalledTimes(1);
            expect(fSetInflux).toHaveBeenCalledWith();
            expect($evalAsyncMock).toHaveBeenCalledTimes(1);
            expect($evalAsyncMock).toHaveBeenCalledWith();
            expect(infinitySwag).toEqual({
                $scope: new ScopeMock(),
                backendSrv: new BackendSrvMock(),
                grafana: new GrafanaApiQuery(),
                setConfig: infinitySwagProto.setConfig,
                setInflux: fSetInflux,
                variables: 'testVariable1',
            });
        });
    });

    it('setInflux', () => {
        infinitySwag.setInflux = infinitySwagProto.setInflux;
        infinitySwag.variables = [...dash.dashboard.templating.list];
        infinitySwag.db = [];

        infinitySwag.setInflux();

        const expDB = [];
        infinitySwag.variables.forEach((variable) => {
            expDB.push(
                new Influx(
                    variable.query.host,
                    parseInt(variable.query.port, 10),
                    variable.query.database,
                ),
            );
        });
        expect(infinitySwag).toEqual({
            db: expDB,
            variables: dash.dashboard.templating.list,
            setInflux: infinitySwagProto.setInflux,
        });
    });

    it('dbWrite', () => {
        infinitySwag.dbWrite = infinitySwagProto.dbWrite;
        infinitySwag.variables = [...dash.dashboard.templating.list];
        const expDB = [];
        infinitySwag.variables.forEach((variable) => {
            expDB.push(
                new Influx(
                    variable.query.host,
                    parseInt(variable.query.port, 10),
                    variable.query.database,
                ),
            );
        });
        infinitySwag.db = expDB;

        const parInfo = 'Info';
        const parIndex = 0;
        infinitySwag.dbWrite(parInfo, parIndex);

        expect(infinitySwag.db[parIndex].storeValue).toHaveBeenCalledTimes(1);
        expect(infinitySwag.db[parIndex].storeValue)
            .toHaveBeenCalledWith('predizione' + dash.dashboard.templating.list[parIndex].name,
                parInfo);
        expect(infinitySwag).toEqual({
            db: expDB,
            variables: dash.dashboard.templating.list,
            dbWrite: infinitySwagProto.dbWrite,
        });
    });

    describe('startPrediction', () => {
        it('with predictions[index] defined', () => {
            jest.useFakeTimers();
            infinitySwag.startPrediction = infinitySwagProto.startPrediction;
            infinitySwag.predictions = [1];
            const dbWriteMock = jest.fn();
            infinitySwag.dbWrite = dbWriteMock;
            const getPredictionMock = jest.fn(() => 1);
            infinitySwag.getPrediction = getPredictionMock;

            const parIndex = 0;
            const parRefreshTime = 1000;
            infinitySwag.startPrediction(parIndex, parRefreshTime);

            expect(setInterval).not.toHaveBeenCalled();
            expect(dbWriteMock).not.toHaveBeenCalled();
            jest.advanceTimersByTime(parRefreshTime);
            expect(dbWriteMock).not.toHaveBeenCalled();
            expect(getPredictionMock).not.toHaveBeenCalled();
            expect(infinitySwag).toEqual({
                predictions: [1],
                dbWrite: dbWriteMock,
                getPrediction: getPredictionMock,
                startPrediction: infinitySwagProto.startPrediction,
            });
        });

        it('with predictions[index] undefined', () => {
            jest.useFakeTimers();
            infinitySwag.startPrediction = infinitySwagProto.startPrediction;
            infinitySwag.predictions = [];
            const dbWriteMock = jest.fn();
            infinitySwag.dbWrite = dbWriteMock;
            const getPredictionMock = jest.fn(() => 1);
            infinitySwag.getPrediction = getPredictionMock;

            const parIndex = 0;
            const parRefreshTime = 1000;
            infinitySwag.startPrediction(parIndex, parRefreshTime);

            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), parRefreshTime);
            expect(dbWriteMock).not.toHaveBeenCalled();
            jest.advanceTimersByTime(parRefreshTime);
            expect(dbWriteMock).toHaveBeenCalledTimes(1);
            expect(dbWriteMock).toHaveBeenLastCalledWith(getPredictionMock(), parIndex);
            expect(getPredictionMock).toHaveBeenCalledTimes(2);
            expect(getPredictionMock).toHaveBeenCalledWith(parIndex);
            expect(infinitySwag).toEqual({
                predictions: [1],
                dbWrite: dbWriteMock,
                getPrediction: getPredictionMock,
                startPrediction: infinitySwagProto.startPrediction,
            });
        });
    });

    it('stopPrediction', () => {
        infinitySwag.stopPrediction = infinitySwagProto.stopPrediction;
        const predictionMock = [1, 2];
        infinitySwag.predictions = [...predictionMock];

        const parIndex = 0;
        infinitySwag.stopPrediction(parIndex);

        expect(clearInterval).toHaveBeenCalledTimes(1);
        expect(clearInterval).toHaveBeenCalledWith(predictionMock[parIndex]);
        expect(infinitySwag.predictions[parIndex]).toEqual(undefined);
        expect(infinitySwag).toEqual({
            predictions: [
                undefined,
                2,
            ],
            stopPrediction: infinitySwagProto.stopPrediction,
        });
    });

    describe('getPrediction', () => {
        beforeEach(() => {
            infinitySwag.getPrediction = infinitySwagProto.getPrediction;
            infinitySwag.variables = [...dash.dashboard.templating.list];
        });

        afterEach(() => {
            getLastValueMock.mockReset();
        });

        it('with model SVM', () => {
            const oldDB = [new Influx()];
            infinitySwag.db = [...oldDB];
            const predictSVMMock = jest.fn(() => 1);
            infinitySwag.predictSVM = predictSVMMock;
            getLastValueMock.mockImplementation(() => [0, 0]);


            const parIndex = 0;
            const returnValue = infinitySwag.getPrediction(parIndex);

            expect(returnValue).toEqual(1);
            expect(getLastValueMock)
                .toHaveBeenCalledTimes(dash.dashboard.templating.list[parIndex].query.predittore.D);
            getLastValueMock.mockClear();
            const expPoint = [];
            for (let i = 0; i < dash.dashboard.templating.list[parIndex].query.predittore.D; i++) {
                expPoint.push(oldDB[parIndex].getLastValue());
            }
            expect(infinitySwag.predictSVM).toHaveBeenCalledTimes(1);
            expect(infinitySwag.predictSVM)
                .toHaveBeenCalledWith(dash.dashboard.templating.list[parIndex].query.predittore,
                    expPoint);
            expect(infinitySwag).toEqual({
                variables: dash.dashboard.templating.list,
                getPrediction: infinitySwagProto.getPrediction,
                db: oldDB,
                predictSVM: predictSVMMock,
            });
        });

        it('with model RL', () => {
            const oldDB = [undefined, new Influx()];
            infinitySwag.db = [...oldDB];
            const predictRLMock = jest.fn(() => 1);
            infinitySwag.predictRL = predictRLMock;

            const parIndex = 1;
            const returnValue = infinitySwag.getPrediction(parIndex);

            expect(returnValue).toEqual(1);
            expect(getLastValueMock)
                .toHaveBeenCalledTimes(dash.dashboard.templating.list[parIndex].query.predittore.D);
            getLastValueMock.mockClear();
            const expPoint = [];
            for (let i = 0; i < dash.dashboard.templating.list[parIndex].query.predittore.D; i++) {
                expPoint.push(oldDB[parIndex].getLastValue());
            }
            expect(infinitySwag.predictRL).toHaveBeenCalledTimes(1);
            expect(infinitySwag.predictRL)
                .toHaveBeenCalledWith(dash.dashboard.templating.list[parIndex].query.predittore,
                    expPoint);
            expect(infinitySwag).toEqual({
                variables: dash.dashboard.templating.list,
                getPrediction: infinitySwagProto.getPrediction,
                db: oldDB,
                predictRL: predictRLMock,
            });
        });
    });

    it('predictSVM', () => {
        infinitySwag.predictSVM = infinitySwagProto.predictSVM;

        const parPredictor = {
            D: 4,
        };
        const parPoint = [0, 0];
        const returnValue = infinitySwag.predictSVM({ ...parPredictor }, [...parPoint]);

        expect(returnValue).toEqual(1);
        expect(SVM).toHaveBeenCalledTimes(1);
        expect(fromJSONMockSVM).toHaveBeenCalledTimes(1);
        expect(fromJSONMockSVM).toHaveBeenCalledWith(parPredictor);
        expect(predictClassMockSVM).toHaveBeenCalledTimes(1);
        expect(predictClassMockSVM).toHaveBeenCalledWith(parPoint);
        expect(infinitySwag).toEqual({
            predictSVM: infinitySwagProto.predictSVM,
        });
    });

    it('predictRL', () => {
        infinitySwag.predictRL = infinitySwagProto.predictRL;

        const parPredictor = {
            D: 5,
        };
        const parPoint = [0, 0];
        const returnValue = infinitySwag.predictRL({ ...parPredictor }, [...parPoint]);

        expect(returnValue).toEqual(1);
        expect(RL).toHaveBeenCalledTimes(1);
        expect(RL).toHaveBeenCalledWith({ numX: parPredictor.D, numY: 1 });
        expect(fromJSONMockRL).toHaveBeenCalledTimes(1);
        expect(fromJSONMockRL).toHaveBeenCalledWith(parPredictor);
        expect(predictMockRL).toHaveBeenCalledTimes(1);
        expect(predictMockRL).toHaveBeenCalledWith(parPoint);
        expect(infinitySwag).toEqual({
            predictRL: infinitySwagProto.predictRL,
        });
    });
});
