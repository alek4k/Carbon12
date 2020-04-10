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

export const getMock = jest.fn((url) => {
    if (url === 'api/datasources') {
        return new Promise((resolve) => {
            resolve([{
                name: 'CPU',
                url: 'http://localhost:8086',
                database: 'telegraf',
            },
            {
                name: 'RAM',
                url: 'http://localhost:8086',
                database: 'telegraf',
            },
            {
                name: 'DISK',
                url: 'http://localhost:8086',
                database: 'telegraf',
            },
            ]);
        });
    }
    console.log('Unhandled get in backendSrvMock:');
    console.log('Url: ' + url);
    return undefined;
});

export const postMock = jest.fn((url, data) => {
    console.log('Unhandled post in backendSrvMock:');
    console.log('Url: ' + url);
    console.log('Data:');
    console.log(data);
    return undefined;
});

const backendSrvMock = jest.fn().mockImplementation(() => ({
    get: getMock,
    post: postMock,
}));

export default backendSrvMock;
