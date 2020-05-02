/**
 * File name: module.js
 * Date: 2020-02-25
 *
 * @file Entry point del plug-in
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: aggiunto alertCtrl
 */

import PredireInGrafanaAppConfigCtrl from './components/config';
import importCtrl from './components/import';
import predictCtrl from './components/predict';
import alertCtrl from './components/alert';

export {
    PredireInGrafanaAppConfigCtrl as ConfigCtrl,
    importCtrl,
    predictCtrl,
    alertCtrl,
};
