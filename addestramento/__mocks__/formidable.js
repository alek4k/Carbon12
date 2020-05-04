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

const formidable = jest.fn().mockImplementation(() => ({
    IncomingForm: function form() {
        this.parse = function parse() {
            return {
                on(str, f) {
                    if (str === 'field') {
                        f('par1', 'par2');
                    } else if (str === '') {
                        f();
                    }
                },
            };
        };
    },
}));

module.exports = formidable;
