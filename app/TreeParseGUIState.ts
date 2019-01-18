import { PatternMatch } from "@atomist/microgrammar/lib/PatternMatch";

export type ParserSpec = {
    kind: "microgrammar",
    microgrammarString: string,
    matchName: string,
} | { kind: "Java9" } | { kind: "Markdown" }

export type DataToParse = {
    code: string,
    parser: ParserSpec,
}


export type AST = PatternMatch[];

export type TreeParseGUIState =
    {
        deps: string[],
        selectedWords: string[],
        selectedRanges: object[],
        displayCode: boolean,
        dataToParse: DataToParse,
        ast: AST
    }
