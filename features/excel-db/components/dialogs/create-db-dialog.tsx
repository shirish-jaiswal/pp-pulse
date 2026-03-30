import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CreateDbDialog({ open, onOpenChange, onCreate, loading }: any) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    onCreate(name).then(() => {
        setName("");
        onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Database</DialogTitle>
          <DialogDescription>Enter a name without spaces.</DialogDescription>
        </DialogHeader>
        <Input 
          placeholder="my_database" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading || !name.trim()}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}