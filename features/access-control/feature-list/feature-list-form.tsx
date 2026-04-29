"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { FeatureListTemplate } from "@/lib/excel-engine/rbac/feature-list/get-all";
import { useGetAllRoles } from "@/features/access-control/hooks/roles/use-roles";

type Props = {
  form: FeatureListTemplate;
  setForm: (v: FeatureListTemplate) => void;
  roleList: string[];
  setRoleList: (v: string[]) => void;
  onSave: () => void;
  isEdit: boolean;
};

export function FeatureListForm({
  form,
  setForm,
  setRoleList,
  onSave,
  isEdit,
}: Props) {
  const { data: roles = [], isLoading } = useGetAllRoles();

  /**
   * 1. DERIVE the current roles from the form string.
   * This is the essential fix for Edit Mode duplicates.
   */
  const currentRoles = form.roles
    ? form.roles.split(",").map((r) => r.trim()).filter(Boolean)
    : [];

  const toggleRole = (title: string) => {
    const trimmedTitle = title.trim();
    const exists = currentRoles.includes(trimmedTitle);

    const updated = exists
      ? currentRoles.filter((r) => r !== trimmedTitle)
      : [...currentRoles, trimmedTitle];

    const unique = Array.from(new Set(updated));

    // Update both states simultaneously
    setRoleList(unique);
    setForm({
      ...form,
      roles: unique.join(", "),
    });
  };

  return (
    <div className="mt-4 space-y-4">
      {/* TITLE */}
      <div className="space-y-1">
        <Label>Title</Label>
        <Input
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      {/* PATH */}
      <div className="space-y-1">
        <Label>Path</Label>
        <Input
          placeholder="e.g. /dashboard"
          value={form.path || ""}
          onChange={(e) => setForm({ ...form, path: e.target.value })}
        />
      </div>

      {/* ICON */}
      <div className="space-y-1">
        <Label>Icon</Label>
        <Input
          placeholder="e.g. HomeIcon"
          value={form.icon || ""}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
        />
      </div>

      {/* GROUP */}
      <div className="space-y-1">
        <Label>Group</Label>
        <Input
          placeholder="Group"
          value={form.group || ""}
          onChange={(e) => setForm({ ...form, group: e.target.value })}
        />
      </div>

      {/* ROLES MULTI SELECT */}
      <div className="space-y-2">
        <Label>Roles</Label>

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
                        onCheckedChange={() => {}}
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
          Stored as: {form.roles || "none"}
        </p>
      </div>

      {/* SAVE */}
      <Button className="w-full" onClick={onSave}>
        {isEdit ? "Update Feature" : "Create Feature"}
      </Button>
    </div>
  );
}