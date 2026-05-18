import { useMemo } from "react";

import { Extension } from "@codemirror/state";

import {
    acceptCompletion,
    autocompletion,
    closeBrackets,
    completionStatus,
} from "@codemirror/autocomplete";

import { EditorView } from "@codemirror/view";


import { tptDecoratorPlugin } from "./smartTokenDecoratorPlugin";

import { editorTheme } from "./utils/editor-theme";
import { createCustomCompletionSource } from "./create-completion-source";

interface AutoCompleteItem {
    name: string;
}

interface UseExtensionsProps {
    autoCompleteData: AutoCompleteItem[];

    onSearch: () => void;

    /**
     * Optional manual API trigger
     */

    onTriggerApi?: () => void;
}

export const useExtensions = ({
    autoCompleteData,
    onSearch,
    onTriggerApi,
}: UseExtensionsProps): Extension[] => {
    return useMemo(() => {
        /**
         * Completion source
         */

        const completionSource =
            createCustomCompletionSource({
                autoCompleteData,

                onTriggerApi,
            });

        return [
            /**
             * Auto close brackets
             */

            closeBrackets(),

            /**
             * Line wrapping
             */

            EditorView.lineWrapping,

            /**
             * Token decorators
             */

            tptDecoratorPlugin,

            /**
             * Autocomplete
             */

            autocompletion({
                override: [
                    completionSource,
                ],

                activateOnTyping: true,

                closeOnBlur: true,
            }),

            /**
             * Theme
             */

            editorTheme,

            /**
             * Disable spellcheck
             */

            EditorView.contentAttributes.of({
                spellcheck: "false",
            }),

            /**
             * Keyboard handlers
             */

            EditorView.domEventHandlers({
                keydown: (
                    event,
                    view
                ) => {
                    /**
                     * ENTER
                     */

                    if (
                        event.key ===
                        "Enter"
                    ) {
                        const status =
                            completionStatus(
                                view.state
                            );

                        /**
                         * Accept autocomplete
                         */

                        if (
                            status ===
                            "active"
                        ) {
                            acceptCompletion(
                                view
                            );

                            return true;
                        }

                        /**
                         * Trigger search
                         */

                        event.preventDefault();

                        onSearch();

                        return true;
                    }

                    return false;
                },
            }),
        ];
    }, [
        autoCompleteData,
        onSearch,
        onTriggerApi,
    ]);
};