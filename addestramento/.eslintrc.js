module.exports = {
    "extends": "airbnb-base",
    "rules": {
        //numero massimo di parametri delle funzioni
        "max-params": ["error", {"max": 4}],
        //lunghezza massima delle righe
        "max-len": ["warn", 80, {"comments": 150}],
        //spazi per indentazione
        indent: ["error", 4],
    }
};
