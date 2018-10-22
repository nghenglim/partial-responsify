import { PartialResponsify, ResponseFormat } from "../src";
const pr = new PartialResponsify();

describe("Test nested fields", () => {
    test("It should parse nested fields from object", async (done) => {
        const fields = "auther{url},name";
        const responseFormat: ResponseFormat = {
            fields: {
                author: {
                    fields: {
                        url: {
                            type: "string",
                        },
                    },
                    type: "object",
                },
                license: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
            },
            type: "object",
        };

        const result = {
            author: {
                name: {
                    first: "Liam",
                    last: "Ng",
                },
                url: "https://www.leliam.com",
            },
            coords: [[13.37, 1.337], [0, 0]],
            license: "MIT",
            name: "partial-responsify",
        };
        const res = pr.parse<any>(fields, responseFormat, result);
        expect(res).toEqual({
            author: {
                url: "https://www.leliam.com",
            },
            name: "partial-responsify",
        });
        done();
    });
});
