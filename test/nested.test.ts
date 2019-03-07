import { PartialResponsify, ResponseFormat } from "../src";
const pr = new PartialResponsify();

describe("Test nested fields", () => {
    test("It should parse nested fields from object", async (done) => {
        const fields = "author{payload,url},name";
        const responseFormat: ResponseFormat = {
            fields: {
                author: {
                    fields: {
                        payload: {
                            type: "any",
                        },
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
                payload: {
                    a: 1,
                    b: "23",
                    c: [45],
                    d: {
                        e: 6,
                    },
                },
                url: "https://www.leliam.com",
            },
            coords: [[13.37, 1.337], [0, 0]],
            license: "MIT",
            name: "partial-responsify",
        };
        const fieldsToParse = pr.parseFields(fields, responseFormat);
        const res = pr.parseResult(fieldsToParse, responseFormat, result);
        expect(res).toEqual({
            author: {
                payload: {
                    a: 1,
                    b: "23",
                    c: [45],
                    d: {
                        e: 6,
                    },
                },
                url: "https://www.leliam.com",
            },
            name: "partial-responsify",
        });
        done();
    });
    test("It should parse nested fields from object with empty json", async (done) => {
        const fields = "author{url},name";
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
        };
        const fieldsToParse = pr.parseFields(fields, responseFormat);
        const res = pr.parseResult(fieldsToParse, responseFormat, result);
        expect(res).toEqual({
            author: null,
            name: null,
        });
        done();
    });
    test("It should parse deep nested fields from array object", async (done) => {
        const fields = "author{name{first,last}},name";
        const responseFormat: ResponseFormat = {
            items: {
                fields: {
                    author: {
                        fields: {
                            name: {
                                fields: {
                                    first: {
                                        type: "string",
                                    },
                                    last: {
                                        type: "string",
                                    },
                                },
                                type: "object",
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
            },
            type: "array",
        };

        const result = [{
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
        }];
        const fieldsToParse = pr.parseFields(fields, responseFormat);
        expect(fieldsToParse).toEqual([[["author", "name"], "first"], [["author", "name"], "last"], [[], "name"]]);
        const res = pr.parseResult(fieldsToParse, responseFormat, result);
        expect(res).toEqual([{
            author: {
                name: {
                    first: "Liam",
                    last: "Ng",
                },
            },
            name: "partial-responsify",
        }]);
        done();
    });
    test("It should parse deep nested fields from object array", async (done) => {
        const fields = "authors{name{first}},name";
        const responseFormat: ResponseFormat = {
            fields: {
                authors: {
                    items: {
                        fields: {
                            name: {
                                fields: {
                                    first: {
                                        type: "string",
                                    },
                                },
                                type: "object",
                            },
                        },
                        type: "object",
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
            authors: [{
                name: {
                    first: "Liam",
                    last: "Ng",
                },
                url: "https://www.leliam.com",
            }, {
                name: {
                    first: "Liam",
                    last: "Ng",
                },
                url: "https://www.leliam.com",
            }],
            coords: [[13.37, 1.337], [0, 0]],
            license: "MIT",
            name: "partial-responsify",
        };
        const fieldsToParse = pr.parseFields(fields, responseFormat);
        expect(fieldsToParse).toEqual([[["authors", "name"], "first"], [[], "name"]]);
        const res = pr.parseResult(fieldsToParse, responseFormat, result);
        expect(res).toEqual({
            authors: [{
                name: {
                    first: "Liam",
                },
            }, {
                name: {
                    first: "Liam",
                },
            }],
            name: "partial-responsify",
        });
        done();
    });
    test("It should not throw error on deep nested fields from empty array", async (done) => {
        const fields = "authors{name{first}},name";
        const responseFormat: ResponseFormat = {
            fields: {
                authors: {
                    items: {
                        fields: {
                            name: {
                                fields: {
                                    first: {
                                        type: "string",
                                    },
                                },
                                type: "object",
                            },
                        },
                        type: "object",
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
            authors: [] as any,
            coords: [[13.37, 1.337], [0, 0]],
            license: "MIT",
            name: "partial-responsify",
        };
        const fieldsToParse = pr.parseFields(fields, responseFormat);
        expect(fieldsToParse).toEqual([[["authors", "name"], "first"], [[], "name"]]);
        const res = pr.parseResult(fieldsToParse, responseFormat, result);
        expect(res).toEqual({
            authors: [],
            name: "partial-responsify",
        });
        done();
    });
});
