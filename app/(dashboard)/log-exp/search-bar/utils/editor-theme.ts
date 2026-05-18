import { EditorView } from "@codemirror/view";

export const editorTheme =
    EditorView.theme({
        "&": {
            height: "100%",
            fontSize: "14px",
        },

        "&.cm-focused": {
            outline: "none",
        },

        ".cm-scroller": {
            fontFamily:
                "var(--font-mono, monospace)",
        },

        ".cm-content": {
            padding: "0",
            caretColor: "#2563eb",
        },

        ".cm-placeholder": {
            color: "#94a3b8",
        },

        ".cm-tooltip-autocomplete": {
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
        },

        ".cm-token-valid": {
            backgroundColor: "#eff6ff",
            color: "#1d4ed8",
            border: "1px solid #bfdbfe",
            borderRadius: "999px",
            padding: "2px 8px",
            fontWeight: "600",
        },

        ".cm-token-invalid": {
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            borderRadius: "999px",
            padding: "2px 8px",
            fontWeight: "600",
        },
    });