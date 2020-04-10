### Importare la libreria

```javascript
const Regression = require('./path/regression.js');
```

### Variabili per l'addestramento
#### formula y = axi + cb
#### data: array di punti nel grafico = le x
#### expected: array con i valori attesi per la y
#### data e expected andranno lette dal file csv in input
#### a e c sono i coefficienti che dobbiamo ottenere
#### N.B. in data bisognerà aggiungere il valore fisso 1 per la b come primo valore
i valori qui riportati sono assolutamente a caso
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

let labels = [3,5,7,11,24,75,4,2,4,5];

let options = {
  kernel: "linear",
  karpathy: true
};

for(i = 0; i<data.length; i++){
  data[i].unshift(1);
}
```

### Initializzazione
#### creazione di una RL
#### x è il numero di data entry + la b

```javascript
let reg = new Regression({ numX: x, numY: 1 });
```

### Training: con passaggio variabili prima definite

```javascript
reg.train(data,expected);
```

### Salvataggio predittore
#### salva nella variabile predittore la configurazione del modello addestrato
#### la variabile predittore va scritta su un file JSON che verrà passato al plug-in
```javascript
let predittore = reg.toJSON();
```

### Creazione di una RL a partire da un modello addestrato
#### modelloAddestrato: variabile che conterrà il modello addestrato in formato JSON precedentemente estratto dal train
#### dopo la creazione della RL, con fromJSON è possibile caricare la configurazione del modello addestrato
```javascript
let modelloAddestrato;
let x = modelloAddestrato.D;
let reg2 = new Regression({ numX: x, numY: 1 })
```


### Predizione
#### a partire da un punto la RL ritorna la predizione associata
#### predict(point): ritorna un valore continuo corrispondente alla y
Bisognerà associare i valori letti da Grafana e fare un ciclo per ottenere la predizione di tutti i punti.

```javascript
let point = [2, 4];
reg2.predict(point);
```

```javascript
data.forEach((point) => {
  let predict = reg2.predict(point);
  console.log("point: " +  point + "predict: " +  predict);
});
```
