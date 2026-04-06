import { useMutation } from "@tanstack/react-query";

export function useSaveResolution(onSave: (data: any) => Promise<void>) {
    return useMutation({
        mutationFn: onSave,
    });
}