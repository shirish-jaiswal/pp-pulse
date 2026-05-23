import { useCallback } from "react";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/queries/get-all";

interface UseTemplateProcessorProps {
    gameData: Record<string, any> | null;
    onChange: (value: string) => void;
    setSelectedTemplate: (template: QUERIES_TEMPLATE_TYPE | null) => void;
    setIsTemplatesOpen: (isOpen: boolean) => void;
    cmRef: React.RefObject<ReactCodeMirrorRef | null>;
}

export const useTemplateProcessor = ({
    gameData,
    onChange,
    setSelectedTemplate,
    setIsTemplatesOpen,
    cmRef,
}: UseTemplateProcessorProps) => {
    return useCallback(
        (templateObj: QUERIES_TEMPLATE_TYPE) => {
            const rawTemplate = templateObj.query || templateObj.filters || "";
            if (!rawTemplate) return;

            let processedTemplate = rawTemplate;

            if (gameData) {
                processedTemplate = rawTemplate.replace(
                    /\{(\w+)\}/g,
                    (match: string, key: string) => {
                        if (key in gameData) {
                            const replacedValue = gameData[key];
                            return replacedValue ? String(replacedValue).trim() : "";
                        }
                        return match;
                    }
                );
            }

            onChange(processedTemplate.trim());
            setSelectedTemplate(templateObj);
            setIsTemplatesOpen(false);

            requestAnimationFrame(() => {
                const view = cmRef.current?.view;
                if (!view) return;

                view.focus();
                view.dispatch({
                    selection: {
                        anchor: view.state.doc.length,
                        head: view.state.doc.length,
                    },
                });
            });
        },
        [gameData, onChange, setSelectedTemplate, setIsTemplatesOpen, cmRef]
    );
};