import { PartialResponsify, ResponseFormatType } from "../src";
const pr = new PartialResponsify();

describe("Test main function", () => {
    test("It should parse simple fields from object", async (done) => {
        const fields = "name,coords";
        const responseFormat: ResponseFormatType = {
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
            coords: [[13.37, 1.337], [0, 0]],
            name: "partial-responsify",
        });
        done();
    });
    test("It should parse simple fields from array", async (done) => {
        const fields = "name";
        const responseFormat: ResponseFormatType = {
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
        const res = pr.parse<any>(fields, responseFormat, result);
        expect(res).toEqual([{
            name: "partial-responsify",
        }, {
            name: "partial-responsify",
        }]);
        done();
    });
    test("It should parse simple fields for coords object", async (done) => {
        const fields = "name,coords";
        const responseFormat: ResponseFormatType = {
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
            pr.parse<any>(fields, responseFormat, result);
        }).toThrow();
        done();
    });
    test("It should throw invalid object format", async (done) => {
        const fields = "name";
        const responseFormat: ResponseFormatType = {
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
            pr.parse<any>(fields, responseFormat, result);
        }).toThrow();
        done();
    });
    test("It should throw invalid field format", async (done) => {
        const fields = "author";
        const responseFormat: ResponseFormatType = {
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
            pr.parse<any>(fields, responseFormat, result);
        }).toThrow();
        done();
    });
    test("It should throw invalid string format", async (done) => {
        const fields = "license";
        const responseFormat: ResponseFormatType = {
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
            pr.parse<any>(fields, responseFormat, result);
        }).toThrow();
        done();
    });
    test("It should throw invalid array format", async (done) => {
        const fields = "name";
        const responseFormat: ResponseFormatType = {
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
            pr.parse<any>(fields, responseFormat, result);
        }).toThrow();
        done();
    });
});
