const request = require("supertest");
const Server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');
const fs = require('fs');

const server = new Server();

test("It should response the GET method", () => {
    server.startServer();

    return request(server.app)
        .get("/")
        .expect(200);
});

test("Test for config addestramento", () =>{
    server.config();

    return request(server.app)
        .get("/")
        .expect("Content-Type", /html/)
        .expect(200);
});

test("Test for config fileupload", () =>{
    
    server.config();

    return request(server.app)
        .post("/fileupload")
        .expect("Content-Type", /json/)
        .expect(200);
});

test("Test for config downloadPredittore", () =>{
    server.config();

    return request(server.app)
        .get("/downloadPredittore")
        .expect("Content-Type", /html/)
        .expect(200);
});

test("Test for config downloadFile", () =>{
    server.config();

    return request(server.app)
        .post("/downloadFile")
        .expect("Content-Type", /html/)
        .expect(200);
});

test("Test for config loadCsv", () =>{
    server.config();

    return request(server.app)
        .post("/loadCsv")
        .expect(200);
});

test("test addestramento", () => {
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

   const k = [
    [ '_parametroN' ],
    [ 'N' ],
    [ '_parametroD' ],
    [ 'D' ],
    [ '_parametroB' ],
    [ 'b' ],
    [ 'kernelType' ],
    [ '_parametroW' ],
    [ 'w' ]
   ]

   let json_data = server.train(data, labels);
   let result = [];
   for(var i in json_data)
    result.push([i]);
   expect(result).toEqual(k);
});

test("salvataggio json", () => {
    let nome = "greg.json";
    let strPredittore = '';
    const csvReader = new CSVr('./tests/files/dati_test.csv', null);

    server.savePredittore(csvReader, strPredittore, nome);

    var stats = fs.statSync('./greg.json');

    expect(stats).toBeTruthy();
});
