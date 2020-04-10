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
        } else if (req.data === 'q=show tag values on telegraf with key = "instance"') {
            const res = {};
            res.results = [];
            res.results[0] = {};
            res.results[0].series = [];
            res.results[0].series[0] = {
                name: 'testDataSource',
            };
            req.success(res);
        }
        return undefined;
    },
};
export default $;
