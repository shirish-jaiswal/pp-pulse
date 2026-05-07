import { Button } from "@/components/ui/button";

type Props = {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
  hasChanges: boolean
};

export default function ProfileHeader({
  isEditing,
  setIsEditing,
  onSave,
  onCancel,
  isPending,
  hasChanges,
}: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account information
        </p>
      </div>

      {!isEditing ? (
        <Button onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            onClick={onSave}
            disabled={!hasChanges || isPending} // ✅ FIX
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}