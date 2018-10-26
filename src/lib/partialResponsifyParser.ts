import {generate, Parser} from "pegjs";
import { PartialResponsifyValidationError } from "../errors/partialResponsifyValidationError";
import { PartialResponsifyValidationErrorCode } from "./partialResponsify";

export interface IParseFieldResult {
    children: IParseFieldResult[];
    name: string;
}
// we should refer to the response format to prevent the spammer
export class PartialResponsifyParser {
    private parser: Parser;
    constructor() {
        // put here first, when things stabalized we should import the generated one instead
        this.parser = generate(`
            start = head: (Section) tail: (AddiSection)* { return [head].concat(tail) }
            value_separator = ","
            begin_children = "{"
            end_children = "}"
            AddiField = (value_separator v: (Field) {return v})
            ChildrenSection = begin_children head:(Section) tail:(AddiSection)* end_children {
            return [head].concat(tail)
            }
            Section
            = head:Field children:(ChildrenSection)*
                {
                return children.length ? [head].concat(children) : head;
                }
            AddiSection = (value_separator v: (Section) {return v})
            Field "field"
            = [a-zA-Z][a-zA-Z0-9]* { return text(); }
        `);
    }
    public parse(fields: string): {
        dups: string[];
        parseResults: IParseFieldResult[];
    } {
        try {
            const parseResults: IParseFieldResult[] = this.convertParserArr(this.parser.parse(fields));
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
