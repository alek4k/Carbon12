module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "header"
    ],
    "rules": {
        //header da utilizzare in tutti gli script
        "header/header": [2, "block", [
            "*", {"pattern": " * File name: [a-z | A-Z]"}, {"pattern": " * Date: \\d{4}-\\d{2}-\\d{2}$"}, " *",
            {"pattern": " * @file [a-z | A-Z]"}, {"pattern": " * @author [a-z | A-Z]"},
            {"pattern": " * @version [a-z | A-Z | 0-9]"}, " *", {"pattern": " * Changelog: [a-z | A-Z]"}, " "
        ]],
        //numero massimo di parametri delle funzioni
        "max-params": ["error", {"max": 4}],
        //lunghezza massima delle righe
        "max-len": ["warn", 80, {"comments": 150}],
        //spazi per indentazione
        indent: ["error", 4],
        //permesso di utilizzare operatore ++ e --
        "no-plusplus": "off",
        //permesso di utilizzare la stampa su console
        "no-console": "off",
        //permesso di concatenare stringhe
        "prefer-template": "off",
        "prefer-destructuring": "off",
        //permesso di utilizzare determinate sintassi di JavaScript
        "no-restricted-syntax": "off",
        //permesso di utilizzare parseInt senza il secondo argomento
        radix: "off"
    }
};
