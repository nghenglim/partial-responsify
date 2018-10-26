import { PartialResponsifyValidationError } from "../errors/partialResponsifyValidationError";
import {parse} from "../pegjs/gpy";
import { PartialResponsifyValidationErrorCode } from "./partialResponsify";

export interface IParseFieldResult {
    children: IParseFieldResult[];
    name: string;
}
// we should refer to the response format to prevent the spammer
export class PartialResponsifyParser {
    public parse(fields: string): {
        dups: string[];
        parseResults: IParseFieldResult[];
    } {
        try {
            const parseResults: IParseFieldResult[] = this.convertParserArr(parse(fields));
            const dups = this.findDuplicate(parseResults, "");
            return {
                dups,
                parseResults,
            };
        } catch (err) {
            throw new PartialResponsifyValidationError(`Invalid field syntax: ${err.message}`, {
                code: PartialResponsifyValidationErrorCode.INVALID_FIELD_SYNTAX,
            });
        }
    }
    private convertParserArr(arr: any[]): IParseFieldResult[] {
        const parseResults: any[] = [];
        for (const section of arr) {
            if (Array.isArray(section) && section.length === 2) {
                parseResults.push({
                    children: this.convertParserArr(section[1]),
                    name: section[0],
                });
            } else if (Array.isArray(section) && section.length !== 2) {
                throw new PartialResponsifyValidationError(`Parser logic error`, {
                    code: PartialResponsifyValidationErrorCode.DEFAULT_ERROR,
                });
            } else {
                parseResults.push({
                    children: [],
                    name: section,
                });
            }
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
