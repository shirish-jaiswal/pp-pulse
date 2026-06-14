"use client";

import React, { useState } from "react";
import { STORED_QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/stored-queries/get-all";

// Components
import { WorkspaceHeader } from "../../../features/stored-queries/workspace-header";
import { QueriesTable } from "../../../features/stored-queries/queries-table";
import { ConfigSheet } from "../../../features/stored-queries/config-sheet";
import { UrlGeneratorSheet } from "../../../features/stored-queries/url-generator-sheet";
import { useWorkspaceState } from "@/features/stored-queries/hook/useWorkspaceState";
import { useUrlCompiler } from "@/features/stored-queries/hook/useUrlCompiler";

export default function StoredQueriesWorkspace() {
  const [isUrlSheetOpen, setIsUrlSheetOpen] = useState(false);
  
  const {
    searchInput, setSearchInput, handleExecuteSearch,
    visibleQueries, isLoading,
    isConfigSheetOpen, setIsConfigSheetOpen,
    handleOpenCreate, handleOpenEdit, handleDelete, handleSave,
    form
  } = useWorkspaceState();

  const {
    placeholders, placeholderValues, setPlaceholderValues,
    generatedUrl, selectedDateRange, setSelectedDateRange,
    extractPlaceholders, compileUrl, copyUrl
  } = useUrlCompiler();

  const handleInitiateUrlGeneration = (tpl: STORED_QUERIES_TEMPLATE_TYPE, e: React.MouseEvent) => {
    e.stopPropagation();
    extractPlaceholders(tpl);
    setIsUrlSheetOpen(true);
  };

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-background p-4">
      
      <WorkspaceHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleExecuteSearch}
        onInitiateEntry={handleOpenCreate}
      />

      <QueriesTable
        visibleQueries={visibleQueries}
        isLoading={isLoading}
        onOpenEdit={handleOpenEdit}
        onInitiateUrlGeneration={handleInitiateUrlGeneration}
        onDelete={handleDelete}
      />

      <ConfigSheet
        isOpen={isConfigSheetOpen}
        onOpenChange={setIsConfigSheetOpen}
        selectedTemplate={form.selectedTemplate}
        title={form.title} setTitle={form.setTitle}
        indexPattern={form.indexPattern} setIndexPattern={form.setIndexPattern}
        queryString={form.queryString} setQueryString={form.setQueryString}
        defaultColumns={form.defaultColumns} setDefaultColumns={form.setDefaultColumns}
        description={form.description} setDescription={form.setDescription}
        filterRules={form.filterRules} onRemoveFilterRule={form.handleRemoveFilterRule}
        inputField={form.inputField} setInputField={form.setInputField}
        inputNegate={form.inputNegate} setInputNegate={form.setInputNegate}
        inputType={form.inputType} setInputType={form.setInputType}
        inputValue={form.inputValue} setInputValue={form.setInputValue}
        onAddFilterRule={form.handleAddFilterRule}
        onSave={handleSave}
        isSaving={form.isSaving} isUpdating={form.isUpdating}
      />

      <UrlGeneratorSheet
        isOpen={isUrlSheetOpen}
        onOpenChange={setIsUrlSheetOpen}
        placeholders={placeholders}
        placeholderValues={placeholderValues}
        setPlaceholderValues={setPlaceholderValues}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        generatedUrl={generatedUrl}
        onCompileUrl={() => compileUrl(form.queryString, form.indexPattern, form.defaultColumns)}
        onCopyUrl={copyUrl}
      />

    </main>
  );
}