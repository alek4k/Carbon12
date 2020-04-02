const osx 	= require('os-utils');
const superagent = require('superagent');
const Server = require('../../server');
//const CSVr = require('../../fileManager/csv_reader.js');
const performance = require('perf_hooks').performance;
const os = require('os');

test('Efficenty tests', ()=>{

const server = new Server();

/*
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (sessionData) => {
  return {
      session: { data: sessionData },
      body: {name: 'dati_test.csv', path: './tests/files'}
    };
}; 
*/
var t0= performance.now();

superagent
  .post('/api/pet')
  .send('./tests/files/dati_test.csv') // sends a JSON post body
  .set('X-API-Key', 'foobar')
  .set('accept', 'json')
  .end((err, res) => {
    server.uploadForm(res,req);
  });

// let res1= jest.fn(mockResponse);
// let req1= jest.fn(mockRequest);
var t1= performance.now();
console.log('Call to function took '+(t1-t0)+' milliseconds.');

console.log('CPU usata: ');
// console.log(os.cpus());
// console.log(os.totalmem());
// console.log(os.freemem());

let cpus = os.cpus();

for(let i = 0, len = cpus.length; i < len; i++) {
    console.log("CPU %s:", i);
    let cpu = cpus[i], total = 0;

    for(let type in cpu.times) {
        total += cpu.times[type];
    }

    for(type in cpu.times) {
        console.log("\t", type, Math.round(100 * cpu.times[type] / total));
    }
}

osx.cpuUsage(function(v){
  console.log('Cacca');
  console.log( 'CPU Usage (%): ' + v );
});

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

});