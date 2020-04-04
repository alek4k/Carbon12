const SVM = require('./models/svm/svm');
const GrafanaApiQuery = require('./grafana_query.js');
import Influx from './influx.js'; 

class InfinitySwag {
  constructor() {
    this.backendSrv = null;
    this.db = null;
  }

  setBackendSrv(backendSrv) {
    this.backendSrv = backendSrv;
    this.grafana = new GrafanaApiQuery(this.backendSrv);
    this.setInflux();
  }

  getDashboard() {
    this.grafana
      .getDashboards('0')
      .then((dbList) => {
        let found = false;
        for (let i = 0; i < dbList.length && !found; ++i) {
            if (dbList[i].uid === 'carbon12') {
                found = true;
            }
        }
        if (found) {
            this.grafana
              .getDashboard('predire-in-grafana')
              .then((dashboard) => {
                console.log(dashboard);
              });
        }
      });
  }

  setInflux(){
    this.db = new Influx(
      window.localStorage.getItem('host'), 
      window.localStorage.getItem('port'),
      window.localStorage.getItem('database')
    );
  }

  dbWrite(info){
    this.db.storeValue('predizioni', info);
  }

  startPrediction(refreshTime) {
    this.getDashboard();
    this.prediction = setInterval(() => {
      let temp= this.getPredictor();
      this.dbWrite(temp);
      console.log(temp)
    }, refreshTime);
  }

  stopPrediction() {
    console.log("QUI");
    clearInterval(this.prediction);
  }

  getPredictor() {
    const svm = new SVM();
    let x = JSON.parse(window.localStorage.getItem('predittore'));
    svm.fromJSON(x);
        const point = [
            this.db.getLastValue('win_cpu', 'Percent_DPC_Time'),
            this.db.getLastValue('win_cpu', 'Percent_DPC_Time'),
        ];
        return svm.predictClass(point);
  }

  predictionSVM(point) {
    return svm.predict(point);
  }
}

let o = new InfinitySwag();
export { o as InfinitySwag };