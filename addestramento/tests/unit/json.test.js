const fs = require('fs');
const RPredittore = require('../../fileManager/r_predittore.js');


describe("Test json", () => {
    test("It should response that file.json was written correctly", () => {
        const managePredittore = new RPredittore(JSON.parse(
            fs.readFileSync('./tests/files/predittore_test.json').toString(),
        ));

        expect(managePredittore.getTitle()).toEqual("Carbon12 Predire in Grafana");

        expect(managePredittore.getDataEntry()).toEqual(['A', 'B']);

        expect(managePredittore.getModel()).toEqual('SVM');

        expect(managePredittore.getFileVersion()).toBe(0);

        expect(managePredittore.getNotes()).toEqual("test");

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
});
