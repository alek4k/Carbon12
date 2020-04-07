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

import fs from 'fs';
import ImportCtrl from '../../src/components/import';
import GrafanaApiQuery, { getDashboardF } from '../../src/utils/grafana_query';


const performance = require('perf_hooks').performance;
const os = require('os');

test('Efficenty tests', () => {
    const importCtrl = new ImportCtrl();
    const t0 = performance.now();

    const t1 = performance.now();
});