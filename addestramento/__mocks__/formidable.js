/**
 * File name: backendSrv.js
 * Date: 2020-04-02
 *
 * @file Mock
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version b.Y.Z
 *
 * Changelog: modifiche effettuate
 */

const formidable = {

    parseMOCK: jest.fn(),
    onMOCK: jest.fn(),

    IncomingForm: function fun() {
        this.parse = formidable.parseMOCK;
        this.on = formidable.onMOCK;
    },
};

/* const IncomingFormMOCK = jest.fn(() => {
    this.multiples = false;
    this.on = '';
});

const formidable = {
    IncomingForm: IncomingFormMOCK,
}; */

module.exports = formidable;
