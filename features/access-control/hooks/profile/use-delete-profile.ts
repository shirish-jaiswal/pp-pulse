"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileKeys } from "@/lib/excel-engine/excel-db-keys/rbac/profile";
import { deleteProfile } from "@/lib/excel-engine/rbac/profile/delete";

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deleteProfile,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.list(),
      });

      queryClient.removeQueries({
        queryKey: profileKeys.detail(id),
      });

      toast.success("Profile deleted");
    },

    onError: (error) => {
      console.error("[DeleteProfile Error]:", error.message);
      toast.error("Failed to delete profile.");
    },
  });
}