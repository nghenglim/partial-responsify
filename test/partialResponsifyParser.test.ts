import { PartialResponsifyParser } from "../src";

const prp = new PartialResponsifyParser();

describe("Test parser", () => {
    test("It should detect dups correctly", async (done) => {
        const result = prp.parse("a,b,c,a,c");
        expect(result.dups).toEqual(["a", "c"]);
        done();
    });
    test("It should parse csv correctly", async (done) => {
        const result = prp.parse("a,b");
        expect(result.parseResults).toEqual([{
            children: [],
            name: "a",
        }, {
            children: [],
            name: "b",
        }]);
        done();
    });
});
