import { ImagePopover } from "./image-popover";
import { LinkPopover } from "./link-popover";
import { TableTools } from "./table-tools";


export function InsertControls({ editor }: any) {
  return (
    <div className="flex items-center gap-0.5">
      <LinkPopover editor={editor} />
      <ImagePopover editor={editor} />
      <TableTools editor={editor} />
    </div>
  );
}