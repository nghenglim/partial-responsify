import { PartialResponsify, PartialResponsifyParser, ResponseFormat } from "../src";
const pr = new PartialResponsify();

describe("Test main function", () => {
    test("It should parse simple fields from object", async (done) => {
        const fields = "name,coords,payload";
        const responseFormat: ResponseFormat = {
            fields: {
                coords: {
                    items: {
                        items: {
                            type: "number",
                        },
                        type: "array",
                    },
                    type: "array",
                },
                license: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
                payload: {
                    type: "any",
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
            payload: {
                a: 1,
                b: "23",
                c: [45],
                d: {
                    e: 6,
                },
            },
        };
        const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        expect(res).toEqual({
            coords: [[13.37, 1.337], [0, 0]],
            name: "partial-responsify",
            payload: {
                a: 1,
                b: "23",
                c: [45],
                d: {
                    e: 6,
                },
            },
        });
        done();
    });
    test("It should return null from empty json", async (done) => {
        const fields = "name,license,payload";
        const responseFormat: ResponseFormat = {
            fields: {
                license: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
                payload: {
                    type: "any",
                },
            },
            type: "object",
        };

        const result = {
        };
        const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        expect(res).toEqual({
            license: null,
            name: null,
            payload: null,
        });
        done();
    });
    test("It should return null if return result is null", async (done) => {
        const fields = "name,license";
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

        const result: any = null;
        const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        expect(res).toEqual(null);
        done();
    });
    test("It should parse simple fields from array", async (done) => {
        const fields = "name";
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
        }, {
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
        const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        expect(res).toEqual([[{
            name: "partial-responsify",
        }, {
            name: "partial-responsify",
        }]]);
        done();
    });
    test("It should parse simple fields for coords object", async (done) => {
        const fields = "name,coords";
        const responseFormat: ResponseFormat = {
            fields: {
                geo: {
                    items: {
                        type: "number",
                    },
                    type: "array",
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
            coords: [13.37, 1.337],
            license: "MIT",
            name: "partial-responsify",
        };
        expect(() => {
            const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        }).toThrow();
        done();
    });
    test("It should throw invalid object format", async (done) => {
        const fields = "name";
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
        expect(() => {
            const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        }).toThrow();
        done();
    });
    test("It should throw invalid field format", async (done) => {
        const fields = "author";
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

        const result = {
            author: {
                name: {
                    first: "Liam",
                    last: "Ng",
                },
                url: "https://www.leliam.com",
            },
            license: "MIT",
            name: "partial-responsify",
        };
        expect(() => {
            const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        }).toThrow();
        done();
    });
    test("It should throw invalid string format", async (done) => {
        const fields = "license";
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

        const result = {
            author: {
                name: {
                    first: "Liam",
                    last: "Ng",
                },
                url: "https://www.leliam.com",
            },
            license: 1337,
            name: "partial-responsify",
        };
        expect(() => {
            const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        }).toThrow();
        done();
    });
    test("It should throw invalid array format", async (done) => {
        const fields = "name";
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
        }, {
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
        expect(() => {
            const res = pr.parseResult<any>(pr.parseFields(fields, responseFormat), responseFormat, result);
        }).toThrow();
        done();
    });
});
