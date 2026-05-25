"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { subMinutes } from "date-fns";
import { BoolNode, ConditionNode, QueryState, SavedFilter } from "@/features/log-exp/query-builder/types";
import { GameData } from "@/features/log-exp/search-bar/utils/map-round-to-game-data";
import { useMultiFilters, useQueryBuilder } from "@/features/log-exp/query-builder/context/QueryBuilderContext";

/* -------------------------------------------------------------------------- */
/* TYPES                                   */
/* -------------------------------------------------------------------------- */

export type DateRangeValue = {
  from?: Date;
  to?: Date;
};

export type KibanaTimeRange = {
  from?: Date;
  to?: Date;
  label?: string;
};

export type SortOrder = "asc" | "desc";

interface KibanaFormContextType {
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedDataView: string;
  setSelectedDataView: (dataView: string) => void;
  timeRange: KibanaTimeRange;
  setTimeRange: (range: KibanaTimeRange) => void;
  dateRange: DateRangeValue;
  setDateRange: React.Dispatch<React.SetStateAction<DateRangeValue>>;
  compiledDslQuery: any;
  gameData: GameData | null;
  setGameData: (data: GameData | null) => void;
  selectedTemplate: any | null;
  setSelectedTemplate: (template: any | null) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const KibanaFormContext = createContext<KibanaFormContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/* RECURSIVE DSL COMPILER                          */
/* -------------------------------------------------------------------------- */

function buildDsl(state: QueryState, nodeId: string): any {
  const node = state.nodes[nodeId];
  if (!node) return null;

  if (node.type === "condition") {
    return buildCondition(node as ConditionNode);
  }

  return buildGroup(state, node as BoolNode);
}

function buildCondition(node: ConditionNode) {
  const values = node.values?.filter(Boolean) || [];
  if (!node.field || values.length === 0) return null;

  const isNegation = node.operator === "is_not_one_of";
  const matchClauses = values.map((value) => ({
    match_phrase: { [node.field]: value },
  }));

  const clause = {
    bool: {
      should: matchClauses,
      minimum_should_match: 1,
    },
  };

  if (isNegation) {
    return {
      bool: {
        must_not: [clause],
      },
    };
  }

  return clause;
}

function buildGroup(state: QueryState, node: BoolNode) {
  const filters: any[] = [];
  const shoulds: any[] = [];

  node.children.forEach((child, index) => {
    const dsl = buildDsl(state, child.id);
    if (!dsl) return;

    if (index > 0 && child.relation === "OR") {
      shoulds.push(dsl);
    } else {
      filters.push(dsl);
    }
  });

  if (filters.length === 0 && shoulds.length === 0) return null;

  if (filters.length === 1 && shoulds.length === 0 && !node.parentId) {
    return transformToFullBoilerplate(filters[0]);
  }

  if (shoulds.length > 0) {
    return {
      bool: {
        should: [
          ...filters.map((f) => transformToFullBoilerplate(f)),
          ...shoulds.map((s) => transformToFullBoilerplate(s)),
        ],
        minimum_should_match: 1,
      },
    };
  }

  const boilerplate: any = { bool: {} };

  filters.forEach((item) => {
    if (item && item.bool && item.bool.must_not) {
      if (!boilerplate.bool.must_not) boilerplate.bool.must_not = [];
      boilerplate.bool.must_not.push(...item.bool.must_not);
    } else {
      if (!boilerplate.bool.filter) boilerplate.bool.filter = [];
      boilerplate.bool.filter.push(transformToFullBoilerplate(item));
    }
  });

  return boilerplate;
}

function transformToFullBoilerplate(item: any): any {
  if (!item) return item;

  if (item.bool && ("must" in item.bool || "filter" in item.bool || "must_not" in item.bool)) {
    return item;
  }

  const boilerplate: any = { bool: {} };

  if (item.bool && item.bool.must_not) {
    boilerplate.bool.must_not = item.bool.must_not;
  } else {
    boilerplate.bool.filter = [item];
  }

  return boilerplate;
}

/* -------------------------------------------------------------------------- */
/* PROVIDER                                  */
/* -------------------------------------------------------------------------- */

// Isolated default date generation logic so it is never recreated inside the component cycle
const getInitialDateRange = (): DateRangeValue => {
  const now = new Date();
  return {
    from: subMinutes(now, 15),
    to: now,
  };
};

export const KibanaFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Using lazy state initialization ensures execution runs exactly once on mount
  const [dateRange, setDateRange] = useState<DateRangeValue>(getInitialDateRange);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDataView, setSelectedDataView] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [timeRange, setTimeRange] = useState<KibanaTimeRange>(() => {
    const initial = getInitialDateRange();
    return {
      from: initial.from,
      to: initial.to,
      label: "Last 15 minutes",
    };
  });

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  const { state: queryBuilderState } = useQueryBuilder();
  const { filters: savedPillFilters } = useMultiFilters();

  /* ---------------------------------------------------------------------- */
  /* TIME RANGE SYNCHRONIZATION                      */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    const fromDate = dateRange.from;
    const toDate = dateRange.to;
    const diffMinutes = Math.floor((toDate.getTime() - fromDate.getTime()) / 1000 / 60);

    let label = "Custom Range";
    if (diffMinutes < 60) {
      label = `Last ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    } else if (diffMinutes < 60 * 24) {
      const hours = Math.floor(diffMinutes / 60);
      label = `Last ${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (diffMinutes < 60 * 24 * 7) {
      const days = Math.floor(diffMinutes / 60 / 24);
      label = `Last ${days} day${days > 1 ? "s" : ""}`;
    } else {
      const weeks = Math.floor(diffMinutes / 60 / 24 / 7);
      label = `Last ${weeks} week${weeks > 1 ? "s" : ""}`;
    }

    // Prevents redundant re-renders or shifts if timestamps and labels remain identical
    setTimeRange((prev) => {
      if (
        prev.from?.getTime() === fromDate.getTime() &&
        prev.to?.getTime() === toDate.getTime() &&
        prev.label === label
      ) {
        return prev;
      }
      return { from: fromDate, to: toDate, label };
    });
  }, [dateRange]);

  /* ---------------------------------------------------------------------- */
  /* COMPREHENSIVE MULTI-STATE DSL ENGINE                  */
  /* ---------------------------------------------------------------------- */
  const compiledDslQuery = useMemo(() => {
    const rootQueries: any[] = [];
    const rootMustNotQueries: any[] = [];

    try {
      if (queryBuilderState?.rootId) {
        const builderDsl = buildDsl(queryBuilderState, queryBuilderState.rootId);
        if (builderDsl) {
          rootQueries.push(builderDsl);
        }
      }

      Object.values(savedPillFilters).forEach((filter: SavedFilter) => {
        if (!filter.isEnabled || !filter.state?.rootId) return;

        const pillDsl = buildDsl(filter.state, filter.state.rootId);
        if (!pillDsl) return;

        if (filter.isExcluded) {
          rootMustNotQueries.push(pillDsl);
        } else {
          rootQueries.push(pillDsl);
        }
      });

      if (rootQueries.length === 0 && rootMustNotQueries.length === 0) {
        return null;
      }

      const unifiedPayload: any = { bool: {} };
      if (rootQueries.length > 0) unifiedPayload.bool.filter = rootQueries;
      if (rootMustNotQueries.length > 0) unifiedPayload.bool.must_not = rootMustNotQueries;

      return unifiedPayload;
    } catch (error) {
      console.error("DSL Multi-State Compilation Engine Failure:", error);
      return null;
    }
  }, [queryBuilderState, savedPillFilters]);

  return (
    <KibanaFormContext.Provider
      value={{
        searchValue,
        setSearchValue,
        selectedDataView,
        setSelectedDataView,
        timeRange,
        setTimeRange,
        dateRange,
        setDateRange,
        compiledDslQuery,
        gameData,
        setGameData,
        selectedTemplate,
        setSelectedTemplate,
        sortOrder,
        setSortOrder,
      }}
    >
      {children}
    </KibanaFormContext.Provider>
  );
};

export const useKibanaFormStore = () => {
  const context = useContext(KibanaFormContext);
  if (!context) {
    throw new Error("useKibanaFormStore must be used within a KibanaFormProvider");
  }
  return context;
};