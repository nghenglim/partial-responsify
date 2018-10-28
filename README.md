# Partial Responsify

[![npm](https://img.shields.io/npm/v/partial-responsify.svg)](https://www.npmjs.com/package/partial-responsify)
[![downloads](https://img.shields.io/npm/dt/partial-responsify.svg)](https://www.npmjs.com/package/partial-responsify)

Validate and return partial response from field, just like graphql, but without the black magic.

Mainly for using with RESTful API gateway

Build with typescript. (Will not even think of making this kind of library without typing)

## Installation
`npm install --save-exact  partial-responsify`

Note: install the exact version or the patch version before the project pass 1.0, breaking change might happen in minor release pre 1.0

## Usage
A better way is to follow the test/*.test.ts

- simple csv with graphql like nested field
~~~ts
import { PartialResponsify, PartialResponsifyParser, ResponseFormat } from "partial-responsify";

const pr = new PartialResponsify();
const fields = "name,coords,author{name{first}}";
const responseFormat: ResponseFormat = {
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
const fieldsToParse = pr.parseFields(fields, responseFormat);

// and then you perform some logic and got the result
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
const res = pr.parseResult<any>(fieldsToParse, responseFormat, result);
console.log(res);
/*
{ author: { name: { first: 'Liam' } },
  coords: [ [ 13.37, 1.337 ], [ 0, 0 ] ],
  name: 'partial-responsify' }
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
- nested fields
    - graphql way: `const fields = "name,license,author{name{first,last},url}"`;

## Validation Handling
In case of validation failure, it will return a PartialResponsifyValidationError. The error default with a message, but has sufficient fields to let you format into any language

## Additional Validation
Able to add additional validation by user in case it is not sufficient

## Still thinking
- should we support google way: `const fields = "name,license,author(name(first,last),url)"`;
- should we allow optional field?
- should we validate additional type such as minLength, maxLength
