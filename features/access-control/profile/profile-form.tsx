"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { Profile } from "@/lib/excel-engine/rbac/profile/get-all";
import { useGetAllRoles } from "@/features/access-control/hooks/roles/use-roles";

type Props = {
  form: Profile;
  setForm: (v: Profile) => void;
  roleList: string[];
  setRoleList: (v: string[]) => void;
  onSave: () => void;
  isEdit: boolean;
};

export function ProfileForm({
  form,
  setForm,
  setRoleList,
  onSave,
  isEdit,
}: Props) {
  const { data: roles = [], isLoading } = useGetAllRoles();

  /**
   * We derive the current selection directly from the form string.
   * This is the "Gold Source" of truth to prevent duplicates during Edit Mode.
   */
  const currentRoles = form.role
    ? form.role.split(",").map((r) => r.trim()).filter(Boolean)
    : [];

  const toggleRole = (title: string) => {
    const trimmedTitle = title.trim();
    const exists = currentRoles.includes(trimmedTitle);

    const updatedRoles = exists
      ? currentRoles.filter((r) => r !== trimmedTitle)
      : [...currentRoles, trimmedTitle];

    const uniqueRoles = Array.from(new Set(updatedRoles));

    // Update the visual list and the actual form object simultaneously
    setRoleList(uniqueRoles);
    setForm({
      ...form,
      role: uniqueRoles.join(", "),
    });
  };

  return (
    <div className="mt-4 space-y-4">
      {/* NAME */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <Input
          placeholder="Enter name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <Input
          placeholder="Enter email"
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      {/* SETTINGS */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Settings</label>
        <Input
          placeholder="Enter settings"
          value={form.settings || ""}
          onChange={(e) => setForm({ ...form, settings: e.target.value })}
        />
      </div>

      {/* ROLES MULTI-SELECT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Roles</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start font-normal">
              {currentRoles.length > 0 ? (
                <span className="truncate">{currentRoles.join(", ")}</span>
              ) : (
                <span className="text-muted-foreground">Select roles</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[250px] p-2" align="start">
            {isLoading ? (
              <p className="text-sm p-2 text-center text-muted-foreground">Loading roles...</p>
            ) : (
              <div className="space-y-1 max-h-60 overflow-auto">
                {roles.map((role) => {
                  const isChecked = currentRoles.includes(role.title.trim());

                  return (
                    <div
                      key={role.id}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                      onClick={() => toggleRole(role.title)}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => {}} // Event handled by parent div onClick
                      />
                      <span className="text-sm select-none">
                        {role.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </PopoverContent>
        </Popover>
        <p className="text-[10px] text-muted-foreground italic">
          Stored as: {form.role || "none"}
        </p>
      </div>

      {/* SAVE BUTTON */}
      <Button className="w-full" onClick={onSave}>
        {isEdit ? "Update Profile" : "Create Profile"}
      </Button>
    </div>
  );
}