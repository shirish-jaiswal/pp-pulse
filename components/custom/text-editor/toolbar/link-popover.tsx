import { useState } from "react";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "lucide-react";

export function LinkPopover({ editor }: any) {
  const [linkUrl, setLinkUrl] = useState("");

  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>Insert Link</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80 p-3">
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() =>
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
            }
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}