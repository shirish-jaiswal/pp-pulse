import { X } from "lucide-react";

export function IdList({
  title,
  icon,
  items,
  onRemove,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
        <span className="opacity-80">{icon}</span>
        <span>{title}</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {items.map((id) => (
          <div
            key={id}
            className="
              group flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px]
              bg-muted/30
              transition-all duration-200 ease-out
              hover:bg-muted/70 hover:shadow-sm hover:-translate-y-px
              active:scale-[0.97]
            "
          >
            <span className="max-w-30 truncate">{id}</span>

            <button
              onClick={() => onRemove(id)}
              className="
                ml-1 flex items-center justify-center
                rounded-full p-0.5
                transition-all duration-200
                hover:bg-red-500/10 hover:scale-110
                active:scale-95
              "
              aria-label={`Remove ${id}`}
            >
              <X className="h-3.5 w-3.5 text-red-500 transition-colors hover:text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}