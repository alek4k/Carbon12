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
import GrafanaApiQuery from '../utils/grafana_query.js';
import Influx from '../utils/influx.js';
import {appEvents} from 'grafana/app/core/core';

export default class predictCtrl {
  /** @ngInject */
  constructor($location, backendSrv) {
    this.$location = $location;
    this.backendSrv = backendSrv;
    this.time = '';
    this.timeUnit = 'secondi';
    this.grafana = new GrafanaApiQuery(this.backendSrv);
    this.init();
  }

  init() {
    if(window.localStorage.getItem('started') === undefined) {
      this.started = false;
      window.localStorage.setItem('started', "no");
    } else {
      this.started = window.localStorage.getItem('started') === "yes" ? true : false;
    }
    this.findDashboard();
  }

  findDashboard() {
    this.grafana
      .getDashboards('0')
      .then((dbList) => {
        let found = false;
        for (let i = 0; i < dbList.length && !found; ++i) {
            if (dbList[i].uid === 'carbon12') {
              found = true;
            }
        }
        this.dashboardExists = found;
      });
  }

  timeToMilliseconds() {
    if(this.time) {
      try {
        parseInt(this.time, 10);
      }
      catch (err) {
        return 0;
      }
      if (this.timeUnit === 'secondi') {
        return parseInt(this.time, 10) * 1000;
      } else if (this.timeUnit === 'minuti') {
        return parseInt(this.time, 10) * 60000;
      } else {
        return parseInt(this.time, 10) * 3600000;
      }
    }
    return 0;
  }

  startPrediction() {
    let refreshTime = this.timeToMilliseconds();
    if(!this.dashboardExists) {
      appEvents.emit('alert-error', ['Dashboard non trovata', '']);
    } else if (refreshTime <= 0) {
      appEvents.emit('alert-error', ['Frequenza di predizione non supportata', '']);
    } else {
      this.started = true;
      window.localStorage.setItem('started', "yes");
      if(InfinitySwag.db === null) {
        InfinitySwag.setBackendSrv(this.backendSrv);
        InfinitySwag.setInflux(new Influx('http://localhost', 8086, 'telegraf'));
      }
      appEvents.emit('alert-success', ['Predizione avviata', '']);
      InfinitySwag.startPrediction(refreshTime);
    }
  }

  stopPrediction() {
    this.started = false;
    window.localStorage.setItem('started', "no");
    appEvents.emit('alert-success', ['Predizione terminata', '']);
    InfinitySwag.stopPrediction();
  }
}

predictCtrl.templateUrl = 'components/predict.html';
