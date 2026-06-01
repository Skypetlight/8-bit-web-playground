import { EditorSelection, type EditorState, Prec, type Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { getIndentUnit, getIndentation } from "@codemirror/language";
import { insertNewlineAndIndent } from "@codemirror/commands";

function spaces(n: number): string {
    return n > 0 ? " ".repeat(n) : "";
}

function braceEnter(state: EditorState): { insert: string; cursorOffset: number } | null {
    const sel = state.selection.main;
    if (!sel.empty) return null;

    const pos = sel.from;
    if (pos <= 0 || pos >= state.doc.length) return null;

    const before = state.doc.sliceString(pos - 1, pos);
    const after = state.doc.sliceString(pos, pos + 1);

    if (before !== "{" || after !== "}") return null;

    const line = state.doc.lineAt(pos);
    const baseIndent = getIndentation(state, line.from) ?? 0;
    const unit = getIndentUnit(state);
    const innerIndent = baseIndent + unit;

    const insertText = `\n${spaces(innerIndent)}\n${spaces(baseIndent)}`;
    const cursorOffset = 1 + innerIndent;

    return { insert: insertText, cursorOffset };
}

export const eightBitEnterIndent: Extension = Prec.highest(
    keymap.of([
        {
            key: "Enter",
            run: (view) => {
                const special = braceEnter(view.state);
                if (!special) return insertNewlineAndIndent(view);

                const { from } = view.state.selection.main;
                view.dispatch({
                    changes: { from, to: from, insert: special.insert },
                    selection: EditorSelection.cursor(from + special.cursorOffset),
                });
                return true;
            },
        },
    ])
);