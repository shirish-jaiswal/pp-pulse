import { FDToggle } from "@/components/custom/fd-toggle";
import { Input } from "@/components/ui/input";
import { DropdownSelector } from "@/features/resolution-template/components/form/selector";

export function ResolutionForm({ form }: any) {
    return (
        <div className="flex gap-4 px-1 items-end">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium">
                        Title
                    </label>
                    <FDToggle
                        checked={form.isFreshDesk}
                        onChange={form.setIsFreshDesk}
                    />
                </div>
                <Input
                    value={form.title}
                    onChange={(e) => form.setTitle(e.target.value)}
                />
            </div>

            <DropdownSelector
                label="Game"
                value={form.game}
                setValue={form.setGame}
                options={form.games}
            />

            <DropdownSelector
                label="Subcategory"
                value={form.subcategory}
                setValue={form.setSubcategory}
                options={form.subcategories}
            />
        </div>
    );
}