const request = require("supertest");
const server = require('../../server');


describe("Test the root path", () => {
    test("It should response the GET method", () => {
        const s = new server();
        s.startServer();

        return request(s.app)
            .get("/")
            .expect(200);
    });
});
