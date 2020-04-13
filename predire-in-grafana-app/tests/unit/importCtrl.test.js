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
import ImportCtrl from '../../src/components/import';
import GrafanaAPI from '../../src/utils/grafana_query';
import BackendSrvMock, { getMock, postMock } from '../../__mocks__/backendSrvMock';
import R_Predictor from '../../src/utils/r_predittore';

beforeEach(() => {
    // Clear all instances
    getMock.mockClear();
    postMock.mockClear();
    BackendSrvMock.mockClear();
});

test('Test the onUpload function error.', async () => {
    const importCtrl = new ImportCtrl('', new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test_NotValidStructure.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    expect(importCtrl.error).toEqual('Il JSON inserito non è un predittore');
});


test('Test that onUpload() set correct params inside importCtrl.', async () => {
    const importCtrl = new ImportCtrl('', new BackendSrvMock());
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
    const importCtrl = new ImportCtrl('', new BackendSrvMock());
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
    const importCtrl = new ImportCtrl('', new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    await importCtrl.setDataSource();

    expect(importCtrl.error).toEqual('È necessario selezionare una sorgente dati');
});

test('Test addDataSource() works.', async () => {
    const importCtrl = new ImportCtrl('', new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    importCtrl.name = 'AddDSTest';
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
    const importCtrl = new ImportCtrl('', new BackendSrvMock());
    const jsonTest = JSON.parse(
        fs.readFileSync('./tests/files/predittore_test.json').toString(),
    );
    await importCtrl.onUpload(jsonTest);
    await importCtrl.addDataSource();

    expect(importCtrl.error).toEqual('La configurazione non è completa');
});
