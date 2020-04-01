class InfinitySwag {
  constructor() {
    this.backendSrv = null;
    this.refreshTime = 1000;
  }

  setBackendSrv(backendSrv) {
    this.backendSrv = backendSrv;
  }

  setRefreshTime(time) {
    this.refreshTime = time;
  }

  startPrediction() {
    this.prediction = setInterval(() => {
      console.log("loop()")
    }, this.refreshTime);
  }

  stopPrediction() {
    clearInterval(this.prediction);
  }
}

module.exports = new InfinitySwag();
