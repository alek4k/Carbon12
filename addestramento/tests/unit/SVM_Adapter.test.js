const SvmAdapter = require('../../models/SVM_Adapter');

const svmAdapter = new SvmAdapter();

test("It should return JSON file with SVM configuration", () => {
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

   const k = {};
   k._parametroN = "numero di dati inseriti";
   k.N = 10;
   k._parametroD = "numero di sorgenti analizzate";
   k.D = 2;
   k._parametroB = "bias: coefficiente additivo del calcolo della SVM";
   k.b = -0.000054784000000113187;
   k.kernelType = "linear";
   k._parametroW = "weights: coefficienti moltiplicativi del calcolo della SVM";
   k.w = [0.9992256544000001,
    +     0.3354737567999997];

   expect(svmAdapter.train(data, labels)).toEqual(k);
});