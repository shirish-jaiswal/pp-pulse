"use client";

import { useState, useCallback, useMemo } from "react";
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
      let { html, text } = await getHtml();

      // ==========================================
      // FORCE EXACT EXCEL/SHEETS TABLE STYLES ON COPY
      // ==========================================

      // 1. Style the base <table> element
      html = html.replace(
        /<table([^>]*)>/gi,
        `<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 13px;" $1>`
      );

      // 2. Style Header Cells <th>
      html = html.replace(
        /<th([^>]*)>/gi,
        `<th style="border: 2px solid #555; background: #f3f4f6; padding: 10px 14px; text-align: left; font-weight: 600; white-space: nowrap; font-family: Arial, sans-serif; font-size: 13px;" $1>`
      );

      // 3. Style Regular Cells <td>
      html = html.replace(
        /<td([^>]*)>/gi,
        `<td style="border: 1px solid #777; padding: 10px 14px; vertical-align: top; line-height: 1.5; white-space: pre-wrap; max-width: 500px; word-break: break-word; font-family: Arial, sans-serif; font-size: 13px;" $1>`
      );

      // 4. Style Numeric Cells <td>
      html = html.replace(
        /<td([^>]*?style="[^"]*?")>([\s]*?-?[\d,.]+(?:\s?[A-Z]{3})?[\s]*?)<\/td>/gi,
        `<td $1 text-align: right;">$2</td>`
      );

      // Minify wrapper completely to strip hidden tab/newline formatting gaps
      const fullHtml = `<html><head><meta charset="utf-8" /></head><body>${html.trim()}</body></html>`.trim();

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