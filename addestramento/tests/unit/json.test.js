const fs = require('fs');
const RPredittore = require('../../fileManager/r_predittore.js');

const managePredittore = new RPredittore(JSON.parse(
    fs.readFileSync('./tests/files/predittore_test.json').toString(),
));

test("It should response that file.json has the title expected", () => {
    expect(managePredittore.getTitle()).toEqual("Carbon12 Predire in Grafana");
});

test("It should response that file.json has the Plugin version expected", () => {
    expect(managePredittore.getPluginVersion()).toEqual("0.0.0");
});

test("It should response that file.json has the Train version expected", () => {
    expect(managePredittore.getTrainVersion()).toEqual("0.0.0");
});

test("It should response that file.json has the sources expected", () => {
    expect(managePredittore.getDataEntry()).toEqual(['A', 'B']);
});

test("It should response that file.json has the model expected", () => {
    expect(managePredittore.getModel()).toEqual('SVM');
});

test("It should response that file.json has the File version expected", () => {
    expect(managePredittore.getFileVersion()).toBe(0);
});

test("It should response that file.json has the notes expected", () => {
    expect(managePredittore.getNotes()).toEqual("test");
});

test("It should response that file.json has the configuration expected", () => {
    const k = {};
    k.N = 60;
    k.D = 3;
    k.b = 25889865728;
    k.kernelType = "linear";
    k.w = [
        -4838.896484375,
        489.25675450149345,
        1224.422537904899
    ];
    expect(managePredittore.getConfiguration()).toEqual(k);
});
