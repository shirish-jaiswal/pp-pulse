import {
    CompletionContext,
    CompletionResult,
} from "@codemirror/autocomplete";

import { EditorView } from "@codemirror/view";

import { applyCompletion } from "./apply-completion";

import { filterCompletionOptions } from "./completion-filter";

import { formatCompletionLabel } from "./format-label";

import { AutoCompleteItem } from "./types";

interface Props {
    autoCompleteData: AutoCompleteItem[];

    onTriggerApi?: () => void;
}

export const createCustomCompletionSource =
    ({
        autoCompleteData,
        onTriggerApi,
    }: Props) => {
        return (
            context: CompletionContext
        ): CompletionResult | null => {
            const word =
                context.matchBefore(
                    /[@\w\-:\*"]+/
                );

            if (
                !word ||
                (word.from ===
                    context.pos &&
                    !context.explicit)
            ) {
                return null;
            }

            const search =
                word.text
                    .replace("@", "")
                    .replace(/"/g, "")
                    .toLowerCase();

            const filteredOptions =
                filterCompletionOptions(
                    autoCompleteData,
                    search
                );

            if (
                filteredOptions.length ===
                0
            ) {
                return null;
            }

            return {
                from: word.from,

                options:
                    filteredOptions.map(
                        (item) => ({
                            label:
                                formatCompletionLabel(
                                    item.name
                                ),

                            type: item.name.startsWith(
                                "@"
                            )
                                ? "variable"
                                : "keyword",

                            boost:
                                item.name.startsWith(
                                    "@"
                                )
                                    ? 50
                                    : 1,

                            apply: (
                                view: EditorView,
                                completion: any,
                                from: number,
                                to: number
                            ) => {
                                applyCompletion({
                                    view,

                                    label:
                                        completion.label,

                                    from,

                                    to,

                                    pos: context.pos,

                                    onTriggerApi,
                                });
                            },
                        })
                    ),
            };
        };
    };