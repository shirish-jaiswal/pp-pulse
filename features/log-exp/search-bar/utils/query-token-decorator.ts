import { RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";

/**
 * Valid formats:
 * @foo, @-foo, @-123-abc, @-14143363312-ppc1735289350598
 * FIXED: Validates chunks properly even when they contain or start with negative values.
 */
const VALID_TOKEN_REGEX = /^@(-?[a-zA-Z0-9_]+)(?:-(-?[a-zA-Z0-9_]+)){0,2}$/;

/**
 * Match all potential tokens first, including negative symbols and alphanumeric blocks
 */
const TOKEN_REGEX = /@[^\s@]+/g;

const validTokenDecoration = Decoration.mark({
  class: "cm-token-valid",
});

const invalidTokenDecoration = Decoration.mark({
  class: "cm-token-invalid",
});

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();

  /**
   * Only scan visible ranges
   * Better performance for large docs
   */
  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);

    TOKEN_REGEX.lastIndex = 0;

    let match: RegExpExecArray | null;

    while ((match = TOKEN_REGEX.exec(text))) {
      const start = from + match.index;
      const end = start + match[0].length;

      const token = match[0];

      const decoration = VALID_TOKEN_REGEX.test(token)
        ? validTokenDecoration
        : invalidTokenDecoration;

      builder.add(start, end, decoration);
    }
  }

  return builder.finish();
}

export const queryTokenDecorator = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);