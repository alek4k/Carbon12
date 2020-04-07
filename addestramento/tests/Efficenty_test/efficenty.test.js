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

const superagent = require('superagent');
const performance = require('perf_hooks').performance;
const os = require('os');
const Server = require('../../server');

test('Efficenty tests', () => {
    const server = new Server();

    const t0 = performance.now();

    superagent
        .post('/api/pet')
        .send('./tests/files/dati_test.csv') // sends a JSON post body
        .set('X-API-Key', 'foobar')
        .set('accept', 'json')
        .end((err, res) => {
            server.uploadForm(res, req);
        });

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
