import { EditorView } from "@codemirror/view";

import { findQuoteRange } from "./quote-range";

interface ApplyCompletionProps {
    view: EditorView;

    label: string;

    from: number;

    to: number;

    pos: number;

    onTriggerApi?: () => void;
}

export const applyCompletion = ({
    view,
    label,
    from,
    to,
    pos,
    onTriggerApi,
}: ApplyCompletionProps) => {
    let targetFrom = from;

    let targetTo = to;

    /**
     * Handle quoted replacement
     */

    const hasQuotes =
        label.startsWith('"') &&
        label.endsWith('"');

    if (hasQuotes) {
        const doc =
            view.state.doc.toString();

        const range = findQuoteRange(
            doc,
            pos
        );

        if (range) {
            targetFrom = range.from;

            targetTo = range.to;
        }
    }

    /**
     * Current text
     */

    const currentText =
        view.state.doc.sliceString(
            targetFrom,
            targetTo
        );

    /**
     * Smart @ insertion
     */

    let insertText = label;

    if (
        currentText.startsWith("@") &&
        !label.startsWith("@")
    ) {
        insertText = `@${label}`;
    }

    /**
     * Apply change
     */

    view.dispatch({
        changes: {
            from: targetFrom,
            to: targetTo,
            insert: insertText,
        },

        selection: {
            anchor:
                targetFrom +
                insertText.length,
        },
    });

    queueMicrotask(() => {
        onTriggerApi?.();
    });
};