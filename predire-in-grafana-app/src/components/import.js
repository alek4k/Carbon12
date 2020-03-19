// importo la dashboard già configurata con il pannello 'Carbon12 Graph Prediction'
import defaultDashboard from '../dashboards/default.json';

// chiavi della struttura base del predittore
let arrayOfKeys = ['header', 'data_entry', 'model', 'file_version', 'configuration'];

export class importCtrl{

  /** @ngInject */
  constructor($location, backendSrv){
    this.$location = $location;
    this.backendSrv = backendSrv;
    this.step = 1;
    this.error = '';
    this.availableDataSources = [];
    this.dataSources = '';
    this.name = '';
    this.database = '';
    this.url = 'http://localhost:8086';
    this.model = '';
    this.availableMeasurement = [];
    this.availableParams = [];
    this.param = '';
    this.selectedSourceParams = [];
    this.availablePredictors = [];
    this.predictor = '';
    this.availableSources = [];
    this.source = '';
    this.view = 'Grafico';

    const GrafanaApiQuery = require('../utils/grafana_query.js');
    let grafana = new GrafanaApiQuery(this.backendSrv);
  
    // prelevo le data sources disponibili
    grafana.getDataSources()
      .then(dataSources => {
        // dataSoources ha la struttura di un json
        for(const ds in dataSources){
          this.availableDataSources.push(dataSources[ds].name);
        }
      });

    // creo la connessione con il database
    const Influx = require('../utils/connection.js');
    let influx = new Influx();

    // prelevo le sorgenti disponibili
    influx.getSources()
      .then(result => {
        // itero sulle sorgenti disponibili
        for(let i = 0; result.results[0].series[i].name; ++i){
          // itero sulle istanze della sorgente i
          for(let j = 0; j < result.results[0].series[i].values.length; ++j){
            this.availableMeasurement.push({
              "name": result.results[0].series[i].name,
              "instance": result.results[0].series[i].values[j][1]
            });
            this.availableSources.push(result.results[0].series[i].name + '\n' + result.results[0].series[i].values[j][1]);
          }
        }
      });
      
    // prelevo i parametri disponibili
    influx.getParams()
    .then(result => {
      // itero sulle sorgenti disponibili
      for (let i = 0; result.results[0].series[i].name; ++i){
        // itero sui parametri della sorgente i
        for (let j = 0; j < result.results[0].series[i].values.length; ++j){
          this.availableParams.push({
            "name": result.results[0].series[i].name,
            "params": result.results[0].series[i].values[j][0]
          });
        }
      }
    });
  }

  // carico il file del predittore
  onUpload(json){
    // controllo che il JSON inserito abbia la struttura desiderata
    if(arrayOfKeys.every(key => json.hasOwnProperty(key))){
      this.error = '';
      this.model = json.model;
      this.availablePredictors = Object.values(json.data_entry); // creo l'array con i predittori
      this.step = 2; 
    }
    else{
      this.error = 'Il JSON inserito non è un predittore';
    }
  }

  // carico testo del predittore
  loadText(){
    try{
      // controllo prima con parse() se il JSON è valido, poi chiamo il metodo onUpload()
      this.onUpload(JSON.parse(this.jsonText));
    }
    catch(err){
      this.error = err.message;
    }
  }

  // imposto la data source selezionata dall'utente
  setDataSource(dataSource){
    if(dataSource){
      this.error = '';
      defaultDashboard.rows[0].panels[0].datasource = dataSource;
      this.step = 3;
    }
    else{
      this.error = 'È necessario selezionare una sorgente dati';
    }
  }

  // aggiungo la configurazione della data source alla lista delle data sources
  addDataSource(){
    const configComplete = this.name && this.database && this.url;
    if(configComplete){
      this.backendSrv.post('api/datasources', {
        name: this.name,
        type:"influxdb",
        access: "proxy",
        database: this.database,
        url: this.url,
        readOnly: false,
        editable: true
      }).then(() => {
        this.setDataSource(this.name);
      });
    }
    else{
      this.error = 'La configurazione non è completa';
    }
  }

  // imposto sorgete selezionata dall'utente
  setMeasurement(index){
    defaultDashboard.rows[0].panels[0].targets[0].measurement = this.availableMeasurement[index].name;
  }

  // imposto istanza selezionata dall'utente
  setInstance(index){
    defaultDashboard.rows[0].panels[0].targets[0].tags[0].value = this.availableMeasurement[index].instance;
  }

  // imposto il predittore selezionato dall'utente
  setPredictor(index){
    defaultDashboard.rows[0].panels[0].targets[0].refId = this.predictor;
  }

  // imposto il parametro selezionato dall'utente
  setParams(index){
    defaultDashboard.rows[0].panels[0].targets[0].select[0].pop();
    defaultDashboard.rows[0].panels[0].targets[0].select[0].pop();
    defaultDashboard.rows[0].panels[0].targets[0].select[0].push({
      "type": "field",
      "params": [
        this.param
      ]},
      {
        "type": "mean",
        "params": []
      });
  }

  setView(){
    if(this.view == 'Grafico'){
    defaultDashboard.rows[0].panels[0].type = 'graph-prediction';
    }
    else{
      defaultDashboard.rows[0].panels[0].type = 'singlestat';
      defaultDashboard.rows[0].panels[0].colorBackground = 'true';
      defaultDashboard.rows[0].panels[0].title = 'Indicatore di Predizione';
    }
  }

  // costruisco l'array dei parametri relativo alla sorgente selezionta
  buildParams(){
    this.selectedSourceParams = [];
    let sourceName = this.source.substring(0, this.source.indexOf('\n')),
      i = 0;
    // trovo l'indice del prima sorgente accettabile
    for(; this.availableParams[i].name != sourceName; ++i);
    // seleziono i parametri relativi alla sorgente
    for(; this.availableParams[i].name == sourceName; ++i){
      this.selectedSourceParams.push(this.availableParams[i].params);
    }
    this.param = this.selectedSourceParams[0];
  }

  // creo il pannello
  createPanel(){
    if(!this.predictor || !this.source){
      this.error = 'È necessario selezionare ';
      if(!this.predictor && !this.source){
        this.error += 'un predittore e una sorgente';
      }
      else{
        this.error += !this.predictor ? 'un predittore' : 'una sorgente';
      }
    }
    else{
      this.error = '';
      let sourceIndex = this.availableSources.indexOf(this.source);
      this.setMeasurement(sourceIndex);
      this.setInstance(sourceIndex);
      this.setPredictor(sourceIndex);
      this.setParams(sourceIndex);
      this.setView();
      this.backendSrv
        .post('api/dashboards/import', {
          // creo e salvo la dashboard contenente il pannello 'Carbon12 Graph Prediction'
          dashboard: defaultDashboard,
          folderId: 0,
          overwrite: true,
        })
        .then(db => {
          // reindirizzo alla pagina della dashboard appena creata
          this.$location.url(db.importedUrl);
          // ricarico la nuova pagina per aggiornare la lista delle data sources disponibili
          window.location.href = db.importedUrl;
        });
    }
  }

}

importCtrl.templateUrl = 'components/import.html';
