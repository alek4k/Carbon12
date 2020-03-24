const fs = require('fs');
const RPredittore = require('../../fileManager/r_predittore.js');

const managePredittore = new RPredittore(JSON.parse(
    fs.readFileSync('./tests/files/predittore_test.json').toString(),
));

describe("Test json", () => {
    test("It should response that file.json was written correctly", () => {
        const title = "Carbon12 Predire in Grafana";
        expect(managePredittore.getTitle()).toEqual(title);

        const source = ['A', 'B'];
        expect(managePredittore.getDataEntry()).toEqual(source);

        const model = 'SVM';
        expect(managePredittore.getModel()).toEqual(model);

        const fileVersion = 0;
        expect(managePredittore.getFileVersion()).toBe(fileVersion);

        const nota = "test";
        expect(managePredittore.getNotes()).toEqual(nota);

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
