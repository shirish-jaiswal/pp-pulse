"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileKeys } from "@/lib/excel-engine/excel-db-keys/rbac/profile";
import { saveProfile } from "@/lib/excel-engine/rbac/profile/save";
import { Profile } from "@/lib/excel-engine/rbac/profile/get-all";

interface SaveProfile {
  data: Partial<Profile>;
  id?: number | null;
}

export function useSaveProfile() {
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, SaveProfile>({
    mutationFn: async ({ data, id }) => {
      const payload = {
        ...data,
      } as Profile;

      return saveProfile(payload as any, id ?? null);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.list(),
      });

      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: profileKeys.detail(variables.id),
        });
      }

      toast.success(variables.id ? "Profile updated" : "Profile created");
    },

    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error(`[SaveProfile Error]: ${errorMessage}`);
      toast.error("Failed to save profile.");
    },
  });
}