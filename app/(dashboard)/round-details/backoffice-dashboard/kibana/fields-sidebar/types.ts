export interface FieldSidebarProps {
  availableFields: string[];
  selectedFields: string[];
  onUpdateFields: (fields: string[]) => void;
  onClearAll: () => void;
  currentData: any[];
}

export const LOG_VIEWS: Record<string, string[]> = {
  "Default": ["@timestamp", "message"],
  "API Slots": [
    "@timestamp",
    "app.requestLog.log",
    "app.responseLog.log",
    "app.serviceMethod",
    "app.url"
  ],
  "Infrastructure": ["@timestamp", "host.name", "container.id", "log.level"],
};

export const FIELD_MAPPING: Record<string, string> = {
  "app.requestLog.log": "Request",
  "app.responseLog.log": "Response",
  "app.serviceMethod": "Method",
  "app.url": "Endpoint",
  "@timestamp": "Timestamp"
};

export interface SearchHeaderProps {
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  search: string;
  setSearch: (val: string) => void;
  isCopied: boolean;
  copyAsTable: () => void;
  currentDataLength: number;
  onUpdateFields: (fields: string[]) => void;
}