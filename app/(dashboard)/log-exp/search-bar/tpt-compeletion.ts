import { TPTTableInfo } from "@/features/round-details/types/tpt-table-info";
import { CompletionContext } from "@codemirror/autocomplete";
import { EditorView } from "@codemirror/view";

export const createTptCompletionSource = (tptData: TPTTableInfo) => {
    return (context: CompletionContext) => {
        // Explicitly matches text right after an '@' sign
        const word = context.matchBefore(/@[\w\-:\*"]*/);

        if (!word || (word.from === context.pos && !context.explicit)) return null;

        return {
            from: word.from, // Starts replacement right at the '@' character
            options: tptData.map((tx) => {
                // Construct your specific dynamic query rule
                const queryText = `round_id:"${tx.round_id}" OR (game_id:"${tx.game_id}" AND user_id:"${tx.user_id}")`;

                return {
                    label: `@Tx: ${tx.transaction_id} (${tx.action_type})`,
                    detail: ` Round: ${tx.round_id}`,
                    type: "keyword",
                    boost: 100, // High priority selection when typing '@'
                    apply: (view: EditorView, completion: any, from: number, to: number) => {
                        view.dispatch({
                            changes: {
                                from: from, // Overwrites the '@' token entirely
                                to: to,
                                insert: queryText,
                            },
                            selection: { anchor: from + queryText.length },
                        });
                    },
                };
            }),
        };
    };
};