import { Lock, User, Bot } from "lucide-react";
import { Conversation } from "./types";
import { enhanceMessageBody } from "./enhanceMessageBody";

export default function TimelineMessage({
    conversation,
}: {
    conversation: Conversation;
}) {
    const isInternal = conversation.private;
    const isSystem = conversation.from_email === "system";

    return (
        <div
            className={`rounded-lg border overflow-hidden ${
                isInternal
                    ? "bg-amber-50 border-amber-200"
                    : isSystem
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white"
            }`}
        >
            {/* HEADER */}
            <div
                className={`flex items-center justify-between px-4 py-2 text-xs border-b ${
                    isInternal
                        ? "bg-amber-100"
                        : isSystem
                        ? "bg-gray-100"
                        : "bg-muted/40"
                }`}
            >
                <div className="flex items-center gap-2 font-semibold">
                    {isInternal ? (
                        <>
                            <Lock className="h-3 w-3" />
                            Internal Note
                        </>
                    ) : isSystem ? (
                        <>
                            <Bot className="h-3 w-3" />
                            System Log
                        </>
                    ) : (
                        <>
                            <User className="h-3 w-3" />
                            Message
                        </>
                    )}
                </div>

                <span className="text-muted-foreground">
                    {new Date(conversation.created_at).toLocaleString()}
                </span>
            </div>

            {/* BODY */}
            <div className="p-4 text-sm leading-relaxed">
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: enhanceMessageBody(conversation.body),
                    }}
                />
            </div>
        </div>
    );
}