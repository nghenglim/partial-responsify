import { ResponseFormat } from "./partialResponsify";

/**
 * this is to generate example field as example to query (will be useful for swagger)
 */
export class FieldsExampleGenerator {
    constructor() {
        // future use here to choose various type of style (such as use () or {})
    }
    public generate(responseFormat: ResponseFormat) {
        if (responseFormat.type === "object" || responseFormat.type === "array") {
            return this._generate(responseFormat, "");
        } else {
            return "";
        }
    }
    private _generate(responseFormat: ResponseFormat, objectKey: string): string {
        if (responseFormat.type === "object") {
            const arr: any[] = [];
            Object.keys(responseFormat.fields).forEach((key) => {
                arr.push(this._generate(responseFormat.fields[key], key));
            });
            const joinStr = arr.join(",");
            return objectKey === ""  ? joinStr : `${objectKey}{${joinStr}}`;
        } else if (responseFormat.type === "array") {
            return this._generate(responseFormat.items, objectKey);
        } else {
            return objectKey;
        }
    }
}
