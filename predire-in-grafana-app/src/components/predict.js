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

import InfinitySwag from '../utils/infinitySwag';

export default class predictCtrl {
  /** @ngInject */
  constructor($location) {
    this.$location = $location;
  }

  startPrediction() {
    this.pred = setInterval(() => {
      console.log("loop()")
    }, 1000);
  }

  stopPrediction() {
    clearInterval(this.pred);
  }
}

predictCtrl.templateUrl = 'components/predict.html';
