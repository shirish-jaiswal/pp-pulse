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

type RoundDetailsContextType = {
  roundDetailsInput: RoundDetailsInputProps | null;
  setRoundDetailsInput: Dispatch<SetStateAction<RoundDetailsInputProps | null>>;

  multiIds: MultiIdsState;
  setMultiIds: (
    val:
      | Partial<MultiIdsState>
      | ((prev: MultiIdsState) => MultiIdsState)
  ) => void;

  isBulkMode: boolean;
  setBulkMode: Dispatch<SetStateAction<boolean>>;

  resolutionEditorOpen: boolean;
  setResolutionEditorOpen: Dispatch<SetStateAction<boolean>>;

  roundDetails: RoundDetailsResponse | null;
  setRoundDetails: (val: RoundDetailsResponse | null) => void;

  roundOverview: InfoCardProps[] | null;
  setRoundOverview: (val: InfoCardProps[] | null) => void;
};

const RoundDetailsContext =
  createContext<RoundDetailsContextType | null>(null);

export function RoundDetailsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [roundDetailsInput, setRoundDetailsInput] =
    useState<RoundDetailsInputProps | null>(null);

  const [resolutionEditorOpen, setResolutionEditorOpen] =
    useState<boolean>(false);

  const [isBulkMode, setBulkMode] = useState<boolean>(false);

  const [roundDetails, setRoundDetailsData] =
    useState<RoundDetailsResponse | null>(null);

  const [roundOverview, setRoundOverviewData] =
    useState<InfoCardProps[] | null>(null);

  // ✅ MAIN STATE
  const [multiIdsState, setMultiIdsState] =
    useState<MultiIdsState>({
      round_ids: [],
      game_ids: [],
      user_id: "",
    });

  // ✅ SAFE SETTER
  const setMultiIds = useCallback(
    (val: Partial<MultiIdsState> | ((prev: MultiIdsState) => MultiIdsState)) => {
      setMultiIdsState((prev) => {
        const next =
          typeof val === "function" ? val(prev) : { ...prev, ...val };

        return {
          round_ids: next.round_ids?.slice(0, 10) ?? [],
          game_ids: next.game_ids?.slice(0, 10) ?? [],
          user_id: next.user_id ?? "",
        };
      });
    },
    []
  );

  const setRoundDetails = useCallback(
    (val: RoundDetailsResponse | null) => {
      setRoundDetailsData(val);
    },
    []
  );

  const setRoundOverview = useCallback(
    (val: InfoCardProps[] | null) => {
      setRoundOverviewData(val);
    },
    []
  );

  const value = useMemo(
    () => ({
      roundDetailsInput,
      setRoundDetailsInput,

      multiIds: multiIdsState,
      setMultiIds,

      isBulkMode,
      setBulkMode,

      resolutionEditorOpen,
      setResolutionEditorOpen,

      roundDetails,
      setRoundDetails,

      roundOverview,
      setRoundOverview,
    }),
    [
      roundDetailsInput,
      multiIdsState,
      isBulkMode,
      resolutionEditorOpen,
      roundDetails,
      roundOverview,
      setRoundDetailsInput,
      setBulkMode,
      setResolutionEditorOpen,
      setRoundDetails,
      setRoundOverview,
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
  if (!ctx) {
    throw new Error(
      "useRoundDetails must be used inside RoundDetailsProvider"
    );
  }
  return ctx;
}