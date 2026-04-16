"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

import { CopyWarningDialog } from "@/components/custom/text-editor/copy-warning-dialog";

type CopyHtmlButtonProps = {
  getHtml: () => Promise<{ html: string; text: string }>;
  copyPopup?: boolean;
};

export function CopyHtmlButton({
  getHtml,
  copyPopup = false,
}: CopyHtmlButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const doCopy = useCallback(async () => {
  try {
    const { html, text } = await getHtml();

    const fullHtml = `
      <html>
        <head>
          <meta charset="utf-8" />
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([fullHtml], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ]);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Copy failed:", err);
  }
}, [getHtml]);

  const handleClick = async () => {
    if (!copyPopup) {
      await doCopy();
      return;
    }
    setOpen(true);
  };

  const buttonClass = useMemo(
    () => `
      h-8 flex items-center gap-2 px-3 rounded-md border transition-all
      ${
        copied
          ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
          : "border-transparent text-muted-foreground hover:text-primary hover:bg-accent"
      }
    `,
    [copied]
  );

  const buttonContent = copied ? (
    <>
      <Check className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">Copied!</span>
    </>
  ) : (
    <>
      <Copy className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">Copy HTML</span>
    </>
  );

  return (
    <>
      {/* Button */}
      <div className="flex items-center gap-2 ml-auto pl-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          className={buttonClass}
        >
          {buttonContent}
        </Button>
      </div>

      {/* SINGLE REUSABLE DIALOG */}
      <CopyWarningDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {
          setOpen(false);
          await doCopy();
        }}
      />
    </>
  );
}