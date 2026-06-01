import { Prec, type Extension } from "@codemirror/state";
import { keymap, type EditorView } from "@codemirror/view";
import { indentRange } from "@codemirror/language";

function runReindentUntilStable(view: EditorView, maxPasses = 25): boolean {
    for (let i = 0; i < maxPasses; i++) {
        const changes = indentRange(view.state, 0, view.state.doc.length);
        if (changes.empty)
            return true;

        view.dispatch({
            changes,
            userEvent: "format",
            scrollIntoView: true,
        });
    }
    return true;
}

export const eightBitFormatKeymap: Extension = Prec.highest(
    keymap.of([
        { key: "Shift-Mod-f", run: (view) => runReindentUntilStable(view) },
        { key: "Shift-Ctrl-f", run: (view) => runReindentUntilStable(view) },
    ])
);