const request = require("supertest");
const Server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');
const streamEqual = require('stream-equal');
const fs = require('fs');
const assert      = require('assert');

const server = new Server();

test("It should response the GET method", () => {
    server.startServer();

    return request(server.app)
        .get("/")
        .expect(200);
});

test("test addestramento", () => {
   let data = [[0, 3635074964649240],
       [0.02222222222222222, 3635087719298240],
       [577764938556921, 45403508771929800],
       [5.8, 3638583724267630],
       [11511111111111100, 4543859649122800],
       [57555555555555500, 4543843705811550],
       [5733333333333330, 4543859649122800],
       [0, 36420285888718100],
       [0, 3638583724267630],
       [0.0666681481810707, 27473780609756500]];
   let labels = [-1,-1,1,-1,1,1,1,-1,-1,-1];
   let n = 10;

   const k = {};
   k.D = 2;
   k.N = 10;
   k._parametroB = "bias: coefficiente additivo del calcolo della SVM";
   k._parametroD = "numero di sorgenti analizzate";
   k._parametroN = "numero di dati inseriti";
   k._parametroW = "weights: coefficienti moltiplicativi del calcolo della SVM";
   k.b = 0;
   k.kernelType = "linear";
   k.w = [0, 0];

   expect(server.addestramento(data, labels, n)).toEqual(k);
});

test("salvataggio json", () => {
    let nome = "greg.json";
    let strPredittore = '';
    const csvReader = new CSVr('./tests/files/dati_test.csv', null);

    server.savePredittore(csvReader, strPredittore, nome);

    var stats = fs.statSync('./greg.json');

    expect(stats).toBeTruthy();
});
