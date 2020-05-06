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

import fs from 'fs';
import ImportCtrl from '../../../src/components/import';
import GrafanaAPI from '../../../src/utils/grafana_query';
import BackendSrvMock, { getMock, postMock } from '../../../__mocks__/backendSrvMock';
import ScopeMock from '../../../__mocks__/scopeMock';
import { appEvents, emitMock } from 'grafana/app/core/core'; 
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

it.only('Testing constructor', () => {
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

describe.only('Testing method', () => {
    let imp;
    beforeEach(() => {
        imp = new (function testImpor() { })();
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

    describe('loadDataSources', () => {
        beforeEach(() => {
            imp.loadDataSources = ImportCtrl.prototype.loadDataSources;
        });
    });


});
test('Test the onUpload function error.', async () => {
    const importCtrl = new ImportCtrl('', new ScopeMock(), new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotValidStructure.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    expect(importCtrl.error).toEqual('Il JSON inserito non è un predittore');
});


test('Test that onUpload() set correct params inside importCtrl.', async () => {
    const importCtrl = new ImportCtrl('', new ScopeMock(), new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    const predictor = new R_Predictor(jsonTest);
    expect(importCtrl.predictor).toEqual(predictor.getConfiguration());
    expect(importCtrl.notes).toEqual(predictor.getNotes());
    expect(importCtrl.model).toEqual(predictor.getModel());
    expect(importCtrl.view).toEqual((predictor.getModel() === 'SVM') ? 'Indicatore' : 'Grafico');
    expect(importCtrl.availableDataEntry).toEqual(predictor.getDataEntry());
    const ads = [];
    await (new GrafanaAPI(new BackendSrvMock())).getDataSources()
        .then((dataSources) => {
            dataSources.forEach((dataSource) => {
                ads.push(dataSource.name);
            });
        });
    expect(importCtrl.availableDataSources).toEqual(ads);
    expect(importCtrl.step).toEqual(2);
    expect(importCtrl.error).toEqual('');
});

test('Test that database, host and port are correctly set inside setDataSource().', async () => {
    const importCtrl = new ImportCtrl('', new ScopeMock(), new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    importCtrl.dataSource = importCtrl.availableDataSources[0];
    await importCtrl.setDataSource();

    let database = '';
    let host = '';
    let port = '';
    await (new GrafanaAPI(new BackendSrvMock())).getDataSources()
        .then((dataSource) => {
            let found = false;
            for (let i = 0; dataSource[i] !== undefined && !found; ++i) {
                if (dataSource[i].name === importCtrl.dataSource) {
                    found = true;
                    const endOfHost = dataSource[i].url.lastIndexOf(':');
                    database = dataSource[i].database;
                    host = dataSource[i].url.substring(0, endOfHost);
                    port = dataSource[i].url.substring(endOfHost + 1);
                }
            }
        });

    expect(importCtrl.database).toEqual(database);
    expect(importCtrl.host).toEqual(host);
    expect(importCtrl.port).toEqual(port);
    expect(importCtrl.error).toEqual('');
});

test('Test that setDataSource() raises an error if no datasource is selected.', async () => {
    const importCtrl = new ImportCtrl('', new ScopeMock(), new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    await importCtrl.setDataSource();

    expect(importCtrl.error).toEqual('È necessario selezionare una sorgente dati');
});

test('Test addDataSource() works.', async () => {
    const importCtrl = new ImportCtrl('', new ScopeMock(), new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    importCtrl.newDataSource = 'AddDSTest';
    importCtrl.database = 'telegraf';
    importCtrl.host = 'http://test';
    importCtrl.port = '8086';
    await importCtrl.addDataSource();


    expect(importCtrl.database).toEqual(importCtrl.database);
    expect(importCtrl.host).toEqual(importCtrl.host);
    expect(importCtrl.port).toEqual(importCtrl.port);
    expect(importCtrl.error).toEqual('');
});

test('Test that addDataSource() raises an error if datasource\'s configuration is incorrect.', async () => {
    const importCtrl = new ImportCtrl('', new ScopeMock(), new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    await importCtrl.addDataSource();

    expect(importCtrl.error).toEqual('La configurazione non è completa');
});
