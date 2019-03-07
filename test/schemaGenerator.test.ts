import { ResponseFormat, SchemaGenerator } from "../src";
const sgen = new SchemaGenerator();

describe("Test Schema Generator", () => {
    test("It should parse the simple responseFormat and return the openapi3 response schema", async (done) => {
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
        const result = sgen.generate(responseFormat);
        expect(result).toEqual({
            properties: {
                license: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
            },
            type: "object",
        });
        done();
    });
    test("It should parse the array responseFormat and return the openapi3 response schema", async (done) => {
        const responseFormat: ResponseFormat = {
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
        const result = sgen.generate(responseFormat);
        expect(result).toEqual({
            items: {
                properties: {
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
        });
        done();
    });
    test("It should support various response type", async (done) => {
        const responseFormat: ResponseFormat = {
            items: {
                fields: {
                    a: {
                        type: "number",
                    },
                    b: {
                        type: "string",
                    },
                    c: {
                        type: "integer",
                    },
                    d: {
                        format: "uuid",
                        type: "string",
                    },
                    e: {
                        fields: {
                            a: {
                                type: "boolean",
                            },
                        },
                        type: "object",
                    },
                    f: {
                        type: "any",
                    },
                },
                type: "object",
            },
            type: "array",
        };
        const result = sgen.generate(responseFormat);
        expect(result).toEqual({
            items: {
                properties: {
                    a: {
                        type: "number",
                    },
                    b: {
                        type: "string",
                    },
                    c: {
                        type: "integer",
                    },
                    d: {
                        format: "uuid",
                        type: "string",
                    },
                    e: {
                        properties: {
                            a: {
                                type: "boolean",
                            },
                        },
                        type: "object",
                    },
                    f: {},
                },
                type: "object",
            },
            type: "array",
        });
        done();
    });
});
