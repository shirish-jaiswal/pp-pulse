"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/custom/text-editor/rich-text-editor";
import { useFindResolutionTemplates } from "@/hooks/excel-db/use-find-resolution-template";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import {
  buildBetDetailsTable,
  buildTransactionTable,
  fillAndTransformData,
} from "@/features/round-details/components/resolution-sheet/insert-values";
import { useGetVariables } from "@/hooks/excel-db/use-get-variables";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";
import { TPTTableInfo } from "@/features/round-details/types/tpt-table-info";

interface ResolutionEditorContentProps {
  gameName: string;
  category: string;
  tabsValue: string;
}

function findValueDeep(obj: any, targetKey: string): any {
  if (!obj || typeof obj !== "object") return undefined;

  if (Object.prototype.hasOwnProperty.call(obj, targetKey)) {
    return obj[targetKey];
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findValueDeep(item, targetKey);
      if (found !== undefined) return found;
    }
  } else {
    for (const value of Object.values(obj)) {
      const found = findValueDeep(value, targetKey);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

export function ResolutionEditorContent({
  gameName,
  category,
  tabsValue,
}: ResolutionEditorContentProps) {
  const { data: resolutions = [], isLoading: templatesLoading } =
    useFindResolutionTemplates({
      game: gameName,
      category: category,
    });

  const { data: variables = [], isLoading: varsLoading } = useGetVariables();
  const { roundDetails } = useRoundDetails();

  const [selectedId, setSelectedId] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");

  // =========================
  // VALUES + LINK META
  // =========================
  const { dataValues, linkMeta } = useMemo(() => {
    if (varsLoading) return { dataValues: {}, linkMeta: {} };

    const values: Record<string, any> = {};
    const links: Record<string, any> = {};

    const staticVariables: Record<string, string> = {
      currentUrl:
        typeof window !== "undefined" ? window.location.href : "",
    };

    variables.forEach((variable: any) => {
      const key = variable.key;

      links[key] = {
        isLink: variable.isLink,
        linkTemplate: variable.linkTemplate,
      };

      if (staticVariables[key]) {
        values[key] = staticVariables[key];
        return;
      }

      if (key === "bet_details") {
        values[key] = buildBetDetailsTable(
          roundDetails?.betInfo as BetTableInfo
        );
        return;
      }

      if (key === "transaction_details") {
        values[key] = buildTransactionTable(
          roundDetails?.tptInfo as TPTTableInfo
        );
        return;
      }

      const found = findValueDeep(roundDetails, key);
      values[key] = found !== undefined ? found : "";
    });

    return { dataValues: values, linkMeta: links };
  }, [variables, roundDetails, varsLoading]);

  const isReady = useMemo(() => !varsLoading, [varsLoading]);

  // =========================
  // CONTENT TRANSFORM
  // =========================
  const getPopulatedContent = useCallback(
    (rawContent: string) => {
      if (!rawContent || !isReady) return "";

      try {
        const editorStateObj = JSON.parse(rawContent);

        if (editorStateObj?.root) {
          editorStateObj.root = fillAndTransformData(
            editorStateObj.root,
            dataValues,
            linkMeta
          );
          return JSON.stringify(editorStateObj);
        }

        return JSON.stringify(
          fillAndTransformData(editorStateObj, dataValues, linkMeta)
        );
      } catch (e) {
        console.error("Transformation Error:", e);
        return rawContent;
      }
    },
    [dataValues, linkMeta, isReady]
  );

  useEffect(() => {
    if (!isReady || resolutions.length === 0) return;

    const current =
      resolutions.find((r) => r.id.toString() === selectedId) ||
      resolutions[0];

    if (current) {
      if (!selectedId) {
        setSelectedId(current.id.toString());
      }

      const populated = getPopulatedContent(current.content);
      setEditorContent(populated);
    }
  }, [resolutions, selectedId, getPopulatedContent, isReady]);

  const isDataLoading = templatesLoading || varsLoading;

  return (
    <TabsContent value={tabsValue} className="mt-0 border-none">
      <Card className="border-none shadow-none bg-transparent pt-0">
        <CardContent className="p-2">

          {/* HEADER */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[13px] font-medium text-muted-foreground tracking-tight">
              {category}
            </h3>

            <Select
              value={selectedId}
              onValueChange={setSelectedId}
              disabled={isDataLoading || resolutions.length === 0}
            >
              <SelectTrigger className="min-w-55 h-8 text-xs">
                <SelectValue placeholder="Select Template" />
              </SelectTrigger>

              <SelectContent>
                {resolutions.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* EDITOR */}
          <div className="h-[calc(100vh-12rem)] overflow-hidden rounded-md border border-border/40 bg-background/40">
            {!isReady ? (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                Loading variables...
              </div>
            ) : (
              <RichTextEditor
                key={`${category}-${selectedId}`}
                initialValue={editorContent}
                onChange={setEditorContent}
                placeholder={`Write ${category.toLowerCase()}...`}
                copyPopup={true}
              />
            )}
          </div>

        </CardContent>
      </Card>
    </TabsContent>
  );
}