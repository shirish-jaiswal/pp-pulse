import { EditorView } from "@codemirror/view";
import { findQuoteRange } from "./quote-range";

interface ExecuteAutocompleteSelectionProps {
  editorViewInstance: EditorView;
  selectedSuggestionLabel: string;
  originalSelectionStartOffset: number;
  originalSelectionEndOffset: number;
  currentCursorPositionOffset: number;
  onSuccessfullyAppliedLookupTrigger?: () => void;
}

export const executeAutocompleteSelection = ({
  editorViewInstance,
  selectedSuggestionLabel,
  originalSelectionStartOffset,
  originalSelectionEndOffset,
  currentCursorPositionOffset,
  onSuccessfullyAppliedLookupTrigger,
}: ExecuteAutocompleteSelectionProps) => {
  let finalReplacementStartOffset = originalSelectionStartOffset;
  let finalReplacementEndOffset = originalSelectionEndOffset;

  /**
   * Determine if the auto-completed text needs to replace an entire quoted segment
   */
  const IsSuggestionFullyQuoted =
    selectedSuggestionLabel.startsWith('"') &&
    selectedSuggestionLabel.endsWith('"');

  if (IsSuggestionFullyQuoted) {
    const completeDocumentText = editorViewInstance.state.doc.toString();
    const activeQuoteSurroundingRange = findQuoteRange(
      completeDocumentText,
      currentCursorPositionOffset
    );

    if (activeQuoteSurroundingRange) {
      finalReplacementStartOffset = activeQuoteSurroundingRange.from;
      finalReplacementEndOffset = activeQuoteSurroundingRange.to;
    }
  }

  /**
   * Read the existing text content marked for replacement
   */
  const originalTextToBeReplaced = editorViewInstance.state.doc.sliceString(
    finalReplacementStartOffset,
    finalReplacementEndOffset
  );

  /**
   * Smart preservation of the '@' lookup token prefix
   */
  let textToInsertIntoEditor = selectedSuggestionLabel;

  const isReplacingExistingLookupToken = originalTextToBeReplaced.startsWith("@");
  const isSuggestionMissingLookupPrefix = !selectedSuggestionLabel.startsWith("@");

  if (isReplacingExistingLookupToken && isSuggestionMissingLookupPrefix) {
    textToInsertIntoEditor = `@${selectedSuggestionLabel}`;
  }

  /**
   * Apply changes to CodeMirror state and push cursor to the end of the insertion
   */
  editorViewInstance.dispatch({
    changes: {
      from: finalReplacementStartOffset,
      to: finalReplacementEndOffset,
      insert: textToInsertIntoEditor,
    },
    selection: {
      anchor: finalReplacementStartOffset + textToInsertIntoEditor.length,
    },
  });

  queueMicrotask(() => {
    onSuccessfullyAppliedLookupTrigger?.();
  });
};