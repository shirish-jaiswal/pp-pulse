import { EditorView } from "@codemirror/view";

export const logFilterEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
    backgroundColor: "transparent",
  },

  "&.cm-focused": {
    outline: "none",
  },

  ".cm-scroller": {
    fontFamily: "var(--font-mono, GeckoMono, Fira Code, JetBrains Mono, monospace)",
    lineHeight: "1.5",
  },

  ".cm-content": {
    padding: "4px 0",
    caretColor: "var(--primary, #09090b)", // Matches shadcn/ui primary cursor
  },

  ".cm-placeholder": {
    color: "var(--muted-foreground, #71717a)", // shadcn/ui muted-foreground
  },

  // --- Autocomplete Dropdown ---
  ".cm-tooltip-autocomplete": {
    overflow: "hidden",
    border: "1px solid var(--border, #e4e4e7)", // shadcn/ui border
    borderRadius: "var(--radius, 8px)",          // shadcn/ui radius
    backgroundColor: "var(--popover, #ffffff)",  // shadcn/ui popover background
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", // md shadow
    padding: "4px",
  },

  ".cm-tooltip-autocomplete ul": {
    fontFamily: "var(--font-sans, inherit)",
  },

  ".cm-tooltip-autocomplete ul li": {
    padding: "6px 8px !important",
    borderRadius: "calc(var(--radius, 8px) - 4px)", // Inner item nesting radius
    color: "var(--popover-foreground, #09090b)",
  },

  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "var(--accent, #f4f4f5)",    // shadcn/ui select hover state
    color: "var(--accent-foreground, #09090b)",
  },

  // --- Custom Badges/Tokens (Shadcn Badge style) ---
  ".cm-token-valid": {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: "1",
    padding: "2px 8px",
    margin: "0 2px",
    fontSize: "12px",
    color: "var(--secondary-foreground, #18181b)",
    fontWeight: "500",
    backgroundColor: "var(--secondary, #f4f4f5)", // Clean secondary badge look
    border: "1px solid var(--border, #e4e4e7)",
    borderRadius: "6px", // Pill or small radius looks great here
  },

  ".cm-token-invalid": {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: "1",
    padding: "2px 8px",
    margin: "0 2px",
    fontSize: "12px",
    color: "var(--destructive-foreground, #ffffff)",
    fontWeight: "500",
    backgroundColor: "var(--destructive, #ef4444)", // Destructive variant style
    borderRadius: "6px",
  },
});