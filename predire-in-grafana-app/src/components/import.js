// importo la dashboard già configurata con il pannello 'Carbon12 Graph Prediction'
import defaultDashboard from '../dashboards/default.json';

// chiavi della struttura base del predittore
let arrayOfKeys = ['header', 'data_entry', 'model', 'file_version', 'configuration'];

export class importCtrl{

  /** @ngInject */
  constructor($location, backendSrv){
    this.$location = $location;
    this.backendSrv = backendSrv;
    this.jsonImported = false;
    this.jsonError = '';
    this.model = '';
    this.measurement = [];
    this.params = [];
    this.param = '';
    this.selectedSourceParams = [];
    this.availablePredictors = [];
    this.predictor = '';
    this.availableSources = [];
    this.source = '';
    this.notSelectedError = '';
    this.view = 'Grafico';

    // creo la connessione con il database
    const Influx = require('../utils/connection.js');
    let influx = new Influx();
    influx.getSources()
      .then(result => {
        for(let i = 0; result.results[0].series[i].name; ++i){
          for(let j = 0; j < result.results[0].series[i].values.length; ++j){
            this.measurement.push({
              "measurement": result.results[0].series[i].name,
              "instance": result.results[0].series[i].values[j][1]
            });
            this.availableSources.push(result.results[0].series[i].name + '\n' + result.results[0].series[i].values[j][1]);
          }
        }
      });
      
      influx.getParams()
      .then(result => {
        for (let i = 0; result.results[0].series[i].name; ++i){
          for (let j = 0; j < result.results[0].series[i].values.length; ++j){
            this.params.push({
              "measurement": result.results[0].series[i].name,
              "params": result.results[0].series[i].values[j][0]
            });
          }
        }
      });
  }

  onUpload(json){
    // controllo che il JSON inserito abbia la struttura desiderata
    if(arrayOfKeys.every(key => json.hasOwnProperty(key))){
      this.jsonImported = true;
      this.jsonError = '';
      this.model = json.model;
      this.availablePredictors = (Object.values(json.data_entry).slice(1));
    }
    else{
      this.jsonError = 'Il JSON inserito non è un predittore';
    }
  }

  loadText(){
    try{
      // controllo prima con parse() se il JSON è valido, poi chiamo il metodo onUpload()
      this.onUpload(JSON.parse(this.jsonText));
    }
    catch(err){
      this.jsonError = err.message;
    }
  }

  buildParams(){
    this.selectedSourceParams = [];
    let sourceName = this.source.substring(0, this.source.indexOf('\n')), i = 0;
    for(; this.params[i].measurement != sourceName; ++i);
    for(; this.params[i].measurement == sourceName; ++i){
      this.selectedSourceParams.push(this.params[i].params);
    }
    this.param = this.selectedSourceParams[0];
  }

  setMeasurement(index){
    defaultDashboard.rows[0].panels[0].targets[0].measurement = this.measurement[index].measurement;
  }

  setInstance(index){
    defaultDashboard.rows[0].panels[0].targets[0].tags[0].value = this.measurement[index].instance;
  }

  setPredictor(index){
    defaultDashboard.rows[0].panels[0].targets[0].refId = this.predictor;
  }

  setParams(index){
    defaultDashboard.rows[0].panels[0].targets[0].select[0].push({
      "type": "field",
      "params": [
        this.param
      ]
    },
    {
      "type": "mean",
      "params": []
    });
  }

  createPanel(){
    if(!this.predictor || !this.source){
      this.notSelectedError = 'È necessario selezionare ';
      if(!this.predictor && !this.source){
        this.notSelectedError += 'un predittore e una sorgente';
      }
      else{
        this.notSelectedError += !this.predictor ? 'un predittore' : 'una sorgente';
      }
    }
    else{
      this.notSelectedError = '';
      let sourceIndex = this.availableSources.indexOf(this.source);
      this.setMeasurement(sourceIndex);
      this.setInstance(sourceIndex);
      this.setPredictor(sourceIndex);
      this.setParams(sourceIndex);
      return this.backendSrv
        .post('api/dashboards/import', {
          // creo e salvo la dashboard contenente il pannello 'Carbon12 Graph Prediction'
          dashboard: defaultDashboard,
          folderId: 0,
          overwrite: true,
        })
        .then(db => {
          // reindirizzo alla pagina della dashboard appena creata
          this.$location.url(db.importedUrl);
        })
    }
  }

}

importCtrl.templateUrl = 'components/import.html';
