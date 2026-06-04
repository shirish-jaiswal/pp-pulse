"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { CopyWarningDialog } from "@/components/custom/text-editor/toolbar/copy-html/copy-warning-dialog";

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
      const { html: rawHtml, text } = await getHtml();

      // Parse HTML safely
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, "text/html");

      /**
       * HELPER CHECK: Confirms if an element is part of a custom game view
       */
      const isGameElement = (el: HTMLElement | null): boolean => {
        if (!el) return false;
        return (
          el.hasAttribute("data-game-block") ||
          el.getAttribute("data-game-block") === "true" ||
          !!el.closest('[data-game-block="true"]') ||
          !!el.closest('[data-game-block]')
        );
      };

      /**
       * FILTER STANDARD ELEMENTS ONLY
       */
      const allTables = Array.from(doc.querySelectorAll("table"));
      const standardTables = allTables.filter((table) => !isGameElement(table));

      const allThs = Array.from(doc.querySelectorAll("th"));
      const standardThs = allThs.filter((th) => !isGameElement(th));

      const allTds = Array.from(doc.querySelectorAll("td"));
      const standardTds = allTds.filter((td) => !isGameElement(td));

      /**
       * STYLE STANDARD PLAIN TABLES ONLY
       */
      standardTables.forEach((table) => {
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.style.fontFamily = "Arial, sans-serif";
        table.style.fontSize = "13px";
      });

      standardThs.forEach((th) => {
        th.style.border = "1px solid #000000";
        th.style.background = "#f3f4f6";
        th.style.padding = "10px 14px";
        th.style.textAlign = "left";
        th.style.fontWeight = "600";
        th.style.whiteSpace = "nowrap";
        th.style.fontFamily = "Arial, sans-serif";
        th.style.fontSize = "13px";
      });

      standardTds.forEach((td) => {
        td.style.border = "1px solid #000000";
        td.style.padding = "10px 14px";
        td.style.verticalAlign = "top";
        td.style.lineHeight = "1.5";
        td.style.whiteSpace = "pre-wrap";
        td.style.maxWidth = "500px";
        td.style.wordBreak = "break-word";
        td.style.fontFamily = "Arial, sans-serif";
        td.style.fontSize = "13px";

        const isNumeric = /^[\s]*?-?[\d,.]+(?:\s?[A-Z]{3})?[\s]*?$/.test(
          td.textContent || ""
        );

        if (isNumeric) {
          td.style.textAlign = "right";
        }
      });

      const allElements = Array.from(doc.querySelectorAll<HTMLElement>("*"));

      allElements.forEach((el) => {
        const bg = el.style.backgroundColor;
        if (bg && bg !== "transparent") {
          el.setAttribute("bgcolor", bg);

          if (!isGameElement(el)) {
            el.style.background = bg;
          }
        }
      });

      const processedHtml = doc.body.innerHTML.trim();

      const fullHtml = `
        <html>
          <head>
            <meta charset="utf-8" />
          </head>
          <body>
            ${processedHtml}
          </body>
        </html>
      `.trim();

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([fullHtml], { type: "text/html" }),
          "text/plain": new Blob([text.trim()], { type: "text/plain" }),
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

  return (
    <>
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          className="h-8 px-2 gap-1 font-mono text-xs border border-dashed border-gray-300 hover:bg-gray-50 text-gray-700"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-gray-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-gray-500" />
              <span>Copy HTML</span>
            </>
          )}
        </Button>
      </div>

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