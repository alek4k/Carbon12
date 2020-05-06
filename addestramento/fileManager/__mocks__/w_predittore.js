/**
 * File name: w_predittore.js
 * Date: 2020-03-28
 *
 * @file Interfaccia per la gestione dei modelli
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.0.0
 *
 * Changelog: creazione interfaccia
 */

const setHeaderMOCK = jest.fn(() => {
});

const setDataEntryMOCK = jest.fn(() => {
});

const setModelMOCK = jest.fn(() => {
});

const setFileVersionMOCK = jest.fn(() => {
});

const setNotesMOCK = jest.fn(() => {
});

const setConfigurationMOCK = jest.fn(() => {
});

const saveMOCK = jest.fn(() => {
    const k = {

    };
    return k;
});

const wpredittore = jest.fn().mockImplementation(() => ({
    setHeader: setHeaderMOCK,
    setDataEntry: setDataEntryMOCK,
    setModel: setModelMOCK,
    setFileVersion: setFileVersionMOCK,
    setNotes: setNotesMOCK,
    setConfiguration: setConfigurationMOCK,
    save: saveMOCK,
}));

module.exports = {
    wpredittore, setHeaderMOCK, setDataEntryMOCK, setModelMOCK, setFileVersionMOCK, setNotesMOCK, setConfigurationMOCK, saveMOCK,
};
