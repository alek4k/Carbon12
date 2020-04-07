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
import GrafanaApiQuery, { getDashboardF } from '../../src/utils/grafana_query';

jest.mock('../../src/utils/grafana_query.js');

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    getDashboardF.mockClear();
    GrafanaApiQuery.mockClear();
});

test('Test the onUpload function.', () => {
    console.log('test...');
    const importCtrl = new ImportCtrl('', '');
    const jsonTest = JSON.parse(fs.readFileSync('./tests/files/predittore_test.json').toString());
    importCtrl.onUpload(jsonTest);

    expect(importCtrl.error).toEqual('');
});
