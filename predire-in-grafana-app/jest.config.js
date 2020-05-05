/**
 * File name: jest.config.js
 * Date: 2020-04-01
 *
 * @file File di configurazione di jest
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: aggiunto moduleNameMapper
 */

module.exports = {
    moduleNameMapper: {
        'grafana/app/core/core': '<rootDir>/__mocks__/eventsMock',
    },
};
