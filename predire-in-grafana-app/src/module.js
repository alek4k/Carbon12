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

import PredireInGrafanaAppConfigCtrl from './components/config';
import importCtrl from './components/import';
import predictCtrl from './components/predict';

export {
    PredireInGrafanaAppConfigCtrl as ConfigCtrl,
    predictCtrl,
    importCtrl,
};
