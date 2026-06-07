import { useState, useMemo } from "react";

const PAGE_SIZE = 15;

export function useAuditFilters(logs: any[]) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  // ✅ FILTER LOGIC
  const filtered = useMemo(() => {
    return logs.filter((log) => {
      // Search filtering
      const matchesSearch =
        `${log.actorEmail} ${log.action} ${log.entityValue}`
          .toLowerCase()
          .includes(search.toLowerCase());

      // Date filtering
      const logTime = new Date(log.timestamp).getTime();

      const fromValid = fromDate ? logTime >= fromDate.getTime() : true;
      const toValid = toDate ? logTime <= toDate.getTime() : true;

      return matchesSearch && fromValid && toValid;
    });
  }, [logs, search, fromDate, toDate]);

  // ✅ Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    return filtered.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );
  }, [filtered, page]);

  // ✅ Reset page when filters change
  // (important fix)
  useMemo(() => {
    setPage(1);
  }, [search, fromDate, toDate]);

  return {
    search,
    setSearch,

    page,
    setPage,
    totalPages,

    fromDate,
    toDate,
    setFromDate,
    setToDate,

    filtered,
    paginated,
  };
}