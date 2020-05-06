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

import os from 'os';
import { performance } from 'perf_hooks';
import fs from 'fs';
import ImportCtrl from '../../src/components/import';
import BackendSrvMock, { getMock, postMock } from '../../__mocks__/backendSrvMock';
import ScopeMock from '../../__mocks__/scopeMock';
import LocationMock from '../../__mocks__/locationMock';

beforeEach(() => {
    // Pulisco i mock
    getMock.mockClear();
    postMock.mockClear();
    BackendSrvMock.mockClear();

    // Cancello i redirect per evitare errori
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
        port: '123',
        protocol: 'http:',
        hostname: 'localhost',
    };
});

afterEach(() => {
    const cpus = os.cpus();

    let uTot = 0;
    console.log('User CPU used:');
    for (let i = 0, len = cpus.length; i < len; i++) {
        const cpu = cpus[i];
        let total = 0;
        let type;
        for (type in cpu.times) {
            if ({}.hasOwnProperty.call(cpu.times, type)) {
                total += cpu.times[type];
            }
        }
        for (type in cpu.times) {
            if (type === 'user') {
                uTot += Math.round(100 * (cpu.times[type] / total));
            }
        }
    }
    console.log('\t', 'user', uTot / cpus.length);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
});

test('Efficiency tests import.js with already existing datasource', async () => {
    const importCtrl = new ImportCtrl(new LocationMock(), new ScopeMock(), new BackendSrvMock());
    const jsonTest = JSON.parse(fs.readFileSync('./tests/files/predittore_test.json').toString());
    const t0 = performance.now();

    await importCtrl.onUpload(jsonTest);
    // controllo come se l'utente scegliesse una data source già presente
    importCtrl.dataSource = importCtrl.availableDataSources[0];
    await importCtrl.setDataSource(importCtrl.dataSource);
    importCtrl.sources = ['CPU', 'RAM'];
    importCtrl.instances = [];
    importCtrl.params = [];
    importCtrl.view = 'Indicatore';
    importCtrl.panelName = 'PanelTest';
    await importCtrl.createPanel();

    const t1 = performance.now();
    console.log('Call to function took ' + (t1 - t0) + ' milliseconds.');
});

test('Efficiency tests import.js with new datasource', async () => {
    const importCtrl = new ImportCtrl(new LocationMock(), new ScopeMock(), new BackendSrvMock());
    const jsonTest = JSON.parse(fs.readFileSync('./tests/files/predittore_test.json').toString());
    const t0 = performance.now();

    await importCtrl.onUpload(jsonTest);
    // controllo come se l'utente scegliesse una data source già presente
    importCtrl.name = 'TestDS';
    importCtrl.database = 'telegraf';
    importCtrl.port = '8086';
    await importCtrl.addDataSource();
    importCtrl.sources = ['CPU', 'RAM'];
    importCtrl.instances = [];
    importCtrl.params = [];
    importCtrl.view = 'Indicatore';
    importCtrl.panelName = 'PanelTest';
    await importCtrl.createPanel();

    const t1 = performance.now();
    console.log('Call to function took ' + (t1 - t0) + ' milliseconds.');
});
