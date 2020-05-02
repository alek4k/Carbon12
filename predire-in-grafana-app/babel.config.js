/**
 * File name: babel.config.js
 * Date: 2020-03-29
 *
 * @file File di s di babel
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: sostituito babel/preset-env con @babel/preset-env 
 */

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
    ],
};
