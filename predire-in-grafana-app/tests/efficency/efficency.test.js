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

const performance = require('perf_hooks').performance;
const os = require('os');
const grafanaQueryApi = require('../../__mocks__/grafanaApiQueryMock.test.js');

test('Efficenty tests', () => {
    const t0 = performance.now();

    const grafana = new grafanaQueryApi();
    console.log(grafana.getDataSources());


    const t1 = performance.now();
    console.log('Call to function took ' + (t1 - t0) + ' milliseconds.');

    console.log('CPU usata: ');

    const cpus = os.cpus();

    for (let i = 0, len = cpus.length; i < len; i++) {
        console.log('CPU %s:', i);
        const cpu = cpus[i];
        let total = 0;

        total = 0;

        /* eslint-disable */
        for (let type in cpu.times) {
          total += cpu.times[type];
        }

        /* eslint-disable */
        for (type in cpu.times) {
          console.log("\t", type, Math.round(100 * cpu.times[type] / total));
        }
    }

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
});
