// components/kb/AddArticleDrawer.tsx
"use client";

import * as React from "react";
import { Plus, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { addKBArticle } from "@/lib/api/knowledge-base/get";

interface AddArticleDrawerProps {
  onRefresh: () => void;
}

export function AddArticleDrawer({ onRefresh }: AddArticleDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    
    const payload = {
      systitle: formData.get("systitle") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      publisher: formData.get("publisher") as string,
    };

    try {
      await addKBArticle(payload);
      setIsOpen(false); // Close drawer on success
      onRefresh();      // Trigger parent list refresh
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving to Excel. Ensure the file isn't open in another program.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> 
          New KB Article
        </Button>
      </SheetTrigger>
      
      <SheetContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-2xl">Create Article</SheetTitle>
            <SheetDescription>
              Fill in the details below to add a new record to the Excel knowledge base.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-8 space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="systitle">Article Title (systitle)</Label>
              <Input 
                id="systitle" 
                name="systitle" 
                placeholder="e.g., VPN Setup Guide" 
                required 
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  name="category" 
                  placeholder="IT / HR / Ops" 
                  required 
                  disabled={isPending}
                />
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="Draft" required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Publisher Field */}
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher Name</Label>
              <Input 
                id="publisher" 
                name="publisher" 
                placeholder="Your name or department" 
                required 
                disabled={isPending}
              />
            </div>

            <div className="rounded-md bg-muted p-4 text-xs text-muted-foreground">
              <p className="font-semibold mb-1">System Auto-Fields:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>ID: Generated automatically</li>
                <li>Created At: Current Timestamp</li>
                <li>Updated At: Current Timestamp</li>
              </ul>
            </div>
          </div>

          <SheetFooter className="mt-auto pt-6 border-t">
            <SheetClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isPending} className="min-w-[120px]">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Article"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}