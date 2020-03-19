class GrafanaApiQuery{

  constructor(backendSrv){
    this.backendSrv = backendSrv;
  }

  async getDataSources(){
    return this.backendSrv.get('/api/datasources');
  }

}

module.exports = GrafanaApiQuery;