import { qnaKeys } from "@/lib/excel-engine/excel-db-keys/get-qna";
import { getAllHelpNotes, HelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/get-all";
import { useQuery } from "@tanstack/react-query";

export function useGetAllHelpNotes() {
    return useQuery<HelpNotes[], Error>({
        queryKey: qnaKeys.list(),
        queryFn: () => getAllHelpNotes(),
        placeholderData: (previousData) => previousData
    });
}