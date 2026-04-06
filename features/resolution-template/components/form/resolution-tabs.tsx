import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResolutionTabs() {
    return (
        <TabsList className="w-full border-b">
            <TabsTrigger value="summary" className="w-1/2">
                Resolution Summary
            </TabsTrigger>
            <TabsTrigger value="response" className="w-1/2">
                Operator Response
            </TabsTrigger>
        </TabsList>
    );
}