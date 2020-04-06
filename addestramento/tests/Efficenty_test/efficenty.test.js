const superagent = require('superagent');
const Server = require('../../server');
const performance = require('perf_hooks').performance;
const os = require('os');

test('Efficenty tests', ()=>{

const server = new Server();

let t0= performance.now();

superagent
  .post('/api/pet')
  .send('./tests/files/dati_test.csv') // sends a JSON post body
  .set('X-API-Key', 'foobar')
  .set('accept', 'json')
  .end((err, res) => {
    server.uploadForm(res,req);
  });

let t1= performance.now();
console.log('Call to function took '+(t1-t0)+' milliseconds.');

console.log('CPU usata: ');

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

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

});
