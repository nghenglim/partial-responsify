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
    test("It should parse nested correctly", async (done) => {
        const result = prp.parse("a,b{c,d},e");
        expect(result.parseResults).toEqual([{
            children: [],
            name: "a",
        }, {
            children: [{
                children: [],
                name: "c",
            }, {
                children: [],
                name: "d",
            }],
            name: "b",
        }, {
            children: [],
            name: "e",
        }]);
        done();
    });
    test("It should parse deep nested correctly", async (done) => {
        const result = prp.parse("a,b{c,d,f{g,h}},e");
        expect(result.parseResults).toEqual([{
            children: [],
            name: "a",
        }, {
            children: [{
                children: [],
                name: "c",
            }, {
                children: [],
                name: "d",
            }, {
                children: [{
                    children: [],
                    name: "g",
                }, {
                    children: [],
                    name: "h",
                }],
                name: "f",
            }],
            name: "b",
        }, {
            children: [],
            name: "e",
        }]);
        done();
    });
});
