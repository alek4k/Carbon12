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

import importCtrl from '../../src/components/import';
import GrafanaApiQuery, { getDashboardF } from '../../src/utils/grafana_query';

jest.mock('../../src/utils/grafana_query.js');

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    GrafanaApiQuery.mockClear();
});

it('We can check if the consumer called the class constructor', () => {
    console.log('test...');
    const temp = new importCtrl('', '');

    expect(getDashboardF).toHaveBeenCalledTimes(1);
});