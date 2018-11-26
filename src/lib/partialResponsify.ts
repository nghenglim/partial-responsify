import { PartialResponsifyValidationError } from "../errors/partialResponsifyValidationError";
import {
    IParseFieldResult,
    PartialResponsifyParser,
} from "./partialResponsifyParser";
interface IResponseFormatObjectFields {
    [key: string]: ResponseFormat;
}
interface IParseResponseFormatTuple {
    0: string[];
    1: string;
}
export interface IResponseFormatObject {
    fields: IResponseFormatObjectFields;
    type: "object";
}
export interface IResponseFormatString {
    format?: string;
    type: "string";
}
export interface IResponseFormatInteger {
    type: "integer";
}
export interface IResponseFormatBoolean {
    type: "boolean";
}
export interface IResponseFormatNumber {
    type: "number";
}
export interface IResponseFormatArray {
    items: ResponseFormat;
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
export type ResponseFormat = IResponseFormatObject | IResponseFormatArray | IResponseFormatString |
    IResponseFormatInteger | IResponseFormatNumber | IResponseFormatBoolean;

export class PartialResponsify {
    private parser: PartialResponsifyParser;
    // any custom type we should extend it with plugin
    private supportedTypes: string[] = ["string", "array", "object", "number", "integer", "boolean"];
    constructor() {
        // dont make it injectable because the syntax have not confirm yet
        this.parser = new PartialResponsifyParser();
    }
    public parseFields(fields: string, responseFormat: ResponseFormat): IParseResponseFormatTuple[] {
        try {
            if (typeof fields !== "string") {
                throw new PartialResponsifyValidationError("Invalid field type", {
                    code: PartialResponsifyValidationErrorCode.INVALID_FIELD_TYPE,
                });
            }
            const {dups, parseResults} = this.parser.parse(fields);
            if (dups.length) {
                throw new PartialResponsifyValidationError(`Duplicate fields: ${dups.toString()}`, {
                    code: PartialResponsifyValidationErrorCode.INVALID_FIELD_DUPS,
                    dups,
                });
            }
            return this._parseResponseFormat(parseResults, responseFormat, []);
        } catch (err) {
            if (err instanceof PartialResponsifyValidationError) {
                throw err;
            }
            throw new PartialResponsifyValidationError(err.message, {
                code: PartialResponsifyValidationErrorCode.DEFAULT_ERROR,
            });
        }
    }
    public parseResult<T>(
            fieldsToParse: IParseResponseFormatTuple[], responseFormat: ResponseFormat, result: any): T {
        try {
            const {errs, val} = this._parseFormat(fieldsToParse, responseFormat, result, []);
            if (errs.length) {
                throw new PartialResponsifyValidationError(`Invalid result format`, {
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
    private _parseResponseFormat(parseFieldResults: IParseFieldResult[], responseFormat: ResponseFormat,
                                 prefix: string[]): IParseResponseFormatTuple[] {
        const fieldsToParse: IParseResponseFormatTuple[] = []; // will get from current parseFieldResult
        const invalidFields: any[] = [];
        const incompleteFields: any[] = [];
        for (const parseFieldResult of parseFieldResults) {
            if (parseFieldResult.children.length === 0) {
                // the children need to read from the object
                if (responseFormat.type === "object") {
                    if (typeof responseFormat.fields[parseFieldResult.name] === "undefined") {
                        invalidFields.push(parseFieldResult.name);
                        continue;
                    }
                    fieldsToParse.push([prefix, parseFieldResult.name]);
                } else if (responseFormat.type === "array") {
                    fieldsToParse.push.apply(
                        fieldsToParse,
                        this._parseResponseFormat(
                            [parseFieldResult], responseFormat.items, prefix),
                    );
                }
            } else {
                if (responseFormat.type === "object") {
                    if (typeof responseFormat.fields[parseFieldResult.name] === "undefined") {
                        invalidFields.push(parseFieldResult.name);
                        continue;
                    }
                    if (responseFormat.fields[parseFieldResult.name].type === "array") {
                        fieldsToParse.push.apply(
                            fieldsToParse,
                            this._parseResponseFormat(
                                parseFieldResult.children,
                                responseFormat.fields[parseFieldResult.name],
                                prefix.concat([parseFieldResult.name])),
                        );
                    } else if (responseFormat.fields[parseFieldResult.name].type === "object") {
                        fieldsToParse.push.apply(
                            fieldsToParse,
                            this._parseResponseFormat(
                                parseFieldResult.children,
                                responseFormat.fields[parseFieldResult.name],
                                prefix.concat([parseFieldResult.name])),
                        );
                    } else {
                        fieldsToParse.push([prefix, parseFieldResult.name]);
                    }
                } else if (responseFormat.type === "array") {
                    if (responseFormat.items.type === "array") {
                        fieldsToParse.push.apply(
                            fieldsToParse,
                            this._parseResponseFormat(
                                [parseFieldResult], responseFormat.items, prefix),
                        );
                    } else if (responseFormat.items.type === "object") {
                        fieldsToParse.push.apply(
                            fieldsToParse,
                            this._parseResponseFormat(
                                [parseFieldResult], responseFormat.items, prefix),
                        );
                    } else {
                        fieldsToParse.push([prefix, parseFieldResult.name]);
                    }
                } else {
                    invalidFields.push(parseFieldResult.name);
                }
            }
        }
        if (invalidFields.length) {
            throw new PartialResponsifyValidationError(`Invalid fields: ${invalidFields.toString()}`, {
                code: PartialResponsifyValidationErrorCode.INVALID_FIELD_FORMAT,
                formatErrs: invalidFields,
            });
        }
        if (incompleteFields.length) {
            throw new PartialResponsifyValidationError(`Incomplete fields: ${incompleteFields.toString()}`, {
                code: PartialResponsifyValidationErrorCode.INVALID_FIELD_FORMAT,
                formatErrs: incompleteFields,
            });
        }
        return fieldsToParse;
    }
    private _formatErrCheck(responseFormat: ResponseFormat, result: any): boolean {
        if (responseFormat.type === "array" && !Array.isArray(result)) {
            return true;
        } else if (responseFormat.type === "object" && (typeof result !== "object" || Array.isArray(result))) {
            return true;
        } else if (responseFormat.type === "string" && typeof result !== "string") {
            return true;
        } else if (responseFormat.type === "boolean" && typeof result !== "boolean") {
            return true;
        } else if (responseFormat.type === "number" && typeof result !== "number") {
            return true;
        } else if (responseFormat.type === "integer" && typeof result !== "number") {
            return true;
        } else if (responseFormat.type === "integer" && !Number.isInteger(result)) {
            return true;
        }
        return false;
    }
    private _arrEq(arr1: string[], arr2: string[]): boolean {
        if (arr1.length === arr2.length) {
            return true;
        } else {
            arr1.forEach((element: any, i: number) => {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            });
        }
        return true;
      }
    private _parseFormat(
        fieldsToParseOri: IParseResponseFormatTuple[], responseFormat: ResponseFormat, result: any, prefix: string[]): {
            errs: any[];
            val: any;
        } {
        const fieldsToParse = JSON.parse(JSON.stringify(fieldsToParseOri));
        const errs: any = [];
        let val: any = result;
        if (this.supportedTypes.indexOf(responseFormat.type) === -1) {
            // we should catch this error during development, any new format should be extend by plugin
            throw new PartialResponsifyValidationError(`Unsupported format type: ${responseFormat.type}`, {
                code: PartialResponsifyValidationErrorCode.UNSUPPORTED_FORMAT_TYPE,
            });
        }
        if (result === null) {
            val = null;
        } else if (this._formatErrCheck(responseFormat, result)) {
            errs.push({
                name: prefix,
                type: responseFormat.type,
            });
        } else if (responseFormat.type === "array") {
            val = [];
            result.forEach((element: any, i: number) => {
                const r = this._parseFormat(
                    fieldsToParse, responseFormat.items, element, prefix);
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
                } else {
                    // TODO: dont lazy add some type
                    const samePrefixes: Map<string, any> = new Map();
                    for (const ftparse of fieldsToParse) {
                        const ftprefix = ftparse[0];
                        const ftkey = ftparse[1];
                        const newPrefix = prefix.concat(key);
                        if (ftprefix.length === 0 && ftkey === key) {
                            const fieldFormat = responseFormat.fields[key];
                            const r = this._parseFormat([], fieldFormat, result[key], newPrefix);
                            errs.push.apply(errs, r.errs);
                            val[key] = r.val;
                        } else if (ftprefix.length > 0) {
                            if (ftprefix[0] === key) {
                                ftprefix.shift();
                                const fieldFormat = responseFormat.fields[key];
                                if (samePrefixes.has(key)) {
                                    const tmp = samePrefixes.get(key);
                                    tmp.arr.push([ftprefix, ftkey]);
                                    samePrefixes.set(key, tmp);
                                } else {
                                    samePrefixes.set(key, {
                                        arr: [[ftprefix, ftkey]],
                                        fieldFormat,
                                        prefix: newPrefix,
                                        result: result[key],
                                    });
                                }
                            }
                        }
                    }
                    for (const entry of samePrefixes.entries()) {
                        const r = this._parseFormat(
                            entry[1].arr, entry[1].fieldFormat, entry[1].result, entry[1].prefix);
                        errs.push.apply(errs, r.errs);
                        val[key] = r.val;
                    }
                }
            });
        } else {
            // plugin should be runned before this
            val = result;
        }
        return {errs, val};
    }
}
