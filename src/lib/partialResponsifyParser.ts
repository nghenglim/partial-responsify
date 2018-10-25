export interface IParseFieldResult {
    children: IParseFieldResult[];
    name: string;
}
// we should refer to the response format to prevent the spammer
export class PartialResponsifyParser {
    public parse(fields: string): {
        invalidFormat: boolean;
        dups: string[];
        parseResults: IParseFieldResult[];
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
        const parseResults: IParseFieldResult[] = [];
        for (const field of arr) {
            parseResults.push({
                children: [],
                name: field,
            });
        }
        const dups = this.findDuplicate(parseResults, "");
        return {
            dups,
            invalidFormat: false,
            parseResults,
        };
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
