/**
 * File name: module.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import './sass/grafana-carbon12.dark.scss';
import './sass/grafana-carbon12.light.scss';

import { PredireInGrafanaAppConfigCtrl } from './components/config';
import { importCtrl } from './components/import';
import { loadPluginCss } from 'grafana/app/plugins/sdk';

loadPluginCss({
    dark: 'plugins/predire-in-grafana-app/css/grafana-zabbix.dark.css',
    light: 'plugins/predire-in-grafana-app/css/grafana-zabbix.light.css'
});

export {
    PredireInGrafanaAppConfigCtrl as ConfigCtrl,
    importCtrl
};
