import { useState } from "react";
import { INSERT_IMAGE_COMMAND } from "@/components/custom/text-editor/toolbar/image/image-commands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Image as ImageIcon } from "lucide-react";

export function ImagePopover({ editor }: any) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>Image</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80 p-4 flex flex-col gap-3">
        <Input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <Input
          placeholder="Alt text"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
        />

        <Button
          onClick={() => {
            if (imageUrl) {
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                src: imageUrl,
                altText: imageAlt,
              });
              setImageUrl("");
              setImageAlt("");
            }
          }}
        >
          Add Image
        </Button>
      </PopoverContent>
    </Popover>
  );
}