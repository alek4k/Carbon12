/**
 * File name: predict.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import { InfinitySwag } from '../utils/infinitySwag';
import Influx from '../utils/influx.js';

export default class predictCtrl {
  /** @ngInject */
  constructor($location, backendSrv) {
    this.$location = $location;
    this.backendSrv = backendSrv;
  }

  startPrediction() {
    if(InfinitySwag.db == null) {
      InfinitySwag.setBackendSrv(this.backendSrv);
      InfinitySwag.setInflux(new Influx('http://localhost', 8086, 'telegraf'));
    }
    InfinitySwag.startPrediction();
  }

  stopPrediction() {
    InfinitySwag.stopPrediction();
  }
}

predictCtrl.templateUrl = 'components/predict.html';
