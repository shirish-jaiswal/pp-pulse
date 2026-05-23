import { useMemo } from "react";
import { useSearchAutoComplete } from "@/hooks/excel-db/use-kibana-search-autocompelete";
import { useSearchEditorExtensions } from "./use-search-editor-extensions";

interface UseSearchEditorConfigProps {
  onSearch: () => void;
  onTriggerApi: () => void;
}

export const useSearchEditorConfig = ({
  onSearch,
  onTriggerApi,
}: UseSearchEditorConfigProps) => {
  const {
    data: autoCompleteData = [],
    isLoading: isAutoCompleteLoading,
  } = useSearchAutoComplete();

  const extensions = useSearchEditorExtensions({
    fallbackAutocompleteDataset: autoCompleteData,
    onExecuteSearchAction: onSearch,
    onSuccessfulSelectionLookupTrigger: onTriggerApi,
  });

  const basicSetup = useMemo(() => {
    return {
      lineNumbers: false,
      foldGutter: false,
      highlightActiveLine: false,
      highlightActiveLineGutter: false,
      bracketMatching: true,
      autocompletion: true,
    };
  }, []);

  return {
    extensions,
    basicSetup,
    isAutoCompleteLoading,
  };
};