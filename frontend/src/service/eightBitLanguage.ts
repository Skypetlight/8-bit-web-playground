import { StreamLanguage } from "@codemirror/language";

const KEYWORDS = new Set([
    "fun",
    "let",
    "while",
    "if",
    "else",
    "for",
    "return",
    "true",
    "false",
    "null",
]);

export const eightBitLanguage = StreamLanguage.define<{ inBlockComment: boolean; }>({
    startState() {
        return { inBlockComment: false };
    },

    token(stream, state) {
        // Block comments /* ... */
        if (state.inBlockComment) {
            if (stream.match(/.*?\*\//))
                state.inBlockComment = false;
            else
                stream.skipToEnd();
            return "comment";
        }
        
        if (stream.match(/\/\*/)) {
            state.inBlockComment = true;
            return "comment";
        }

        // Line comments // ...
        if (stream.match(/\/\/.*/))
            return "comment";

        // Strings "..."
        if (stream.match(/"(?:[^"\\]|\\.)*"/))
            return "string";

        // Numbers: -?\d+(\.\d+)?
        if (stream.match(/-?\d+(?:\.\d+)?/))
            return "number";

        // Operators / punctuation
        if (stream.match(/==|!=|<=|>=|\|\||&&|[+\-*/=<>!(){};,]/))
            return "operator";

        // Identifiers / keywords
        if (stream.match(/[A-Za-z][A-Za-z_0-9]*/)) {
            const word = stream.current();
            if (KEYWORDS.has(word))
                return "keyword";
            return "variableName";
        }

        stream.next();
        return null;
    }
});