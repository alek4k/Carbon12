const request = require("supertest");
const server = require('../../server');

const s = new server();
s.startServer();

describe("Test the root path", () => {
    test("It should response the GET method", () => {
        return request(s.app)
            .get("/")
            .expect(200);
    });
});
