import { PartialResponsifyValidationError } from "../errors/partialResponsifyValidationError";
export interface IParseFieldResult {
    name: string;
    type: "final" | "parent";
}
interface IResponseFormatObjectFields {
    [key: string]: ResponseFormatType;
}
export interface IResponseFormatObject {
    fields: IResponseFormatObjectFields;
    type: "object";
}
export interface IResponseFormatString {
    type: "string";
}
export interface IResponseFormatInteger {
    type: "integer";
}
export interface IResponseFormatNumber {
    type: "number";
}
export interface IResponseFormatUuid {
    type: "uuid";
}
export interface IResponseFormatArray {
    items: ResponseFormatType;
    type: "array";
}
export enum PartialResponsifyValidationErrorCode {
    DEFAULT_ERROR = "E0",
    INVALID_FIELD_TYPE = "E1",
    INVALID_FIELD_SYNTAX = "E2",
    INVALID_FIELD_DUPS = "E3",
    INVALID_RESULT_FORMAT = "E4",
    UNSUPPORTED_FORMAT_TYPE = "E5",
    INVALID_FIELD_FORMAT = "E4",
}
export type ResponseFormatType = IResponseFormatObject | IResponseFormatArray | IResponseFormatString |
    IResponseFormatInteger | IResponseFormatNumber | IResponseFormatUuid;

const test: ResponseFormatType = {
    fields: {
        name: {
            type: "string",
        },
    },
    type: "object",
};
export class PartialResponsify {
    // any custom type we should extend it with plugin
    private supportedTypes: string[] = ["string", "array", "object", "number"];
    public parse<T>(fields: string, responseFormat: ResponseFormatType, result: any): T {
        try {
            if (typeof fields !== "string") {
                throw new PartialResponsifyValidationError("Invalid field type", {
                    code: PartialResponsifyValidationErrorCode.INVALID_FIELD_TYPE,
                });
            } else if (!fields.match("^[a-zA-Z0-9\,]*$")) { // don't support nested yet
                throw new PartialResponsifyValidationError("Invalid field syntax", {
                    code: PartialResponsifyValidationErrorCode.INVALID_FIELD_SYNTAX,
                });
            }
            const parseFieldResults = this._parseFields(fields);
            const {errs, val} = this._parseFormat(parseFieldResults, responseFormat, result, "");
            if (errs.length) {
                throw new PartialResponsifyValidationError("Invalid result format", {
                    code: PartialResponsifyValidationErrorCode.INVALID_RESULT_FORMAT,
                    formatErrs: errs,
                });
            }
            return val;
        } catch (err) {
            if (err instanceof PartialResponsifyValidationError) {
                throw err;
            }
            throw new PartialResponsifyValidationError(err.message, {
                code: PartialResponsifyValidationErrorCode.DEFAULT_ERROR,
            });
        }
    }
    private _parseFormat(
        parseFieldResults: IParseFieldResult[], responseFormat: ResponseFormatType, result: any, prefix: string): {
            errs: any[];
            val: any;
        } {
        const parseFieldResultMap: Map<string, IParseFieldResult[]> = new Map();
        const fieldsToParse: string[] = []; // will get from current parseFieldResult
        const errs: any[] = [];
        const invalidFields: any[] = [];
        for (const parseFieldResult of parseFieldResults) {
            if (responseFormat.type === "object"
                && typeof responseFormat.fields[parseFieldResult.name] === "undefined") {
                invalidFields.push(prefix + parseFieldResult.name);
                continue;
            } else if (responseFormat.type === "object"
                && typeof responseFormat.fields[parseFieldResult.name] !== "undefined") {
                if (parseFieldResult.type === "final"
                    && responseFormat.fields[parseFieldResult.name].type === "object") {
                    invalidFields.push(prefix + parseFieldResult.name);
                    continue;
                }
                if (parseFieldResult.type === "final"
                    && responseFormat.fields[parseFieldResult.name].type === "array") {
                    const tmp: any = responseFormat.fields[parseFieldResult.name];
                    if (tmp.items === "object") {
                        invalidFields.push(prefix + parseFieldResult.name);
                        continue;
                    }
                }
                fieldsToParse.push(parseFieldResult.name);
            }
        }
        if (invalidFields.length) {
            throw new PartialResponsifyValidationError(`Invalid fields: ${invalidFields.toString()}`, {
                code: PartialResponsifyValidationErrorCode.INVALID_FIELD_FORMAT,
            });
        }
        let val: any = result;
        if (this.supportedTypes.indexOf(responseFormat.type) === -1) {
            // we should catch this error during development, any new format should be extend by plugin
            throw new PartialResponsifyValidationError(`Unsupported format type: ${responseFormat.type}`, {
                code: PartialResponsifyValidationErrorCode.UNSUPPORTED_FORMAT_TYPE,
            });
        }
        if (result === null) {
            val = null;
        } else if (responseFormat.type === "array" && !Array.isArray(result)) {
            errs.push({
                name: prefix,
                type: responseFormat.type,
            });
        } else if (responseFormat.type === "object" && (typeof result !== "object" || Array.isArray(result))) {
            errs.push({
                name: prefix,
                type: responseFormat.type,
            });
        } else if (responseFormat.type === "string" && typeof result !== "string") {
            errs.push({
                name: prefix,
                type: responseFormat.type,
            });
        } else if (responseFormat.type === "number" && typeof result !== "number") {
            errs.push({
                name: prefix,
                type: responseFormat.type,
            });
        } else if (responseFormat.type === "array") {
            val = [];
            result.forEach((element: any, i: number) => {
                const r = this._parseFormat(parseFieldResults, responseFormat.items, element, prefix + i + ".");
                errs.push.apply(errs, r.errs);
                val.push(r.val);
            });
        } else if (responseFormat.type === "object") {
            val = {};
            Object.keys(responseFormat.fields).forEach((key) => {
                if (typeof result[key] === undefined) {
                    errs.push({
                        name: prefix,
                        type: responseFormat.type,
                    });
                } else if (fieldsToParse.indexOf(key) !== -1) {
                    const fieldFormat = responseFormat.fields[key];
                    const r = this._parseFormat([], fieldFormat, result[key], prefix + key + ".");
                    errs.push.apply(errs, r.errs);
                    val[key] = r.val;
                }
            });
        } else {
            // plugin should be runned before this
            val = result;
        }
        return {errs, val};
    }
    private _parseFields(fields: string): IParseFieldResult[] {
        // need better logic when implement nested field funtionality
        const arr: string[] = fields.split(",");
        const parseResults: IParseFieldResult[] = [];
        for (const field of arr) {
            parseResults.push({
                name: field,
                type: "final",
            });
        }
        const dups = this.findDuplicate(parseResults, "");
        if (dups.length) {
            throw new PartialResponsifyValidationError(`Duplicate fields: ${dups.toString()}`, {
                code: PartialResponsifyValidationErrorCode.INVALID_FIELD_DUPS,
                dups,
            });
        }
        return parseResults;
    }
    private findDuplicate(arr: IParseFieldResult[], prefix: string): string[] {
        const o: string[] = [];
        const dups: string[] = [];
        const result: any = [];

        for (const parseFieldResult of arr) {
            if (o.indexOf(parseFieldResult.name) === -1) {
                o.push(parseFieldResult.name);
            } else {
                dups.push(parseFieldResult.name);
            }
        }
        return dups;
    }
}
