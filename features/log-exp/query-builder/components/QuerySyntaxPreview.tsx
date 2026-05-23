import { Button } from "@/components/ui/button";
import React from "react";

interface QuerySyntaxPreviewProps {
    dsl: Record<string, any>;
    copied: boolean;
    onCopy: () => void;
}

export default function QuerySyntaxPreview({
    dsl,
    copied,
    onCopy
}: QuerySyntaxPreviewProps): React.JSX.Element {

    const rawJsonOutput = JSON.stringify(dsl, null, 2) || "{\n  // Configure rules above\n}";

    return (
        <div className="bg-slate-950 p-2 shadow-inner rounded h-[40vh]">
            <div className="mb-1 flex items-center justify-between font-bold uppercase tracking-wider text-slate-500 text-sm gap-10">
                <span>DSL Query</span>
                <Button
                    type="button"
                    variant={"ghost"}
                    onClick={onCopy}
                    className="font-sans text-sm font-semibold normal-case tracking-normal text-blue-400 hover:text-blue-300"
                >
                    {copied ? "✓ Copied!" : "Copy Code"}
                </Button>
            </div>
            <pre className="max-h-full overflow-auto font-mono text-green-400 text-sm scrollbar-thin">
                {rawJsonOutput}
            </pre>
        </div>
    );
}