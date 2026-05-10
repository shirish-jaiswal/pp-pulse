"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CheckSquare,
  Columns,
  Copy,
  RotateCcw,
  X,
} from "lucide-react";

import { cn } from "@/utils/cn";

type Props = {
  sidebarKeys: string[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  resetToDefault: () => void;
  logs: any[];
};

const HEADER_MAP: Record<string, string> = {
  "raw.app.serviceMethod": "method",
  "raw.app.url": "endpoint",
  "raw.app.requestLog.log": "request",
  "raw.app.responseLog.log": "response",
};

export function LogSidebar({
  sidebarKeys,
  visibleColumns,
  setVisibleColumns,
  resetToDefault,
  logs,
}: Props) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  /**
   * ----------------------------------------------------------------
   * HELPERS
   * ----------------------------------------------------------------
   */

  const normalizedSearch = search.toLowerCase();

  const isSelected = (key: string) =>
    visibleColumns.includes(key);

  const formatLabel = (key: string) =>
    HEADER_MAP[key] || key.replace("raw.app.", "");

  const getNestedValue = (
    obj: any,
    path: string
  ) => {
    return path.split(".").reduce((acc: any, key) => {
      return acc?.[key];
    }, obj);
  };

  const escapeHtml = (value: any) => {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  /**
   * ----------------------------------------------------------------
   * FILTERED KEYS
   * ----------------------------------------------------------------
   */

  const filteredKeys = useMemo(() => {
    return sidebarKeys.filter((key) =>
      key.toLowerCase().includes(normalizedSearch)
    );
  }, [sidebarKeys, normalizedSearch]);

  const selectedKeys = useMemo(() => {
    return filteredKeys.filter(isSelected);
  }, [filteredKeys, visibleColumns]);

  const unselectedKeys = useMemo(() => {
    return filteredKeys.filter(
      (key) => !visibleColumns.includes(key)
    );
  }, [filteredKeys, visibleColumns]);

  /**
   * ----------------------------------------------------------------
   * ACTIONS
   * ----------------------------------------------------------------
   */

  const updateColumns = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  const toggleKey = (key: string) => {
    if (isSelected(key)) {
      updateColumns(
        visibleColumns.filter((k) => k !== key)
      );

      return;
    }

    updateColumns([...visibleColumns, key]);
  };

  const clearAllSelected = () => {
    updateColumns(
      visibleColumns.filter(
        (key) => !selectedKeys.includes(key)
      )
    );
  };

  const selectAllAvailable = () => {
    updateColumns([
      ...new Set([
        ...visibleColumns,
        ...unselectedKeys,
      ]),
    ]);
  };

  /**
   * ----------------------------------------------------------------
   * COPY TABLE
   * ----------------------------------------------------------------
   */

  const buildHtmlTable = () => {
    return `
      <table
        style="
          border-collapse: collapse;
          width: 100%;
          font-family: Arial, sans-serif;
          font-size: 13px;
        "
      >
        <thead>
          <tr>
            ${visibleColumns
              .map(
                (column) => `
                  <th
                    style="
                      border: 2px solid #555;
                      background: #f3f4f6;
                      padding: 10px 14px;
                      text-align: left;
                      font-weight: 600;
                      white-space: nowrap;
                    "
                  >
                    ${escapeHtml(formatLabel(column))}
                  </th>
                `
              )
              .join("")}
          </tr>
        </thead>

        <tbody>
          ${logs
            .map((log) => {
              return `
                <tr>
                  ${visibleColumns
                    .map((column) => {
                      const value =
                        getNestedValue(
                          log,
                          column
                        );

                      const formattedValue =
                        value === null ||
                        value === undefined
                          ? ""
                          : typeof value === "object"
                          ? JSON.stringify(
                              value,
                              null,
                              2
                            )
                          : String(value);

                      return `
                        <td
                          style="
                            border: 1px solid #777;
                            padding: 10px 14px;
                            vertical-align: top;
                            line-height: 1.5;
                            white-space: pre-wrap;
                            max-width: 500px;
                            word-break: break-word;
                          "
                        >
                          ${escapeHtml(
                            formattedValue
                          )}
                        </td>
                      `;
                    })
                    .join("")}
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;
  };

  const copyTable = async () => {
    if (!logs?.length || !visibleColumns?.length) {
      return;
    }

    try {
      const html = buildHtmlTable();

      const clipboardData = [
        new ClipboardItem({
          "text/html": new Blob([html], {
            type: "text/html",
          }),
        }),
      ];

      await navigator.clipboard.write(
        clipboardData
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  /**
   * ----------------------------------------------------------------
   * RENDERERS
   * ----------------------------------------------------------------
   */

  const renderColumnItem = (key: string) => (
    <label
      key={key}
      className={cn(
        "flex cursor-pointer items-center gap-2 px-3 py-1.5 transition hover:bg-muted/60",
        isSelected(key) && "bg-background"
      )}
    >
      <input
        type="checkbox"
        checked={isSelected(key)}
        onChange={() => toggleKey(key)}
        className="h-3 w-3"
      />

      <span className="truncate text-xs text-foreground/80">
        {formatLabel(key)}
      </span>
    </label>
  );

  return (
    <aside className="flex w-48 flex-col border-r border-border bg-muted/40">
      {/* HEADER */}
      <div className="flex h-10 items-center gap-2 border-b border-border px-2">
        <Columns className="h-3 w-3 text-muted-foreground" />

        <div className="flex flex-1 items-center rounded border border-border bg-background px-2 py-1">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search fields..."
            className="w-full bg-transparent text-xs text-foreground outline-none"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {/* SELECTED */}
        {selectedKeys.length > 0 && (
          <Section
            title="Selected"
            actions={
              <>
                <button
                  onClick={copyTable}
                  className={cn(
                    "text-[10px] transition-colors",
                    copied
                      ? "text-green-600"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Copy table"
                >
                  {copied
                    ? <Check className="h-3 w-3" />
                    : <Copy className="h-3 w-3" />  }
                </button>

                <button
                  onClick={resetToDefault}
                  className="text-muted-foreground hover:text-foreground"
                  title="Reset"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>

                <button
                  onClick={clearAllSelected}
                  className="text-muted-foreground hover:text-foreground"
                  title="Deselect all"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            }
          >
            {selectedKeys.map(renderColumnItem)}
          </Section>
        )}

        {/* AVAILABLE */}
        {unselectedKeys.length > 0 && (
          <Section
            title="Available"
            divider={selectedKeys.length > 0}
            actions={
              <button
                onClick={selectAllAvailable}
                className="text-muted-foreground hover:text-foreground"
                title="Select all"
              >
                <CheckSquare className="h-3 w-3" />
              </button>
            }
          >
            {unselectedKeys.map(renderColumnItem)}
          </Section>
        )}

        {/* EMPTY */}
        {filteredKeys.length === 0 && (
          <div className="p-3 text-xs text-muted-foreground">
            No fields found
          </div>
        )}
      </div>
    </aside>
  );
}

/**
 * ----------------------------------------------------------------
 * SECTION COMPONENT
 * ----------------------------------------------------------------
 */

type SectionProps = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  divider?: boolean;
};

function Section({
  title,
  children,
  actions,
  divider,
}: SectionProps) {
  return (
    <div>
      {divider && (
        <div className="mt-2 border-t border-border" />
      )}

      <div className="flex items-center justify-between px-3 py-1 text-[10px] uppercase text-muted-foreground">
        <span>{title}</span>

        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>

      {children}
    </div>
  );
}