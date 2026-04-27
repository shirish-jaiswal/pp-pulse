"use client";

import { useEffect, useState, useMemo } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Check } from "lucide-react";

import { useDataManager } from "./hooks/use-data-manager";

type Props = {
  dbName: string;
  tableName: string;
};

export function CreateFeatureSheet({ dbName, tableName }: Props) {
  const { rows: roles } = useDataManager(dbName, "roles");
  const { handleInsert: handleInsertFeature } = useDataManager(
    dbName,
    tableName
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const [form, setForm] = useState({
    sys: "",
    title: "",
    icon: "",
    path: "",
  });

  // ensure safe fallback
  const rolesList = useMemo(() => roles ?? [], [roles]);

  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const selectedRoleObjects = useMemo(() => {
    return rolesList.filter((r: any) => selectedRoles.includes(r.id));
  }, [rolesList, selectedRoles]);

  const onSubmit = async () => {
    if (!form.title.trim() || !form.sys.trim()) return;

    try {
      setLoading(true);

      await handleInsertFeature({
        title: form.title,
        icon: form.icon,
        path: form.path,
        roles: selectedRoles, // store role IDs (BEST PRACTICE)
      });

      setForm({
        sys: "",
        title: "",
        icon: "",
        path: "",
      });

      setSelectedRoles([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <SheetTrigger asChild>
        <Button size="sm">Add Feature</Button>
      </SheetTrigger>

      <SheetContent className="min-w-4xl flex flex-col gap-0 p-1">
                <SheetHeader className="p-1 border-b border-border mb-1">
                    <SheetTitle className="font-bold text-lg">Resolution</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        View resolution summaries and operator responses for this round.
                    </SheetDescription>
                </SheetHeader>


        {/* BODY */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* SYS + TITLE */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="System key (sys)"
              value={form.sys}
              onChange={(e) =>
                setForm((p) => ({ ...p, sys: e.target.value }))
              }
            />

            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>

          {/* ICON + PATH */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Icon"
              value={form.icon}
              onChange={(e) =>
                setForm((p) => ({ ...p, icon: e.target.value }))
              }
            />

            <Input
              placeholder="Path"
              value={form.path}
              onChange={(e) =>
                setForm((p) => ({ ...p, path: e.target.value }))
              }
            />
          </div>

          {/* ROLE MULTI SELECT */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Roles
            </label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedRoles.length === 0 ? (
                    "Select roles"
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedRoleObjects.map((role: any) => (
                        <Badge key={role.id} variant="secondary">
                          {role.title}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search roles..." />
                  <CommandList>
                    <CommandEmpty>No roles found.</CommandEmpty>

                    <CommandGroup>
                      {rolesList.map((role: any) => {
                        const isSelected = selectedRoles.includes(role.id);

                        return (
                          <CommandItem
                            key={role.id}
                            onSelect={() => toggleRole(role.id)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <span>{role.title}</span>

                            {isSelected && (
                              <Check className="h-4 w-4" />
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            Features will be restricted based on selected roles.
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex gap-2 bg-muted/30">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            className="flex-1"
            onClick={onSubmit}
            disabled={
              loading || !form.title.trim() || !form.sys.trim()
            }
          >
            {loading ? "Creating..." : "Create Feature"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}