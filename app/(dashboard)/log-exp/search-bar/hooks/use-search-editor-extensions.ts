import { useMemo } from "react";
import { Extension } from "@codemirror/state";
import {
  acceptCompletion,
  autocompletion,
  closeBrackets,
  completionStatus,
} from "@codemirror/autocomplete";
import { EditorView } from "@codemirror/view";
import { createEditorCompletionSourceFactory } from "../utils/create-editor-completion-source-factory";
import { logFilterEditorTheme } from "../theme/editor-theme";
import { queryTokenDecorator } from "../utils/query-token-decorator";

interface AutoCompleteItem {
  name: string;
}

interface UseSearchEditorExtensionsProps {
  fallbackAutocompleteDataset: AutoCompleteItem[];
  onExecuteSearchAction: () => void;
  onSuccessfulSelectionLookupTrigger?: () => void;
}


export const useSearchEditorExtensions = ({
  fallbackAutocompleteDataset,
  onExecuteSearchAction,
  onSuccessfulSelectionLookupTrigger,
}: UseSearchEditorExtensionsProps): Extension[] => {
  return useMemo(() => {
    const customCompletionSource = createEditorCompletionSourceFactory({
      fallbackAutocompleteDataset: fallbackAutocompleteDataset,
      onSuccessfulSelectionLookupTrigger: onSuccessfulSelectionLookupTrigger,
    });

    return [
      closeBrackets(),
      EditorView.lineWrapping,
      queryTokenDecorator,
      autocompletion({
        override: [customCompletionSource],
        activateOnTyping: true,
        closeOnBlur: true,
      }),
      logFilterEditorTheme,
      EditorView.contentAttributes.of({
        spellcheck: "false",
      }),
      EditorView.domEventHandlers({
        keydown: (keyboardEvent, activeEditorView) => {
          const isEnterKeyPressed = keyboardEvent.key === "Enter";

          if (isEnterKeyPressed) {
            const currentAutocompleteStatus = completionStatus(activeEditorView.state);
            const isAutocompleteMenuDropdownActive = currentAutocompleteStatus === "active";

            if (isAutocompleteMenuDropdownActive) {
              acceptCompletion(activeEditorView);
              return true;
            }

            keyboardEvent.preventDefault();
            onExecuteSearchAction();
            return true;
          }

          return false;
        },
      }),
    ];
  }, [fallbackAutocompleteDataset, onExecuteSearchAction, onSuccessfulSelectionLookupTrigger]);
};