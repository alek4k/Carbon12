/**
 * File name: app.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import { performance } from 'perf_hooks';
import fs from 'fs';
import ImportCtrl from '../../src/components/import';
import BackendSrv, { getMock, postMock } from '../../__mocks__/backendSrv';


beforeEach(() => {
    // Clear all instances
    getMock.mockClear();
    postMock.mockClear();
    BackendSrv.mockClear();
});

test('Efficenty tests', async () => {
    const importCtrl = new ImportCtrl('', new BackendSrv());
    const jsonTest = JSON.parse(fs.readFileSync('./tests/files/predittore_test.json').toString());
    const t0 = performance.now();
    await importCtrl.onUpload(jsonTest);

    // controllo come se l'utente segliesse una data source già presente
    importCtrl.dataSource = importCtrl.availableDataSources[0];
    await importCtrl.setDataSource(importCtrl.dataSource);

    const t1 = performance.now();
    console.log('Call to function took ' + (t1 - t0) + ' milliseconds.');
});
