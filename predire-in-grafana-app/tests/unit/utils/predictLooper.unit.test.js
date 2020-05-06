/**
 * File name: influx.test.js
 * Date: 2020-04-29
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

/* eslint-disable import/named */
import PredictLooper from '../../../src/utils/predictLooper';
import BackendSrvMock from '../../../__mocks__/backendSrvMock';
import ScopeMock, { evalAsyncMock } from '../../../__mocks__/scopeMock';
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
    expect(PredictLooper).toEqual({
        $scope: null,
        backendSrv: null,
        db: [],
        predictions: [],
    });
});

describe('Testing method', () => {
    const predictLooperProto = Object.getPrototypeOf(PredictLooper);
    let predictLooper = null;
    let dash = null;
    beforeEach(() => {
        predictLooper = new (function Object() { })();
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
        predictLooper = null;
        jest.clearAllMocks();
    });

    it('setBackendSrv', () => {
        predictLooper.setBackendSrv = predictLooperProto.setBackendSrv;
        predictLooper.setConfig = jest.fn();

        const parScope = new ScopeMock();
        const parBackendSrv = new BackendSrvMock();
        predictLooper.setBackendSrv(parScope, parBackendSrv);

        expect(predictLooper.setConfig).toHaveBeenCalledTimes(1);
        expect(predictLooper).toEqual({
            $scope: parScope,
            backendSrv: parBackendSrv,
            setBackendSrv: predictLooperProto.setBackendSrv,
            setConfig: predictLooper.setConfig,
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
            predictLooper.setConfig = predictLooperProto.setConfig;
            predictLooper.backendSrv = new BackendSrvMock();
            predictLooper.$scope = new ScopeMock();
        });

        it('when dashboard.updateSettings() return true', () => {
            const fSetInflux = jest.fn();
            predictLooper.setInflux = fSetInflux;
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

            predictLooper.setConfig();

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
            expect(evalAsyncMock).toHaveBeenCalledTimes(2);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            expect(predictLooper).toEqual({
                $scope: new ScopeMock(),
                backendSrv: new BackendSrvMock(),
                grafana: new GrafanaApiQuery(),
                setConfig: predictLooperProto.setConfig,
                setInflux: fSetInflux,
                variables: 'testVariable1',
            });
        });

        it('when dashboard.updateSettings() return false', () => {
            const fSetInflux = jest.fn();
            predictLooper.setInflux = fSetInflux;
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

            predictLooper.setConfig();

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
            expect(evalAsyncMock).toHaveBeenCalledTimes(1);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            expect(predictLooper).toEqual({
                $scope: new ScopeMock(),
                backendSrv: new BackendSrvMock(),
                grafana: new GrafanaApiQuery(),
                setConfig: predictLooperProto.setConfig,
                setInflux: fSetInflux,
                variables: 'testVariable1',
            });
        });
    });

    it('setInflux', () => {
        predictLooper.setInflux = predictLooperProto.setInflux;
        predictLooper.variables = [...dash.dashboard.templating.list];
        predictLooper.db = [];

        predictLooper.setInflux();

        const expDB = [];
        predictLooper.variables.forEach((variable) => {
            expDB.push(
                new Influx(
                    variable.query.host,
                    parseInt(variable.query.port, 10),
                    variable.query.database,
                ),
            );
        });
        expect(predictLooper).toEqual({
            db: expDB,
            variables: dash.dashboard.templating.list,
            setInflux: predictLooperProto.setInflux,
        });
    });

    it('dbWrite', () => {
        predictLooper.dbWrite = predictLooperProto.dbWrite;
        predictLooper.variables = [...dash.dashboard.templating.list];
        const expDB = [];
        predictLooper.variables.forEach((variable) => {
            expDB.push(
                new Influx(
                    variable.query.host,
                    parseInt(variable.query.port, 10),
                    variable.query.database,
                ),
            );
        });
        predictLooper.db = expDB;

        const parInfo = 'Info';
        const parIndex = 0;
        predictLooper.dbWrite(parInfo, parIndex);

        expect(predictLooper.db[parIndex].storeValue).toHaveBeenCalledTimes(1);
        expect(predictLooper.db[parIndex].storeValue)
            .toHaveBeenCalledWith('predizione' + dash.dashboard.templating.list[parIndex].name,
                parInfo);
        expect(predictLooper).toEqual({
            db: expDB,
            variables: dash.dashboard.templating.list,
            dbWrite: predictLooperProto.dbWrite,
        });
    });

    describe('startPrediction', () => {
        it('with predictions[index] defined', () => {
            jest.useFakeTimers();
            predictLooper.startPrediction = predictLooperProto.startPrediction;
            predictLooper.predictions = [1];
            const dbWriteMock = jest.fn();
            predictLooper.dbWrite = dbWriteMock;
            const getPredictionMock = jest.fn(() => 1);
            predictLooper.getPrediction = getPredictionMock;

            const parIndex = 0;
            const parRefreshTime = 1000;
            predictLooper.startPrediction(parIndex, parRefreshTime);

            expect(setInterval).not.toHaveBeenCalled();
            expect(dbWriteMock).not.toHaveBeenCalled();
            jest.advanceTimersByTime(parRefreshTime);
            expect(dbWriteMock).not.toHaveBeenCalled();
            expect(getPredictionMock).not.toHaveBeenCalled();
            expect(predictLooper).toEqual({
                predictions: [1],
                dbWrite: dbWriteMock,
                getPrediction: getPredictionMock,
                startPrediction: predictLooperProto.startPrediction,
            });
        });

        it('with predictions[index] undefined', () => {
            jest.useFakeTimers();
            predictLooper.startPrediction = predictLooperProto.startPrediction;
            predictLooper.predictions = [];
            const dbWriteMock = jest.fn();
            predictLooper.dbWrite = dbWriteMock;
            const getPredictionMock = jest.fn(() => 1);
            predictLooper.getPrediction = getPredictionMock;

            const parIndex = 0;
            const parRefreshTime = 1000;
            predictLooper.startPrediction(parIndex, parRefreshTime);

            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), parRefreshTime);
            expect(dbWriteMock).not.toHaveBeenCalled();
            jest.advanceTimersByTime(parRefreshTime);
            expect(dbWriteMock).toHaveBeenCalledTimes(1);
            expect(dbWriteMock).toHaveBeenLastCalledWith(getPredictionMock(), parIndex);
            expect(getPredictionMock).toHaveBeenCalledTimes(2);
            expect(getPredictionMock).toHaveBeenCalledWith(parIndex);
            expect(predictLooper).toEqual({
                predictions: [1],
                dbWrite: dbWriteMock,
                getPrediction: getPredictionMock,
                startPrediction: predictLooperProto.startPrediction,
            });
        });
    });

    it('stopPrediction', () => {
        predictLooper.stopPrediction = predictLooperProto.stopPrediction;
        const predictionMock = [1, 2];
        predictLooper.predictions = [...predictionMock];

        const parIndex = 0;
        predictLooper.stopPrediction(parIndex);

        expect(clearInterval).toHaveBeenCalledTimes(1);
        expect(clearInterval).toHaveBeenCalledWith(predictionMock[parIndex]);
        expect(predictLooper.predictions[parIndex]).toEqual(undefined);
        expect(predictLooper).toEqual({
            predictions: [
                undefined,
                2,
            ],
            stopPrediction: predictLooperProto.stopPrediction,
        });
    });

    describe('getPrediction', () => {
        beforeEach(() => {
            predictLooper.getPrediction = predictLooperProto.getPrediction;
            predictLooper.variables = [...dash.dashboard.templating.list];
        });

        afterEach(() => {
            getLastValueMock.mockReset();
        });

        it('with model SVM', () => {
            const oldDB = [new Influx()];
            predictLooper.db = [...oldDB];
            const predictSVMMock = jest.fn(() => 1);
            predictLooper.predictSVM = predictSVMMock;
            getLastValueMock.mockImplementation(() => [0, 0]);


            const parIndex = 0;
            const returnValue = predictLooper.getPrediction(parIndex);

            expect(returnValue).toEqual(1);
            expect(getLastValueMock)
                .toHaveBeenCalledTimes(dash.dashboard.templating.list[parIndex].query.predittore.D);
            getLastValueMock.mockClear();
            const expPoint = [];
            for (let i = 0; i < dash.dashboard.templating.list[parIndex].query.predittore.D; i++) {
                expPoint.push(oldDB[parIndex].getLastValue());
            }
            expect(predictLooper.predictSVM).toHaveBeenCalledTimes(1);
            expect(predictLooper.predictSVM)
                .toHaveBeenCalledWith(dash.dashboard.templating.list[parIndex].query.predittore,
                    expPoint);
            expect(predictLooper).toEqual({
                variables: dash.dashboard.templating.list,
                getPrediction: predictLooperProto.getPrediction,
                db: oldDB,
                predictSVM: predictSVMMock,
            });
        });

        it('with model RL', () => {
            const oldDB = [undefined, new Influx()];
            predictLooper.db = [...oldDB];
            const predictRLMock = jest.fn(() => 1);
            predictLooper.predictRL = predictRLMock;

            const parIndex = 1;
            const returnValue = predictLooper.getPrediction(parIndex);

            expect(returnValue).toEqual(1);
            expect(getLastValueMock)
                .toHaveBeenCalledTimes(dash.dashboard.templating.list[parIndex].query.predittore.D);
            getLastValueMock.mockClear();
            const expPoint = [];
            for (let i = 0; i < dash.dashboard.templating.list[parIndex].query.predittore.D; i++) {
                expPoint.push(oldDB[parIndex].getLastValue());
            }
            expect(predictLooper.predictRL).toHaveBeenCalledTimes(1);
            expect(predictLooper.predictRL)
                .toHaveBeenCalledWith(dash.dashboard.templating.list[parIndex].query.predittore,
                    expPoint);
            expect(predictLooper).toEqual({
                variables: dash.dashboard.templating.list,
                getPrediction: predictLooperProto.getPrediction,
                db: oldDB,
                predictRL: predictRLMock,
            });
        });
    });

    it('predictSVM', () => {
        predictLooper.predictSVM = predictLooperProto.predictSVM;

        const parPredictor = {
            D: 4,
        };
        const parPoint = [0, 0];
        const returnValue = predictLooper.predictSVM({ ...parPredictor }, [...parPoint]);

        expect(returnValue).toEqual(1);
        expect(SVM).toHaveBeenCalledTimes(1);
        expect(fromJSONMockSVM).toHaveBeenCalledTimes(1);
        expect(fromJSONMockSVM).toHaveBeenCalledWith(parPredictor);
        expect(predictClassMockSVM).toHaveBeenCalledTimes(1);
        expect(predictClassMockSVM).toHaveBeenCalledWith(parPoint);
        expect(predictLooper).toEqual({
            predictSVM: predictLooperProto.predictSVM,
        });
    });

    it('predictRL', () => {
        predictLooper.predictRL = predictLooperProto.predictRL;

        const parPredictor = {
            D: 5,
        };
        const parPoint = [0, 0];
        const returnValue = predictLooper.predictRL({ ...parPredictor }, [...parPoint]);

        expect(returnValue).toEqual(1);
        expect(RL).toHaveBeenCalledTimes(1);
        expect(RL).toHaveBeenCalledWith({ numX: parPredictor.D, numY: 1 });
        expect(fromJSONMockRL).toHaveBeenCalledTimes(1);
        expect(fromJSONMockRL).toHaveBeenCalledWith(parPredictor);
        expect(predictMockRL).toHaveBeenCalledTimes(1);
        expect(predictMockRL).toHaveBeenCalledWith(parPoint);
        expect(predictLooper).toEqual({
            predictRL: predictLooperProto.predictRL,
        });
    });
});
