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
import { BoolNode, ConditionNode, QueryState } from "../query-builder/types";
import { GameData } from "../search-bar/utils/map-round-to-game-data";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
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
  queryState: QueryState;
  setQueryState: React.Dispatch<React.SetStateAction<QueryState>>;
  selectedDataView: string;
  setSelectedDataView: (dataView: string) => void;
  /** Absolute Date range tracking configuration values */
  timeRange: KibanaTimeRange;
  setTimeRange: (range: KibanaTimeRange) => void;
  /** Primary interactive UI Date state boundaries */
  dateRange: DateRangeValue;
  setDateRange: React.Dispatch<React.SetStateAction<DateRangeValue>>;
  compiledDslQuery: any;
  gameData: GameData | null;
  setGameData: (data: GameData | null) => void;
  selectedTemplate: any | null;
  setSelectedTemplate: (template: any | null) => void;
  /** Timestamp Sort Control toggles */
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

const KibanaFormContext = createContext<KibanaFormContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                             INITIAL QUERY STATE                            */
/* -------------------------------------------------------------------------- */

const initialQueryState: QueryState = {
  rootId: "root",
  nodes: {
    root: {
      id: "root",
      type: "bool",
      children: [],
      parentId: undefined,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                                DSL COMPILER                                */
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

  if (!node.field || values.length === 0) {
    return null;
  }

  const isNegation = node.operator === "is_not_one_of";
  const matchClauses = values.map((value) => ({
    match_phrase: {
      [node.field]: value,
    },
  }));

  if (isNegation) {
    return {
      bool: {
        must_not: [
          {
            bool: {
              should: matchClauses,
              minimum_should_match: 1,
            },
          },
        ],
      },
    };
  }

  return {
    bool: {
      should: matchClauses,
      minimum_should_match: 1,
    },
  };
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

  if (filters.length === 0 && shoulds.length === 0) {
    return null;
  }

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

  const boilerplate: any = {
    bool: {
      must: [],
      filter: [],
      should: [],
      must_not: [],
    },
  };

  filters.forEach((item) => {
    if (item && item.bool && item.bool.must_not) {
      boilerplate.bool.must_not.push(...item.bool.must_not);
    } else {
      boilerplate.bool.filter.push(transformToFullBoilerplate(item));
    }
  });

  return boilerplate;
}

function transformToFullBoilerplate(item: any): any {
  if (!item) return item;

  if (item.bool && "must" in item.bool && "filter" in item.bool) {
    return item;
  }

  const boilerplate: any = {
    bool: {
      must: [],
      filter: [],
      should: [],
      must_not: [],
    },
  };

  if (item.bool && item.bool.must_not) {
    boilerplate.bool.must_not = item.bool.must_not;
  } else {
    boilerplate.bool.filter.push(item);
  }

  return boilerplate;
}

/* -------------------------------------------------------------------------- */
/*                                  PROVIDER                                  */
/* -------------------------------------------------------------------------- */

export const KibanaFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const now = new Date();

  const defaultDateRange: DateRangeValue = {
    from: subMinutes(now, 15),
    to: now,
  };

  const [searchValue, setSearchValue] = useState("");
  const [queryState, setQueryState] = useState<QueryState>(initialQueryState);
  const [selectedDataView, setSelectedDataView] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultDateRange);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [timeRange, setTimeRange] = useState<KibanaTimeRange>({
    from: defaultDateRange.from,
    to: defaultDateRange.to,
    label: "Last 15 minutes",
  });

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  /* ---------------------------------------------------------------------- */
  /*                      DATE RANGE SYNCHRONIZATION                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    const fromDate = dateRange.from;
    const toDate = dateRange.to;

    const diffMilliseconds = toDate.getTime() - fromDate.getTime();
    const diffMinutes = Math.floor(diffMilliseconds / 1000 / 60);

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

    setTimeRange({
      from: fromDate,
      to: toDate,
      label,
    });
  }, [dateRange]);

  /* ---------------------------------------------------------------------- */
  /*                            DSL COMPILATION                             */
  /* ---------------------------------------------------------------------- */

  const compiledDslQuery = useMemo(() => {
    if (!queryState.rootId) return null;

    try {
      return buildDsl(queryState, queryState.rootId);
    } catch (error) {
      console.error("DSL Compilation Engine Failure:", error);
      return null;
    }
  }, [queryState]);

  return (
    <KibanaFormContext.Provider
      value={{
        searchValue,
        setSearchValue,
        queryState,
        setQueryState,
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