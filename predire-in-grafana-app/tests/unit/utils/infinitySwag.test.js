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

import InfinitySwag from '../../../src/utils/infinitySwag';
import BackendSrvMock from '../../../__mocks__/backendSrvMock';
import ScopeMock from '../../../__mocks__/scopeMock';
import Influx, { getLastValueMock } from '../../../src/utils/influx';
import GrafanaApiQuery, { dash, getDashboardMock } from '../../../src/utils/grafana_query';
import SVM, { fromJSONMock as fromJSONMockSVM, predictClassMock as predictClassMockSVM} from '../../../src/utils/models/SVM_Adapter';
import RL, { fromJSONMock as fromJSONMockRL, predictMock as predictMockRL }from '../../../src/utils/models/RL_Adapter';

jest.mock('../../../src/utils/influx');
jest.mock('../../../src/utils/grafana_query');
jest.mock('../../../src/utils/models/SVM_Adapter');
jest.mock('../../../src/utils/models/RL_Adapter');

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

    beforeEach(() => {
        jest.useFakeTimers();
        getLastValueMock.mockClear();
        infinitySwag = new (function c() { })();
    });

    afterEach(() => {
        infinitySwag = null;
    });

    it('setBackendSrv', () => {
        infinitySwag.setBackendSrv = infinitySwagProto.setBackendSrv;
        infinitySwag.setConfig = jest.fn();

        const parScope = new ScopeMock();
        const parBackendSrv = new BackendSrvMock();
        infinitySwag.setBackendSrv(parScope, parBackendSrv);

        expect(infinitySwag).toEqual({
            $scope: parScope,
            backendSrv: parBackendSrv,
            setBackendSrv: infinitySwagProto.setBackendSrv,
            setConfig: infinitySwag.setConfig,
        });
        expect(infinitySwag.setConfig).toHaveBeenCalledTimes(1);
    });

    it('setConfig', () => {
        infinitySwag.setConfig = infinitySwagProto.setConfig;
        infinitySwag.backendSrv = new BackendSrvMock();
        infinitySwag.setInflux = jest.fn();
        infinitySwag.$scope = new ScopeMock();

        infinitySwag.setConfig();

        expect(infinitySwag).toEqual({
            $scope: infinitySwag.$scope,
            backendSrv: infinitySwag.backendSrv,
            grafana: new GrafanaApiQuery(infinitySwag.backendSrv),
            variables: dash.dashboard.templating.list,
            setConfig: infinitySwagProto.setConfig,
            setInflux: infinitySwag.setInflux,
        });
        expect(infinitySwag.setInflux).toHaveBeenCalledTimes(1);
        expect(infinitySwag.$scope.$evalAsync).toHaveBeenCalledTimes(1);
    });

    it('setInflux', () => {
        infinitySwag.setInflux = infinitySwagProto.setInflux;
        infinitySwag.variables = dash.dashboard.templating.list;
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
        infinitySwag.variables = dash.dashboard.templating.list;
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


        expect(infinitySwag).toEqual({
            db: expDB,
            variables: dash.dashboard.templating.list,
            dbWrite: infinitySwagProto.dbWrite,
        });
        expect(infinitySwag.db[parIndex].storeValue).toHaveBeenCalledTimes(1);
        expect(infinitySwag.db[parIndex].storeValue)
            .toHaveBeenCalledWith('predizione' + dash.dashboard.templating.list[parIndex].name,
                parInfo);
    });

    it('startPrediction', () => {
        infinitySwag.startPrediction = infinitySwagProto.startPrediction;
        infinitySwag.predictions = [];
        const dbWriteMock = jest.fn();
        infinitySwag.dbWrite = dbWriteMock;
        const getPredictionMock = jest.fn(() => 1);
        infinitySwag.getPrediction = getPredictionMock;

        const parIndex = 0;
        const parRefreshTime = 1000;
        infinitySwag.startPrediction(parIndex, parRefreshTime);

        expect(infinitySwag.predictions[parIndex]).toEqual(1);
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), parRefreshTime);
        expect(dbWriteMock).not.toHaveBeenCalled();
        jest.advanceTimersByTime(parRefreshTime);
        expect(dbWriteMock).toHaveBeenCalledTimes(1);
        expect(dbWriteMock).toHaveBeenLastCalledWith(getPredictionMock(), parIndex);
        expect(dbWriteMock).toHaveBeenCalledTimes(1);
        expect(getPredictionMock).toHaveBeenCalledWith(parIndex);
        expect(infinitySwag).toEqual({
            predictions: [1],
            dbWrite: dbWriteMock,
            getPrediction: getPredictionMock,
            startPrediction: infinitySwagProto.startPrediction,
        });
    });

    it('stopPrediction', () => {
        infinitySwag.stopPrediction = infinitySwagProto.stopPrediction;
        const predictionMock = [1, 2];
        infinitySwag.predictions = predictionMock.slice(0);

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
        it('with model SVM', () => {
            infinitySwag.getPrediction = infinitySwagProto.getPrediction;
            infinitySwag.variables = dash.dashboard.templating.list;
            const dbMock = [new Influx()];
            infinitySwag.db = dbMock;
            const predictSVMMock = jest.fn(() => 1);
            infinitySwag.predictSVM = predictSVMMock;

            const parIndex = 0;
            const returnValue = infinitySwag.getPrediction(parIndex);

            expect(returnValue).toEqual(1);
            expect(getLastValueMock)
                .toHaveBeenCalledTimes(dash.dashboard.templating.list[parIndex].query.predittore.D);
            getLastValueMock.mockClear();
            const expPoint = [];
            for (let i = 0; i < dash.dashboard.templating.list[parIndex].query.predittore.D; i++) {
                expPoint.push(dbMock[parIndex].getLastValue());
            }
            expect(infinitySwag.predictSVM).toHaveBeenCalledTimes(1);
            expect(infinitySwag.predictSVM)
                .toHaveBeenCalledWith(dash.dashboard.templating.list[parIndex].query.predittore,
                    expPoint);
            expect(infinitySwag).toEqual({
                variables: dash.dashboard.templating.list,
                getPrediction: infinitySwagProto.getPrediction,
                db: dbMock,
                predictSVM: predictSVMMock,
            });
        });

        it('with model RL', () => {
            infinitySwag.getPrediction = infinitySwagProto.getPrediction;
            infinitySwag.variables = dash.dashboard.templating.list;
            const dbMock = [undefined, new Influx()];
            infinitySwag.db = dbMock;
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
                expPoint.push(dbMock[parIndex].getLastValue());
            }
            expect(infinitySwag.predictRL).toHaveBeenCalledTimes(1);
            expect(infinitySwag.predictRL)
                .toHaveBeenCalledWith(dash.dashboard.templating.list[parIndex].query.predittore,
                    expPoint);
            expect(infinitySwag).toEqual({
                variables: dash.dashboard.templating.list,
                getPrediction: infinitySwagProto.getPrediction,
                db: dbMock,
                predictRL: predictRLMock,
            });
        });
    });

    it('predictSVM', () => {
        infinitySwag.predictSVM = infinitySwagProto.predictSVM;

        const parPredictor = {
            D: 1,
        };
        const parPoint = [0, 0];
        const returnValue = infinitySwag.predictSVM(parPredictor, parPoint);

        expect(returnValue).toEqual(1);
        expect(SVM).toHaveBeenCalledTimes(1);
        expect(fromJSONMockSVM).toHaveBeenCalledTimes(1);
        expect(fromJSONMockSVM).toHaveBeenCalledWith(parPredictor);
        expect(predictClassMockSVM).toHaveBeenCalledTimes(1);
        expect(predictClassMockSVM).toHaveBeenCalledWith(parPoint);
    });

    it('predictRL', () => {
        infinitySwag.predictRL = infinitySwagProto.predictRL;

        const parPredictor = {
            D: 1,
        };
        const parPoint = [0, 0];
        const returnValue = infinitySwag.predictRL(parPredictor, parPoint);

        expect(returnValue).toEqual(1);
        expect(RL).toHaveBeenCalledTimes(1);
        expect(RL).toHaveBeenCalledWith({ numX: parPredictor.D, numY: 1 });
        expect(fromJSONMockRL).toHaveBeenCalledTimes(1);
        expect(fromJSONMockRL).toHaveBeenCalledWith(parPredictor);
        expect(predictMockRL).toHaveBeenCalledTimes(1);
        expect(predictMockRL).toHaveBeenCalledWith(parPoint);
    });
});
