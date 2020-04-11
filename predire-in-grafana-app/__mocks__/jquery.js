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


const $ = {
    ajax(req) {
        if (req.data === 'q=show field keys on telegraf') {
            const res = {
                results: [
                    {
                        statement_id: 0,
                        series: [
                            {
                                name: 'cpu',
                                columns: [
                                    'fieldKey',
                                    'fieldType',
                                ],
                                values: [
                                    [
                                        'usage_guest',
                                        'float',
                                    ],
                                ],
                            },
                        ],
                    },
                ],
            };
            req.success(res);
        } else if (req.data === 'q=show tag values on "telegraf" with key = "instance"') {
            const res = {
                results: [
                    {
                        statement_id: 0,
                        series: [
                            {
                                name: 'cpu',
                                columns: [
                                    'fieldKey',
                                    'fieldType',
                                ],
                                values: [
                                    [
                                        'instance',
                                        '0',
                                    ],
                                    [
                                        'instance',
                                        '1',
                                    ],
                                ],
                            },
                        ],
                    },
                ],
            };
            req.success(res);
        } else {
            console.log('Undefined query:');
            console.log(req.data);
            return undefined;
        }
        return undefined;
    },
};
export default $;
