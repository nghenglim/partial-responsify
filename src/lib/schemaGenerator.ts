import { ResponseFormat } from "./partialResponsify";
type OpenApiSchema = IOpenApiSchemaString | IOpenApiSchemaInteger
| IOpenApiSchemaNumber | IOpenApiSchemaObject | IOpenApiSchemaArray | IOpenApiSchemaBoolean;
export interface IOpenApiSchemaObject {
    type: "object";
    properties: IOpenApiSchemaProperties;
}
export interface IOpenApiSchemaProperties {
    [key: string]: OpenApiSchema;
}
export interface IOpenApiSchemaString {
    type: "string";
    description?: string;
}
export interface IOpenApiSchemaArray {
    type: "array";
    items: OpenApiSchema;
    description?: string;
}
export interface IOpenApiSchemaInteger {
    type: "integer";
    description?: string;
}
export interface IOpenApiSchemaNumber {
    type: "number";
    description?: string;
}
export interface IOpenApiSchemaBoolean {
    type: "boolean";
    description?: string;
}

export class SchemaGenerator {
    public generate(responseFormat: ResponseFormat): OpenApiSchema {
        if (responseFormat.type === "object") {
            const properties: any = {};
            Object.keys(responseFormat.fields).forEach((key) => {
                properties[key] = this.generate(responseFormat.fields[key]);
            });
            return {
                properties,
                type: "object",
            };
        }
        if (responseFormat.type === "array") {
            return {
                items: this.generate(responseFormat.items),
                type: "array",
            };
        }
        if (responseFormat.type === "string") {
            const tmp: any = {
                type: "string",
            };
            if (typeof responseFormat.format !== "undefined") {
                tmp.format = responseFormat.format;
            }
            return tmp;
        }
        if (responseFormat.type === "integer") {
            return {
                type: "integer",
            };
        }
        if (responseFormat.type === "number") {
            return {
                type: "number",
            };
        }
        if (responseFormat.type === "boolean") {
            return {
                type: "boolean",
            };
        }
        // should support plugin schema here
        throw new Error("unsupported responseFormat type");
    }
}
