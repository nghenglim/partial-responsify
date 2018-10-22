# Partial Responsify

[![npm](https://img.shields.io/npm/v/partial-responsify.svg)](https://www.npmjs.com/package/partial-responsify)
[![downloads](https://img.shields.io/npm/dt/partial-responsify.svg)](https://www.npmjs.com/package/partial-responsify)

Validate and return partial response from field, just like graphql, but without the black magic.

Mainly for using with RESTful API gateway

Build with typescript. (Will not even think of making this kind of library without typing)

## Installation
`npm install partial-responsify`

## Usage
A better way is to follow the test/*.test.ts

- simple csv fields
~~~ts
import { PartialResponsify, PartialResponsifyParser, ResponseFormat } from "partial-responsify";

const pr = new PartialResponsify();
const fields = "name,coords";
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
console.log(res);
/*
{
    coords: [[13.37, 1.337], [0, 0]],
    license: "MIT",
    name: "partial-responsify",
}
*/
~~~
- generate schema for use with swagger
~~~ts
import { ResponseFormat, SchemaGenerator } from "partial-responsify";
const sgen = new SchemaGenerator();
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
                        type: "number",
                    },
                },
                type: "object",
            },
        },
        type: "object",
    },
    type: "array",
};
const result = sgen.generate(responseFormat);
console.log(result);
/*
{
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
                        type: "number",
                    },
                },
                type: "object",
            },
        },
        type: "object",
    },
    type: "array",
}
*/
~~~
- nested fields(WIP)
    - google way (WIP): `const fields = "name,license,author(name(first,last),url)"`;
    - graphql way (WIP): `const fields = "name,license,author{name{first,last},url}"`;

## Validation Handling
In case of validation failure, it will return a PartialResponsifyValidationError. The error default with a message, but has sufficient fields to let you format into any language

## Additional Validation
Able to add additional validation by user in case it is not sufficient

## Still thinking
- should we allow optional field?
- should we validate additional type such as minLength, maxLength
