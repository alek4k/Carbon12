//import the modules
const modules = require("ml-modules");
//select the machine learning module you want, for example
const SVM = modules.SVM; // support vector machine

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
  karpathy: true //piu efficiente!!
};

let svm = new SVM();
console.log("svm creata");

//parametri di input? Formato file Json
//fromJSON(data);

svm.train(data, labels, options);
console.log("svm train");

//predittore? dati in toJson
let jsonAddestrato = svm.toJSON();
console.log(jsonAddestrato);


let svm2 = new SVM();
svm2.fromJSON(jsonAddestrato);

data.forEach((point) => {
  predict1 = svm.predict(point);
  predict2 = svm2.predict(point);
  console.log("predict1: " + predict1);
  console.log("predict2: " + predict2);
});




/*
//predict
new svm(); //creo svm
svm.fromJSON(jsonAddestrato) //passo il modello
*/

//point?
/*let point = [2, 4];
svm.predict(point); // 0 <= value <= 1
svm.predictClass(point); // value = 1 || value = -1*/
