import { createCommand, LexicalCommand } from "lexical";

export type InsertLogsPayload = {
  activeTab: string;
  logs: any[];
  columns: string[];
};

export const INSERT_LOGS_COMMAND: LexicalCommand<InsertLogsPayload> =
  createCommand("INSERT_LOGS_COMMAND");