### Importare la libreria e scegliere il modulo SVM

```javascript
const modules = require("ml-modules");
const SVM = modules.SVM;
```

### Variabili per l'addestramento
#### data: array di punti nel grafico
#### labels: array di etichette per la classificazione dei punti in data
#### data e labels andranno lette dal file JSON in input
#### options: opzioni per configurare SVM;
### N.B. options: mantenere sempre le due indicate qui perchè più efficienti

```javascript
let data = [
  [1, 0],
  [2, 3],
  [5, 4],
  [2, 7],
  [0, 3],
  [-1, 0],
  [-3, -4],
  [-2, -2],
  [-1, -1],
  [-5, -2]
];

let labels = [1, 1, 1, 1, 1, -1, -1, -1, -1, -1];

let options = {
  kernel: "linear",
  karpathy: true
};
```

### Initializzazione
#### creazione di una SVM

```javascript
let svm = new SVM();
```

### Training: con passaggio variabili prima definite

```javascript
svm.train(data, labels, options);
```

### Salvataggio predittore
#### salva nella variabile predittore la configurazione del modello addestrato
#### la variabile predittore va scritta su un file JSON che verrà passato al plug-in
```javascript
let predittore = svm.toJSON();
```

### Creazione di una SVM a partire da un modello addestrato
#### modelloAddestrato: variabile che conterrà il modello addestrato in formato JSON precedentemente estratto dal train
#### dopo la creazione della SVM, con fromJSON è possibile caricare la configurazione del modello addestrato
```javascript
let modelloAddestrato;
let svm2 = new SVM();
svm2.fromJSON(modelloAddestrato);
```


### Predizione
#### a partire da un punto la SVM ritorna la predizione associata
#### predict(point): ritorna un valore continuo compreso tra 0 e 1
#### predictClass(point): ritorna un valore discreto che individua la classe di appartenenza -1 oppure 1
Bisognerà associare i valori letti da Grafana e fare un ciclo per ottenere la predizione di tutti i punti.

```javascript
let point = [2, 4];
svm2.predict(point); // 0 <= value <= 1
svm2.predictClass(point); // value = 1 || value = -1
```

```javascript
data.forEach((point) => {
  let predict = svm2.predict(point);
  console.log("point: " +  point + "predict: " +  predict);
});
```
