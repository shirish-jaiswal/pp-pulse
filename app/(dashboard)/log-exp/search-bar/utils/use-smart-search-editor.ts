import { useMemo } from "react";

import { useSearchAutoComplete } from "@/hooks/excel-db/use-kibana-search-autocompelete";

import { useExtensions } from "../use-extensions";

interface UseSmartSearchEditorProps {
    onSearch: () => void;

    onTriggerApi: () => void;
}

export const useSmartSearchEditor = ({
    onSearch,
    onTriggerApi,
}: UseSmartSearchEditorProps) => {
    const {
        data: autoCompleteData = [],
        isLoading:
            isAutoCompleteLoading,
    } = useSearchAutoComplete();

    const extensions =
        useExtensions({
            autoCompleteData,

            onSearch,

            onTriggerApi,
        });

    const basicSetup =
        useMemo(() => {
            return {
                lineNumbers: false,

                foldGutter: false,

                highlightActiveLine:
                    false,

                highlightActiveLineGutter:
                    false,

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