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
import BackendSrv, { getMock, postMock } from '../../__mocks__/backendSrvMock';

beforeEach(() => {
    // Clear all instances
    getMock.mockClear();
    postMock.mockClear();
    BackendSrv.mockClear();
});

test('Test the onUpload function.', async () => {
    const importCtrl = new ImportCtrl('', new BackendSrv());
    const jsonTest = JSON.parse(fs.readFileSync('./tests/files/predittore_test.json').toString());
    await importCtrl.onUpload(jsonTest);
    expect(importCtrl.error).toEqual('');
});


test('Test the setDataSource function with new datasource.', async () => {
    const importCtrl = new ImportCtrl('', '');
    //await importCtrl.setDataSource('CPU');


    //expect(importCtrl.database).toEqual();
});
