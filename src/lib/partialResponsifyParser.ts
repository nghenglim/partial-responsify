export type ParseFieldResult = IParseFieldResultFinal | IParseFieldResultParent;
export interface IParseFieldResultFinal {
    name: string;
    type: "final";
}
export interface IParseFieldResultParent {
    children: ParseFieldResult[];
    name: string;
    type: "parent";
}
// we should refer to the response format to prevent the spammer
export class PartialResponsifyParser {
    public parse(fields: string): {
        invalidFormat: boolean;
        dups: string[];
        parseResults: ParseFieldResult[];
    } {
        if (!fields.match("^[a-zA-Z0-9\,]*$")) {
            return {
                dups: [],
                invalidFormat: true,
                parseResults: [],
            };
        }
        // need better logic when implement nested field funtionality
        const arr: string[] = fields.split(",");
        const parseResults: ParseFieldResult[] = [];
        for (const field of arr) {
            parseResults.push({
                name: field,
                type: "final",
            });
        }
        const dups = this.findDuplicate(parseResults, "");
        return {
            dups,
            invalidFormat: false,
            parseResults,
        };
    }
    private findDuplicate(arr: ParseFieldResult[], prefix: string): string[] {
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
