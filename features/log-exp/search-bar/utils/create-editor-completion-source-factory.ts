import { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { EditorView } from "@codemirror/view";
import { executeAutocompleteSelection } from "./execute-auto-complete-selection";
import { filterCompletionOptions } from "./completion-filter";
import { formatCompletionLabel } from "./format-label";
import { AutoCompleteItem } from "../types";

interface CustomAutocompleteFactoryProps {
  fallbackAutocompleteDataset: AutoCompleteItem[];
  onSuccessfulSelectionLookupTrigger?: () => void;
}

export const createEditorCompletionSourceFactory = ({
  fallbackAutocompleteDataset,
  onSuccessfulSelectionLookupTrigger,
}: CustomAutocompleteFactoryProps) => {
  return (currentEditorContext: CompletionContext): CompletionResult | null => {
    // Matches letters, numbers, underscores, colons, quotes, asterisks, AND hyphens
    const matchedTextSegment = currentEditorContext.matchBefore(/[@\w\-:\*"]+/);

    const hasNoMatchedText = !matchedTextSegment;
    const isCursorAtStartOfWordWithoutExplicitTrigger =
      matchedTextSegment &&
      matchedTextSegment.from === currentEditorContext.pos &&
      !currentEditorContext.explicit;

    if (hasNoMatchedText || isCursorAtStartOfWordWithoutExplicitTrigger) {
      return null;
    }

    // Clean up raw syntax wrappers like @ and quotes to evaluate the core search keyword
    const sanitizedSearchTermKeyword = matchedTextSegment.text
      .replace("@", "")
      .replace(/"/g, "")
      .toLowerCase();

    const filteredSuggestionOptions = filterCompletionOptions(
      fallbackAutocompleteDataset,
      sanitizedSearchTermKeyword
    );

    const hasNoMatchingSuggestionsFound = filteredSuggestionOptions.length === 0;

    if (hasNoMatchingSuggestionsFound) {
      return null;
    }

    return {
      from: matchedTextSegment.from,
      options: filteredSuggestionOptions.map((individualItem) => {
        const isItemALookupToken = individualItem.name.startsWith("@");

        return {
          label: formatCompletionLabel(individualItem.name),
          type: isItemALookupToken ? "variable" : "keyword",
          boost: isItemALookupToken ? 50 : 1,
          apply: (
            activeEditorView: EditorView,
            activeCompletionObject: any,
            replacementStartOffset: number,
            replacementEndOffset: number
          ) => {
            executeAutocompleteSelection({
              editorViewInstance: activeEditorView,
              selectedSuggestionLabel: activeCompletionObject.label,
              originalSelectionStartOffset: replacementStartOffset,
              originalSelectionEndOffset: replacementEndOffset,
              currentCursorPositionOffset: currentEditorContext.pos,
              onSuccessfullyAppliedLookupTrigger: onSuccessfulSelectionLookupTrigger,
            });
          },
        };
      }),
    };
  };
};