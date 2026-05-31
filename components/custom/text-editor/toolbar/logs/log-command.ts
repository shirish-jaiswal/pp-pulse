import { createCommand, LexicalCommand } from "lexical";

export type GroupedRoundLogs = {
  roundId: string;
  logs: any[];
};

export type InsertLogsPayload = {
  activeTab: string;
  groupedLogs: GroupedRoundLogs[];
  columns: string[];
};

export const INSERT_LOGS_COMMAND: LexicalCommand<InsertLogsPayload> =
  createCommand("INSERT_LOGS_COMMAND");