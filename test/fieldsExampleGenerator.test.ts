import { FieldsExampleGenerator, ResponseFormat } from "../src";
const fegen = new FieldsExampleGenerator();

describe("Test FieldsExampleGenerator", () => {
    test("It should generate correct example", async (done) => {
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
        const result = fegen.generate(responseFormat);
        expect(result).toEqual("license,name");
        done();
    });
    test("It should generate correct example nested", async (done) => {
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
                                    last: {
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
        const result = fegen.generate(responseFormat);
        expect(result).toEqual("authors{name{first,last}},license,name");
        done();
    });
    test("It should generate correct example nested array", async (done) => {
        const responseFormat: ResponseFormat = {
            items: {
                fields: {
                    authors: {
                        items: {
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
            },
            type: "array",
        };
        const result = fegen.generate(responseFormat);
        expect(result).toEqual("authors{name{first,last}},license,name");
        done();
    });
});
