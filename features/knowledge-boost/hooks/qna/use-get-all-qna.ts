import { qnaKeys } from "@/lib/excel-engine/excel-db-keys/get-qna";
import { getAllQna, QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";
import { useQuery } from "@tanstack/react-query";

export function useGetAllQna() {
    return useQuery<QNA[], Error>({
        queryKey: qnaKeys.list(),
        queryFn: () => getAllQna(),
        placeholderData: (previousData) => previousData
    });
}