/**
 * File name: config.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import { appEvents, emitMock } from 'grafana/app/core/core'; 
import ImportCtrl from '../../../src/components/import';
import GrafanaAPI, { getDataSourcesMock, postDashboardMock } from '../../../src/utils/grafana_query';
import BackendSrvMock, { getMock, postMock } from '../../../__mocks__/backendSrvMock';
import ScopeMock, {evalAsyncMock} from '../../../__mocks__/scopeMock';
import RPredittore, {
    validityMock, getConfigurationMock, getNotesMock,
    getModelMock, getDataEntryMock
}
    from '../../../src/utils/r_predittore';

jest.mock('../../../src/utils/r_predittore');
jest.mock('../../../src/utils/grafana_query');

beforeEach(() => {
    jest.clearAllMocks();
});

it('Testing constructor', () => {
    const parLocation = '';
    const parScope = new ScopeMock();
    const parBackendSrv = new BackendSrvMock();
    const imp = new ImportCtrl(parLocation, parScope, parBackendSrv);

    expect(GrafanaAPI).toHaveBeenCalledTimes(1);
    expect(GrafanaAPI).toHaveBeenCalledWith(new BackendSrvMock());
    expect(imp).toEqual({
        $location: '',
        $scope: new ScopeMock(),
        step: 1,
        influx: null,
        grafana: new GrafanaAPI(),
    });
});

describe('Testing method', () => {
    let imp;
    beforeEach(() => {
        imp = new (function testImport() { })();
    });

    describe('onUpload', () => {
        const parJson = { jsonTest: 'test' };
        beforeEach(() => {
            imp.onUpload = ImportCtrl.prototype.onUpload;
        });

        describe('when fPredictor.validity() return true', () => {
            beforeEach(() => {
                validityMock.mockReturnValueOnce(true);
                getConfigurationMock.mockReturnValueOnce('getConfigurationMock');
                getNotesMock.mockReturnValueOnce('getNotesMock');
                getDataEntryMock.mockReturnValueOnce('getDataEntryMock');
            });

            it('with model equal SVM', () => {
                const mockLDS = jest.fn();
                imp.loadDataSources = mockLDS;
                getModelMock.mockReturnValueOnce('SVM');

                imp.onUpload(parJson);

                expect(RPredittore).toHaveBeenCalledTimes(1);
                expect(RPredittore).toHaveBeenCalledWith(parJson);
                expect(validityMock).toHaveBeenCalledTimes(1);
                expect(validityMock).toHaveBeenCalledWith();
                expect(getConfigurationMock).toHaveBeenCalledTimes(1);
                expect(getConfigurationMock).toHaveBeenCalledWith();
                expect(getNotesMock).toHaveBeenCalledTimes(1);
                expect(getNotesMock).toHaveBeenCalledWith();
                expect(getModelMock).toHaveBeenCalledTimes(1);
                expect(getModelMock).toHaveBeenCalledWith();
                expect(getDataEntryMock).toHaveBeenCalledTimes(1);
                expect(getDataEntryMock).toHaveBeenCalledWith();
                expect(imp.loadDataSources).toHaveBeenCalledTimes(1);
                expect(imp.loadDataSources).toHaveBeenCalledWith();
                expect(imp).toEqual({
                    onUpload: ImportCtrl.prototype.onUpload,
                    loadDataSources: mockLDS,
                    error: '',
                    predictor: 'getConfigurationMock',
                    notes: 'getNotesMock',
                    model: 'SVM',
                    view: 'Indicatore',
                    availableDataEntry: 'getDataEntryMock',
                });
            });

            it('with model not equal SVM', () => {
                const mockLDS = jest.fn();
                imp.loadDataSources = mockLDS;
                getModelMock.mockReturnValueOnce('altro');

                imp.onUpload(parJson);

                expect(RPredittore).toHaveBeenCalledTimes(1);
                expect(RPredittore).toHaveBeenCalledWith(parJson);
                expect(validityMock).toHaveBeenCalledTimes(1);
                expect(validityMock).toHaveBeenCalledWith();
                expect(getConfigurationMock).toHaveBeenCalledTimes(1);
                expect(getConfigurationMock).toHaveBeenCalledWith();
                expect(getNotesMock).toHaveBeenCalledTimes(1);
                expect(getNotesMock).toHaveBeenCalledWith();
                expect(getModelMock).toHaveBeenCalledTimes(1);
                expect(getModelMock).toHaveBeenCalledWith();
                expect(getDataEntryMock).toHaveBeenCalledTimes(1);
                expect(getDataEntryMock).toHaveBeenCalledWith();
                expect(imp.loadDataSources).toHaveBeenCalledTimes(1);
                expect(imp.loadDataSources).toHaveBeenCalledWith();
                expect(imp).toEqual({
                    onUpload: ImportCtrl.prototype.onUpload,
                    loadDataSources: mockLDS,
                    error: '',
                    predictor: 'getConfigurationMock',
                    notes: 'getNotesMock',
                    model: 'altro',
                    view: 'Grafico',
                    availableDataEntry: 'getDataEntryMock',
                });
            });
        });

        it('when fPredictor.validity() return false', () => {
            validityMock.mockReturnValueOnce(false);

            imp.onUpload(parJson);

            expect(RPredittore).toHaveBeenCalledTimes(1);
            expect(RPredittore).toHaveBeenCalledWith(parJson);
            expect(validityMock).toHaveBeenCalledTimes(1);
            expect(validityMock).toHaveBeenCalledWith();
            expect(getConfigurationMock).toHaveBeenCalledTimes(0);
            expect(getNotesMock).toHaveBeenCalledTimes(0);
            expect(getModelMock).toHaveBeenCalledTimes(0);
            expect(getDataEntryMock).toHaveBeenCalledTimes(0);
            expect(emitMock).toHaveBeenCalledTimes(1);
            expect(emitMock).toHaveBeenCalledWith('alert-error', ['Predittore non valido', '']);
            expect(imp).toEqual({
                onUpload: ImportCtrl.prototype.onUpload,
                error: 'Il JSON inserito non è un predittore',
            });
        });
    });

    describe.only('loadDataSources', () => {
        beforeEach(() => {
            imp.loadDataSources = ImportCtrl.prototype.loadDataSources;
            imp.grafana = new GrafanaAPI();
            imp.$scope = new ScopeMock();
            getDataSourcesMock.mockReturnValueOnce({
                then: (fun) => {
                    const dataSources = [{ name: 'a' }, { name: 'b' }];
                    fun(dataSources);
                },
            });
        });

        it('with step equal 2', () => {
            imp.step = 2;

            imp.loadDataSources();

            expect(getDataSourcesMock).toHaveBeenCalledTimes(1);
            expect(getDataSourcesMock).toHaveBeenCalledWith();
            expect(evalAsyncMock).toHaveBeenCalledTimes(1);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            expect(imp).toEqual({
                loadDataSources: ImportCtrl.prototype.loadDataSources,
                availableDataSources: ['a', 'b'],
                dataSource: '',
                newDataSource: '',
                database: '',
                host: 'http://localhost',
                port: '8086',
                grafana: new GrafanaAPI(),      
                step: 3,
                $scope: new ScopeMock(),
            });
        });

        it('with step not equal 2', () => {
            imp.step = 0;

            imp.loadDataSources();

            expect(getDataSourcesMock).toHaveBeenCalledTimes(1);
            expect(getDataSourcesMock).toHaveBeenCalledWith();
            expect(evalAsyncMock).toHaveBeenCalledTimes(1);
            expect(evalAsyncMock).toHaveBeenCalledWith();
            expect(imp).toEqual({
                loadDataSources: ImportCtrl.prototype.loadDataSources,
                availableDataSources: ['a', 'b'],
                dataSource: '',
                newDataSource: '',
                database: '',
                host: 'http://localhost',
                port: '8086',
                grafana: new GrafanaAPI(),
                step: 2,
                $scope: new ScopeMock(),
            });
        });
    });

    describe('createPanel', () => {
        beforeEach(() => {
            imp.createPanel = ImportCtrl.prototype.createPanel;
        });

        describe('when sources element are all defined', () => {
        });
    });

    it.only('saveDashboard', () => {
        imp.saveDashboard = ImportCtrl.prototype.saveDashboard;

        imp.grafana = new GrafanaAPI();
        postDashboardMock.mockReturnValueOnce({
            then: (fun) => {
                fun();
            },
        });
        const mockGetJson = jest.fn().mockReturnValueOnce('test');
        imp.dashboard = { getJSON: mockGetJson };
        const mockLocationUrl = jest.fn();
        imp.$location = { url: mockLocationUrl };
        imp.$scope = new ScopeMock();
        const mockAssign = jest.fn();
        delete window.location;
        window.location = { assign: mockAssign };

        imp.saveDashboard();

        expect(emitMock).toHaveBeenCalledTimes(1);
        expect(emitMock).toHaveBeenCalledWith('alert-success', ['Pannello creato', '']);
        expect(postDashboardMock).toHaveBeenCalledTimes(1);
        expect(postDashboardMock).toHaveBeenCalledWith('test');
        expect(mockGetJson).toHaveBeenCalledTimes(1);
        expect(mockGetJson).toHaveBeenCalledWith();
        expect(mockLocationUrl).toHaveBeenCalledTimes(1);
        expect(mockLocationUrl)
            .toHaveBeenCalledWith('plugins/predire-in-grafana-app/page/predizione');
        expect(evalAsyncMock).toHaveBeenCalledTimes(1);
        expect(mockGetJson).toHaveBeenCalledWith();
        expect(window.location.assign).toHaveBeenCalledTimes(1);
        expect(window.location.assign)
            .toHaveBeenCalledWith('plugins/predire-in-grafana-app/page/predizione');
        expect(imp).toEqual({
            saveDashboard: ImportCtrl.prototype.saveDashboard,
            grafana: new GrafanaAPI(),
            dashboard: { getJSON: mockGetJson },
            $location: { url: mockLocationUrl },
            $scope: new ScopeMock(),
        });
    });
});
