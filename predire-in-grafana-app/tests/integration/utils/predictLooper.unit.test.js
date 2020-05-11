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
import BackendSrvMock, { getMock, postMock } from '../../../__mocks__/backendSrvMock';
import ScopeMock, { evalAsyncMock } from '../../../__mocks__/scopeMock';
import Influx from '../../../src/utils/influx';
import GrafanaApiQuery from '../../../src/utils/grafana_query';
import SVM, { predictClassMock, fromJSONMock as fromJSONMockSVM }
    from '../../../src/utils/models/svm/svm';
import RL, { predictMock, fromJSONMock as fromJSONMockRL }
    from '../../../src/utils/models/rl/regression';

jest.mock('../../../src/utils/models/svm/svm');
jest.mock('../../../src/utils/models/rl/regression');

describe('Testing method', () => {
    const PredictLooperProto = Object.getPrototypeOf(PredictLooper);
    let predictLooper = null;
    let dash = null;
    beforeEach(() => {
        predictLooper = new PredictLooperProto.constructor();
        dash = {
            dashboard: {
                templating: {
                    list: [{
                        query: JSON.stringify({
                            name: '1',
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
                        }),
                    }, {
                        query: JSON.stringify({
                            name: '2',
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
                        }),
                    }],
                },
                panels: [],
            },
        };
    });

    afterEach(() => {
        predictLooper = null;
        jest.clearAllMocks();
    });

    it('setBackendSrv', () => {
        getMock.mockReturnValueOnce({
            then: (fun) => fun(dash),
        });

        const parScope = new ScopeMock();
        const parBackendSrv = new BackendSrvMock();
        predictLooper.setBackendSrv(parScope, parBackendSrv);

        expect(predictLooper).toEqual({
            $scope: parScope,
            backendSrv: parBackendSrv,
            grafana: new GrafanaApiQuery(new BackendSrvMock()),
            predictions: [],
            variables: [],
            db: [],
        });
    });

    describe('setConfig', () => {
        beforeEach(() => {
            predictLooper.backendSrv = new BackendSrvMock();
            predictLooper.$scope = new ScopeMock();
        });

        it('when dashboard.updateSettings() return true', () => {
            const getThenMock = jest.fn((fun) => {
                fun(dash);
            });
            const postThenMock = jest.fn((fun) => {
                fun();
            });
            getMock.mockReturnValueOnce({
                then: getThenMock,
            });
            postMock.mockReturnValueOnce({
                then: postThenMock,
            });

            predictLooper.setConfig();

            expect(getThenMock).toHaveBeenCalledTimes(1);
            expect(getThenMock).toHaveBeenCalledWith(expect.any(Function));
            expect(postThenMock).toHaveBeenCalledTimes(1);
            expect(postThenMock).toHaveBeenCalledWith(expect.any(Function));
            expect(evalAsyncMock).toHaveBeenCalledTimes(2);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            expect(predictLooper).toEqual({
                $scope: new ScopeMock(),
                backendSrv: new BackendSrvMock(),
                grafana: new GrafanaApiQuery(new BackendSrvMock()),
                variables: [],
                predictions: [],
                db: [],
            });
        });

        it('when dashboard.updateSettings() return false', () => {
            dash.dashboard.templating.list = [];
            const getThenMock = jest.fn((fun) => {
                fun(dash);
            });
            getMock.mockReturnValueOnce({
                then: getThenMock,
            });

            predictLooper.setConfig();

            expect(getThenMock).toHaveBeenCalledTimes(1);
            expect(getThenMock).toHaveBeenCalledWith(expect.any(Function));
            expect(evalAsyncMock).toHaveBeenCalledTimes(1);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            expect(predictLooper).toEqual({
                $scope: new ScopeMock(),
                backendSrv: new BackendSrvMock(),
                grafana: new GrafanaApiQuery(new BackendSrvMock()),
                variables: [],
                predictions: [],
                db: [],
            });
        });
    });

    it('setInflux', () => {
        predictLooper.variables = [...dash.dashboard.templating.list];

        predictLooper.setInflux();

        const expDB = [];
        predictLooper.variables.forEach((variable) => {
            expDB.push(
                new Influx(
                    JSON.parse(variable.query).host,
                    parseInt(JSON.parse(variable.query).port, 10),
                    JSON.parse(variable.query).database,
                ),
            );
        });
        expect(predictLooper).toEqual({
            db: expDB,
            variables: dash.dashboard.templating.list,
            $scope: null,
            backendSrv: null,
            predictions: [],
        });
    });

    it('dbWrite', () => {
        predictLooper.variables = [...dash.dashboard.templating.list];
        const expDB = [];
        predictLooper.variables.forEach((variable) => {
            expDB.push(
                new Influx(
                    JSON.parse(variable.query).host,
                    parseInt(JSON.parse(variable.query).port, 10),
                    JSON.parse(variable.query).database,
                ),
            );
        });
        predictLooper.db = expDB;

        const parInfo = 'Info';
        const parIndex = 0;
        predictLooper.dbWrite(parInfo, parIndex);

        expect(predictLooper).toEqual({
            $scope: null,
            backendSrv: null,
            db: expDB,
            variables: [...dash.dashboard.templating.list],
            predictions: [],
        });
    });

    describe('startPrediction', () => {
        it('with predictions[index] defined', () => {
            jest.useFakeTimers();
            predictLooper.predictions = [1];

            const parIndex = 0;
            const parRefreshTime = 1000;
            predictLooper.startPrediction(parIndex, parRefreshTime);

            expect(setInterval).not.toHaveBeenCalled();
            jest.advanceTimersByTime(parRefreshTime);
            expect(predictLooper).toEqual({
                $scope: null,
                backendSrv: null,
                predictions: [1],
            });
        });

        it('with predictions[index] undefined', () => {
            jest.useFakeTimers();
            predictLooper.predictions = [];
            predictLooper.variables = [...dash.dashboard.templating.list];
            const expDB = [];
            predictLooper.variables.forEach((variable) => {
                expDB.push(
                    new Influx(
                        JSON.parse(variable.query).host,
                        parseInt(JSON.parse(variable.query).port, 10),
                        JSON.parse(variable.query).database,
                    ),
                );
            });
            predictLooper.db = expDB;
            const parIndex = 0;
            const parRefreshTime = 1000;

            predictLooper.startPrediction(parIndex, parRefreshTime);

            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), parRefreshTime);
            jest.advanceTimersByTime(parRefreshTime);
            expect(predictLooper).toEqual({
                $scope: null,
                backendSrv: null,
                predictions: [1],
                variables: [...dash.dashboard.templating.list],
                db: expDB,
            });
        });
    });

    it('stopPrediction', () => {
        jest.useFakeTimers();
        predictLooper.predictions = [];
        predictLooper.predictions[0] = setInterval(() => {
        }, 100);

        const parIndex = 0;
        predictLooper.stopPrediction(parIndex);

        expect(clearInterval).toHaveBeenCalledTimes(1);
        expect(clearInterval).toHaveBeenCalledWith(2);
        expect(predictLooper.predictions[parIndex]).toEqual(undefined);
        expect(predictLooper).toEqual({
            $scope: null,
            backendSrv: null,
            predictions: [
                undefined,
            ],
        });
    });

    describe('getPrediction', () => {
        beforeEach(() => {
            predictLooper.variables = [...dash.dashboard.templating.list];
        });

        it('with model SVM', () => {
            const expDB = [];
            predictLooper.variables.forEach((variable) => {
                expDB.push(
                    new Influx(
                        JSON.parse(variable.query).host,
                        parseInt(JSON.parse(variable.query).port, 10),
                        JSON.parse(variable.query).database,
                    ),
                );
            });
            predictLooper.db = expDB;
            predictClassMock.mockReturnValueOnce(1);

            const parIndex = 0;
            const returnValue = predictLooper.getPrediction(parIndex);


            expect(returnValue).toEqual(1);
            expect(predictClassMock).toHaveBeenCalledTimes(1);
            expect(predictLooper).toEqual({
                $scope: null,
                backendSrv: null,
                db: expDB,
                variables: [...dash.dashboard.templating.list],
                predictions: [],
            });
        });

        it('with model RL', () => {
            const expDB = [];
            predictLooper.variables.forEach((variable) => {
                expDB.push(
                    new Influx(
                        JSON.parse(variable.query).host,
                        parseInt(JSON.parse(variable.query).port, 10),
                        JSON.parse(variable.query).database,
                    ),
                );
            });
            predictLooper.db = expDB;
            predictMock.mockReturnValueOnce(1);

            const parIndex = 1;
            const returnValue = predictLooper.getPrediction(parIndex);

            expect(returnValue).toEqual(1);
            expect(predictMock).toHaveBeenCalledTimes(1);
            expect(predictLooper).toEqual({
                $scope: null,
                backendSrv: null,
                db: expDB,
                variables: [...dash.dashboard.templating.list],
                predictions: [],
            });
        });
    });

    it('predictSVM', () => {
        predictClassMock.mockReturnValueOnce(1);

        const parPredictor = {
            D: 4,
        };
        const parPoint = [0, 0];
        const returnValue = predictLooper.predictSVM({ ...parPredictor }, [...parPoint]);

        expect(returnValue).toEqual(1);
        expect(SVM).toHaveBeenCalledTimes(1);
        expect(fromJSONMockSVM).toHaveBeenCalledTimes(1);
        expect(fromJSONMockSVM).toHaveBeenCalledWith(parPredictor);
        expect(predictClassMock).toHaveBeenCalledTimes(1);
        expect(predictClassMock).toHaveBeenCalledWith(parPoint);
        expect(predictLooper).toEqual({
            $scope: null,
            backendSrv: null,
            predictions: [],
        });
    });

    it('predictRL', () => {
        predictMock.mockReturnValueOnce(1);

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
        expect(predictMock).toHaveBeenCalledTimes(1);
        expect(predictMock).toHaveBeenCalledWith(parPoint);
        expect(predictLooper).toEqual({
            $scope: null,
            backendSrv: null,
            predictions: [],
        });
    });
});
