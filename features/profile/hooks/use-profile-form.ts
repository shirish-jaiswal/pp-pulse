import { useEffect, useMemo, useState } from "react";
import { parseSettings } from "@/features/profile/utils/parse-settings";
import { useSaveProfile } from "@/features/access-control/hooks/profile/use-save-profile";
import { encryptData } from "@/utils/crypto";

export function useProfileForm(profile: any) {
  const { mutate: saveProfile, isPending } = useSaveProfile();

  const [name, setName] = useState("");
  const [localSettings, setLocalSettings] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [freshdesk, setFreshdesk] = useState<string>("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name || "");
    setFreshdesk(profile.freshdesk || "");
    setLocalSettings(parseSettings(profile.settings));
  }, [profile]);

  const hasChanges = useMemo(() => {
    if (!profile) return false;

    const originalSettings = parseSettings(profile.settings);

    return (
      name !== (profile.name || "") ||
      freshdesk !== (profile.freshdesk || "") ||
      JSON.stringify(localSettings) !== JSON.stringify(originalSettings)
    );
  }, [name, freshdesk, localSettings, profile]);

  const persistProfile = () => {
    if (!profile || !hasChanges) return;

    const payload: any = {
      id: profile.id,
      data: {},
    };

    if (name !== profile.name) {
      payload.data.name = name;
    }

    if (freshdesk !== profile.freshdesk) {
      payload.data.freshdesk = freshdesk
        ? encryptData(freshdesk)
        : freshdesk;
    }

    const originalSettings = parseSettings(profile.settings);

    if (
      JSON.stringify(localSettings) !== JSON.stringify(originalSettings)
    ) {
      payload.data.settings = JSON.stringify(localSettings);
    }

    // ❗ If nothing actually changed after diff check
    if (Object.keys(payload.data).length === 0) return;

    saveProfile(payload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleSave = () => {
    persistProfile();
  };

  const handleCancel = () => {
    if (!profile) return;

    setName(profile.name || "");
    setFreshdesk(profile.freshdesk || "");
    setLocalSettings(parseSettings(profile.settings));
    setIsEditing(false);
  };

  const updateSettings = (updated: any) => {
    setLocalSettings(updated);
  };

  return {
    name,
    setName,
    freshdesk,
    setFreshdesk,
    localSettings,
    setLocalSettings,
    isEditing,
    setIsEditing,
    handleSave,
    handleCancel,
    updateSettings,
    isPending,
    hasChanges,
  };
}