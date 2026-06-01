import { indentService, getIndentUnit, indentUnit } from "@codemirror/language";
import type { Extension } from "@codemirror/state";

function leadingWhitespace(text: string): number {
    const m = text.match(/^\s*/);
    return m ? m[0].length : 0;
}

function isBlank(text: string): boolean {
    return /^\s*$/.test(text);
}

function endsWithOpenBrace(text: string): boolean {
    return /{\s*(?:\/\/.*)?$/.test(text);
}

function startsWithCloseBrace(text: string): boolean {
    return /^\s*}/.test(text);
}

export const eightBitIndentation: Extension = [
    indentUnit.of("    "),
    indentService.of((context, pos) => {
        const unit = getIndentUnit(context.state);

        const currentLine = context.state.doc.lineAt(pos);
        const currentText = currentLine.text;

        // Find previous non-blank line for base indentation
        let prev = currentLine.number - 1;
        let prevText = "";
        while (prev >= 1) {
            const line = context.state.doc.line(prev);
            if (!isBlank(line.text)) {
                prevText = line.text;
                break;
            }
            prev--;
        }

        let base = leadingWhitespace(prevText);

        if (endsWithOpenBrace(prevText))
            base += unit;

        if (startsWithCloseBrace(currentText))
            base = Math.max(0, base - unit);

        return base;
    }),
];