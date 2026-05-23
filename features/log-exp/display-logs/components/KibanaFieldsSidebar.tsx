// components/KibanaFieldsSidebar.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";

import {
  Search,
  LogsIcon,
  RotateCcw,
  CheckCheck,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import { useKibanaResponseStore } from "../../context/kibana-response-context";
import { useDataViews } from "../../data-views/use-kibana-data-views";
import { useKibanaFormStore } from "../../context/kibana-form-context";

import { KibanaFieldsList } from "./KibanaFieldsList";

export function KibanaFieldsSidebar() {
  const {
    availableFields,
    selectedFields,
    toggleFieldSelection,
    setSelectedFields,
    documents = [],
  } = useKibanaResponseStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: dataViews, isLoading } = useDataViews();
  const { selectedDataView } = useKibanaFormStore();

  /**
   * Resolve active profile
   */
  const activeProfile = dataViews?.find(
    (view) =>
      view.uuid === selectedDataView ||
      String(view.id) === selectedDataView
  );

  /**
   * Extract layout configurations safely
   */
  const profileDefaults = Array.isArray(activeProfile?.default_fields)
    ? activeProfile.default_fields.filter((field) => field !== "")
    : [];

  const profilePopular = Array.isArray(activeProfile?.pop_fields)
    ? activeProfile.pop_fields.filter((field) => field !== "")
    : [];

  /**
   * Hydrate defaults on data view change
   */
  useEffect(() => {
    setSelectedFields(profileDefaults);
  }, [selectedDataView]);

  /**
   * Exclusions & Filter Rules:
   * 1. Popular cannot contain fields that are currently selected.
   * 2. Available cannot contain fields that are either selected OR popular.
   */
  const basePopularFields = profilePopular.filter(
    (field) => !selectedFields.includes(field)
  );

  const trueAvailableFields = availableFields.filter(
    (field) =>
      field !== "_source" &&
      !selectedFields.includes(field) &&
      !basePopularFields.includes(field)
  );

  /**
   * Search filtering applied down to all arrays
   */
  const filteredSelected = selectedFields.filter((field) =>
    field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPopular = basePopularFields.filter((field) =>
    field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailable = trueAvailableFields.filter((field) =>
    field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Sidebar interactions
   */
  const handleResetDefaults = () => {
    setSelectedFields(profileDefaults);
  };

  const handleSelectAllAvailable = () => {
    setSelectedFields([
      ...new Set([...selectedFields, ...trueAvailableFields]),
    ]);
  };

  /**
   * Selects only the currently visible popular fields
   */
  const handleSelectAllPopular = () => {
    setSelectedFields([
      ...new Set([...selectedFields, ...filteredPopular]),
    ]);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div
      className={`relative flex h-full shrink-0 flex-col border-r border-slate-200 bg-slate-50 font-sans antialiased transition-all duration-200 ${
        collapsed ? "w-12" : "w-64"
      }`}
    >
      {/* COLLAPSED STATE */}
      {collapsed ? (
        <div className="flex h-full items-start justify-center pt-2">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Header & Search Block */}
          <div className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-1 text-slate-700">
              <div className="flex items-center gap-2 overflow-hidden">
                <LogsIcon className="h-4 w-4 shrink-0 text-sky-600" />
                <h2 className="truncate text-xs font-bold uppercase tracking-wider">
                  Log Fields
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>

            <div className="relative px-1 pb-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-8 text-sm placeholder-slate-400 transition-all focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                  title="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Core Content Lists */}
          <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-2">
            {isLoading && (
              <div className="animate-pulse py-4 text-center text-xs text-slate-400">
                Loading data view profiles...
              </div>
            )}

            {/* 1st: Selected Panel */}
            <KibanaFieldsList
              title="Selected Fields"
              type="selected"
              fields={filteredSelected}
              count={selectedFields.length}
              emptyText="No fields selected"
              profileDefaults={profileDefaults}
              onToggle={toggleFieldSelection}
              actionIcon={RotateCcw}
              actionTitle="Reset to defaults"
              actionVariant="primary"
              onAction={handleResetDefaults}
              documents={documents}
            />

            {/* 2nd: Popular Panel */}
            {profilePopular.length > 0 && (
              <KibanaFieldsList
                title="Popular Fields"
                type="popular"
                fields={filteredPopular}
                count={basePopularFields.length}
                emptyText="No matching popular fields"
                profileDefaults={profileDefaults}
                onToggle={toggleFieldSelection}
                actionIcon={CheckCheck}
                actionTitle="Select all popular fields"
                onAction={handleSelectAllPopular}
                documents={documents}
              />
            )}

            {/* 3rd: Available Panel */}
            <KibanaFieldsList
              title="Available Fields"
              type="available"
              fields={filteredAvailable}
              count={trueAvailableFields.length}
              emptyText="No matching fields"
              profileDefaults={profileDefaults}
              onToggle={toggleFieldSelection}
              actionIcon={CheckCheck}
              actionTitle="Select all remaining fields"
              onAction={handleSelectAllAvailable}
              documents={documents}
            />
          </div>
        </>
      )}
    </div>
  );
}