"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";

import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";
import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { InfoCardProps } from "@/features/round-details/components/round-overview/info-card";

type MultiIdsState = {
  round_ids: string[];
  game_ids: string[];
  user_id: string;
};

export type GameMetaData = {
  label: string;
  value: string;
  isTechnical: boolean;
  showPopupOf?: string;
};

export type SelectedRoundDetailsMap = Record<string, RoundDetailsResponse>;
export type AccumulatedLogsMap = Record<string, any>;
export type SelectedRowsMap = Record<string, Record<string, string[]>>;

type RoundDetailsContextType = {
  roundDetailsInput: RoundDetailsInputProps | null;
  setRoundDetailsInput: Dispatch<SetStateAction<RoundDetailsInputProps | null>>;

  multiIds: MultiIdsState;
  setMultiIds: (
    val: Partial<MultiIdsState> | ((prev: MultiIdsState) => MultiIdsState)
  ) => void;

  activeId: string;
  setActiveId: Dispatch<SetStateAction<string>>;

  isBulkMode: boolean;
  setBulkMode: Dispatch<SetStateAction<boolean>>;

  resolutionEditorOpen: boolean;
  setResolutionEditorOpen: Dispatch<SetStateAction<boolean>>;

  roundDetails: RoundDetailsResponse | null;
  setRoundDetails: (val: RoundDetailsResponse | null) => void;

  selectedRoundDetailsMap: SelectedRoundDetailsMap;
  setSelectedRoundDetailsMap: Dispatch<SetStateAction<SelectedRoundDetailsMap>>;

  accumulatedLogs: AccumulatedLogsMap;
  setAccumulatedLogs: Dispatch<SetStateAction<AccumulatedLogsMap>>;

  roundOverview: InfoCardProps[] | null;
  setRoundOverview: (val: InfoCardProps[] | null) => void;

  gameMetadata: GameMetaData[] | null;
  setGameMetadata: (val: GameMetaData[] | null) => void;

  selectedRowsMap: SelectedRowsMap;
  setSelectedRowsMap: Dispatch<SetStateAction<SelectedRowsMap>>;

  resetSelectionState: () => void;
};

const RoundDetailsContext = createContext<RoundDetailsContextType | null>(null);

export function RoundDetailsProvider({ children }: { children: React.ReactNode }) {
  const [roundDetailsInput, setRoundDetailsInput] =
    useState<RoundDetailsInputProps | null>(null);

  const [resolutionEditorOpen, setResolutionEditorOpen] = useState(false);
  const [isBulkMode, setBulkMode] = useState(false);

  const [activeId, setActiveId] = useState<string>("");

  const [roundDetails, setRoundDetailsData] =
    useState<RoundDetailsResponse | null>(null);

  const [selectedRoundDetailsMap, setSelectedRoundDetailsMap] =
    useState<SelectedRoundDetailsMap>({});

  const [accumulatedLogs, setAccumulatedLogs] = useState<AccumulatedLogsMap>({});

  const [selectedRowsMap, setSelectedRowsMap] = useState<SelectedRowsMap>({});

  const [roundOverview, setRoundOverviewData] =
    useState<InfoCardProps[] | null>(null);

  const [multiIdsState, setMultiIdsState] = useState<MultiIdsState>({
    round_ids: [],
    game_ids: [],
    user_id: "",
  });

  const [gameMetadata, setGameMetadataData] =
    useState<GameMetaData[] | null>(null);

  const setMultiIds = useCallback(
    (val: any) => {
      setMultiIdsState((prev) => {
        const next =
          typeof val === "function" ? val(prev) : { ...prev, ...val };

        return {
          round_ids: next.round_ids?.slice(0, 30) ?? [],
          game_ids: next.game_ids?.slice(0, 30) ?? [],
          user_id: next.user_id ?? "",
        };
      });
    },
    []
  );

  const resetSelectionState = useCallback(() => {
    setSelectedRoundDetailsMap({});
    setAccumulatedLogs({});
    setSelectedRowsMap({});
    setActiveId("");

    setMultiIdsState({
      round_ids: [],
      game_ids: [],
      user_id: "",
    });
  }, []);

  /**
   * IMPORTANT:
   * DO NOT alias accumulatedLogs as selectedRoundLogs.
   * If needed, compute filtered logs in consumers.
   */
  const value = useMemo(
    () => ({
      roundDetailsInput,
      setRoundDetailsInput,

      multiIds: multiIdsState,
      setMultiIds,

      activeId,
      setActiveId,

      isBulkMode,
      setBulkMode,

      resolutionEditorOpen,
      setResolutionEditorOpen,

      roundDetails,
      setRoundDetails: setRoundDetailsData,

      selectedRoundDetailsMap,
      setSelectedRoundDetailsMap,

      accumulatedLogs,
      setAccumulatedLogs,

      roundOverview,
      setRoundOverview: setRoundOverviewData,

      gameMetadata,
      setGameMetadata: setGameMetadataData,

      selectedRowsMap,
      setSelectedRowsMap,

      resetSelectionState,
    }),
    [
      roundDetailsInput,
      multiIdsState,
      activeId,
      isBulkMode,
      resolutionEditorOpen,
      roundDetails,
      selectedRoundDetailsMap,
      accumulatedLogs,
      selectedRowsMap,
      roundOverview,
      gameMetadata,
      setRoundDetailsInput,
      setMultiIds,
      setBulkMode,
      setResolutionEditorOpen,
      setRoundDetailsData,
      setRoundOverviewData,
      setGameMetadataData,
      resetSelectionState,
    ]
  );

  return (
    <RoundDetailsContext.Provider value={value}>
      {children}
    </RoundDetailsContext.Provider>
  );
}

export function useRoundDetails() {
  const ctx = useContext(RoundDetailsContext);
  if (!ctx) throw new Error("useRoundDetails must be used inside provider");
  return ctx;
}