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
    this.availableMeasurement = [];
    this.availableParams = [];
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
      this.jsonImported = true; 
      this.jsonError = '';
      this.model = json.model;
      this.availablePredictors = Object.values(json.data_entry).slice(1); // creo l'array con i predittori
    }
    else{
      this.jsonError = 'Il JSON inserito non è un predittore';
    }
  }

  // carico testo del predittore
  loadText(){
    try{
      // controllo prima con parse() se il JSON è valido, poi chiamo il metodo onUpload()
      this.onUpload(JSON.parse(this.jsonText));
    }
    catch(err){
      this.jsonError = err.message;
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

      console.log(defaultDashboard.rows[0].panels[0].targets[0].select[0]);
  }

  // costruisco l'array dei parametri relativo alla sorgente selezionta
  buildParams() {
    this.selectedSourceParams = [];
    let sourceName = this.source.substring(0, this.source.indexOf('\n')),
      i = 0;
    // trovo l'indice del prima sorgente accettabile
    for (; this.availableParams[i].name != sourceName; ++i);
    // seleziono i parametri relativi alla sorgente
    for (; this.availableParams[i].name == sourceName; ++i) {
      this.selectedSourceParams.push(this.availableParams[i].params);
    }
    this.param = this.selectedSourceParams[0];
  }

  // creo il pannello
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
