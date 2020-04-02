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

   let json_data = svmAdapter.train(data, labels);
   let result = [];
   for(var i in json_data)
    result.push([i]);
   expect(result).toEqual(k);
});

// https://jestjs.io/docs/en/expect#expectarraycontainingarray