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

    const jsonTest = fs.readFileSync('../files/predittore_test.json').toString();
    
    const t0 = performance.now();

    

    const t1 = performance.now();
    console.log('Call to function took ' + (t1 - t0) + ' milliseconds.');

    console.log('CPU usata: ');

    const cpus = os.cpus();

    for (let i = 0, len = cpus.length; i < len; i++) {
        console.log('CPU %s:', i);
        const cpu = cpus[i];
        let total = 0;
        let type;
        for (type in cpu.times) {
            if ({}.hasOwnProperty.call(cpu.times, type)) {
                total += cpu.times[type];
            }
        }

        for (type in cpu.times) {
            if ({}.hasOwnProperty.call(cpu.times, type)) {
                console.log('\t', type, Math.round(100 * (cpu.times[type] / total)));
            }
        }
    }

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
});