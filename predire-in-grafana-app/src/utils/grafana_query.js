class GrafanaApiQuery{

  constructor(backendSrv){
    this.backendSrv = backendSrv;
  }

  getDataSources(){
    return this.backendSrv.get('/api/datasources');
  }
  
}

module.exports = GrafanaApiQuery;