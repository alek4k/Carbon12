import './sass/grafana-carbon12.dark.scss';
import './sass/grafana-carbon12.light.scss';

import {PredireInGrafanaAppConfigCtrl} from './components/config';
import {importCtrl} from './components/import';
import {loadPluginCss} from 'grafana/app/plugins/sdk';

loadPluginCss({
    dark: 'plugins/predire-in-grafana-app/css/grafana-zabbix.dark.css',
    light: 'plugins/predire-in-grafana-app/css/grafana-zabbix.light.css'
});

export {
    PredireInGrafanaAppConfigCtrl as ConfigCtrl,
    importCtrl
};
