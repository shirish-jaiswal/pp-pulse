import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
} from "@codemirror/view";

import { Range } from "@codemirror/state";

const validTokenDecoration = Decoration.mark({
    class: "cm-token-valid",
});

const invalidTokenDecoration =
    Decoration.mark({
        class: "cm-token-invalid",
    });

export const tptDecoratorPlugin =
    ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;

            constructor(view: EditorView) {
                this.decorations =
                    this.getDecorations(view);
            }

            update(update: ViewUpdate) {
                if (update.docChanged) {
                    this.decorations =
                        this.getDecorations(
                            update.view
                        );
                }
            }

            getDecorations(
                view: EditorView
            ): DecorationSet {
                const decorations: Range<Decoration>[] =
                    [];

                const text =
                    view.state.doc.toString();

                const regex =
                    /@[a-zA-Z0-9_-]+(?:-[a-zA-Z0-9_-]+){0,2}/g;

                let match;

                while (
                    (match = regex.exec(text)) !==
                    null
                ) {
                    const from = match.index;

                    const to =
                        from + match[0].length;

                    const token =
                        match[0].slice(1);

                    const parts =
                        token.split("-");

                    const isValid =
                        parts.length >= 1 &&
                        parts.length <= 3;

                    decorations.push(
                        (
                            isValid
                                ? validTokenDecoration
                                : invalidTokenDecoration
                        ).range(from, to)
                    );
                }

                return Decoration.set(
                    decorations
                );
            }
        },
        {
            decorations: (v) =>
                v.decorations,
        }
    );