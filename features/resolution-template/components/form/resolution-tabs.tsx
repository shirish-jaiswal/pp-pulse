import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/hooks/excel-db/use-categories";

export function ResolutionTabs() {
    const { data: categories = [] } = useCategories();

    if (categories.length === 0) return null;

    return (
        <TabsList className="flex w-full border-b">
            {categories.map((cat) => (
                <TabsTrigger 
                    key={cat.id} 
                    value={cat.title}
                    className="flex-1"
                >
                    {cat.title}
                </TabsTrigger>
            ))}
        </TabsList>
    );
}