import { PartialResponsify, PartialResponsifyParser, ResponseFormat } from "../src";
const pr = new PartialResponsify();
const prp = new PartialResponsifyParser();
describe("Test parse response format", () => {
    test("It should throw invalid object format", async (done) => {
        const fields = "nono";
        const responseFormat: ResponseFormat = {
            fields: {
                license: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
            },
            type: "object",
        };

        const result = [{
            author: {
                name: {
                    first: "Liam",
                    last: "Ng",
                },
                url: "https://www.leliam.com",
            },
            license: "MIT",
            name: "partial-responsify",
        }];
        try {
            pr.parseResponseFormat(prp.parse(fields).parseResults, responseFormat, []);
            expect(false).toBe(true);
        } catch (err) {
            expect(err.formatErrs).toEqual(["nono"]);
        }
        done();
    });
    test("It should throw invalid result format", async (done) => {
        const fields = "nana";
        const responseFormat: ResponseFormat = {
            items: {
                items: {
                    fields: {
                        license: {
                            type: "string",
                        },
                        name: {
                            type: "string",
                        },
                    },
                    type: "object",
                },
                type: "array",
            },
            type: "array",
        };

        const result = [[{
            author: {
                name: {
                    first: "Liam",
                    last: "Ng",
                },
                url: "https://www.leliam.com",
            },
            license: "MIT",
            name: "partial-responsify",
        }]];
        try {
            pr.parseResponseFormat(prp.parse(fields).parseResults, responseFormat, []);
            expect(false).toBe(true);
        } catch (err) {
            expect(err.formatErrs).toEqual(["nana"]);
        }
        done();
    });
});
