import { NextRequest, NextResponse } from "next/server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";

type Ctx = { params: Promise<{ segments: string[] }> };

function ok(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ─── SIMPLE IN-MEMORY CACHE ──────────────────────────────────────────
// Keeps read operations lightning fast without hitting the file engine.
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache life

function getCache(key: string) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

function invalidateCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
// ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest, { params }: Ctx) {
  const { segments } = await params;
  const [dbName, , tableName, section] = segments ?? [];

  try {
    // GET /api/excel-db/:dbName/tables
    if (dbName && !tableName) {
      const cacheKey = `tables:${dbName}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) return ok(cachedData);

      const tables = ExcelEngine.getTables(dbName).map((name) => {
        const columns = ExcelEngine.getSchema(dbName, name);
        const rows = ExcelEngine.getRows(dbName, name);
        return {
          name,
          columnCount: columns.length,
          rowCount: rows.length,
          columns,
        };
      });

      setCache(cacheKey, tables);
      return ok(tables);
    }

    // GET /api/excel-db/:dbName/tables/:tableName/rows (with filters)
    if (tableName && section === "rows") {
      const { searchParams } = new URL(req.url);
      const searchString = searchParams.toString();
      
      // Include filters string in cache key to ensure unique query result caches
      const cacheKey = `rows:${dbName}:${tableName}:${searchString || "all"}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) return ok(cachedData);

      const filters: Record<string, string | string[]> = {};
      searchParams.forEach((value, key) => {
        if (filters[key]) {
          const existing = filters[key];
          filters[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
        } else {
          filters[key] = value;
        }
      });

      const rows =
        Object.keys(filters).length > 0
          ? ExcelEngine.findRows(dbName, tableName, filters)
          : ExcelEngine.getRows(dbName, tableName);

      const columns = ExcelEngine.getSchema(dbName, tableName);
      const result = { rows, columns };

      setCache(cacheKey, result);
      return ok(result);
    }

    return err("Not found", 404);
  } catch (e: any) {
    return err(e.message, 500);
  }
}

// ═══════════════════════════════════════════════════════════════════
// POST
// ═══════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest, { params }: Ctx) {
  const { segments } = await params;
  const [dbName, , tableName, section] = segments ?? [];

  try {
    const body = await req.json().catch(() => ({}));

    // POST /api/excel-db/:dbName/tables  → create table
    if (dbName && !tableName) {
      const { tableName: tName, columns } = body;
      if (!tName || !columns?.length) return err("tableName and columns are required");
      
      const result = ExcelEngine.createTable(dbName, tName, columns);
      
      // Invalidate table listings for this database
      invalidateCache(`tables:${dbName}`);
      return ok(result, 201);
    }

    // POST /api/excel-db/:dbName/tables/:tableName/rows  → insert row
    if (tableName && section === "rows") {
      const { id, created_at, updated_at, ...cleanData } = body;
      const row = ExcelEngine.insertRow(dbName, tableName, cleanData);
      
      // Invalidate specific data rows, plus table metadata updates (row count changes)
      invalidateCache(`rows:${dbName}:${tableName}`);
      invalidateCache(`tables:${dbName}`);
      return ok(row, 201);
    }

    return err("Not found", 404);
  } catch (e: any) {
    return err(e.message);
  }
}

// ═══════════════════════════════════════════════════════════════════
// PATCH
// ═══════════════════════════════════════════════════════════════════
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { segments } = await params;
  const [dbName, , tableName, section, rowIdStr] = segments ?? [];

  try {
    const body = await req.json().catch(() => ({}));

    // PATCH /api/excel-db/:dbName  → rename database
    if (dbName && segments.length === 1) {
      const { newName } = body;
      if (!newName) return err("newName is required");
      ExcelEngine.renameDatabase(dbName, newName);
      
      // Clear out anything associated with the old DB name
      invalidateCache(`tables:${dbName}`);
      invalidateCache(`rows:${dbName}`);
      return ok({ name: newName });
    }

    // PATCH /api/excel-db/:dbName/tables/:tableName  → rename table
    if (tableName && segments.length === 3) {
      const { newName } = body;
      if (!newName) return err("newName is required");
      ExcelEngine.renameTable(dbName, tableName, newName);
      
      // Invalidate layout and specific dataset records
      invalidateCache(`tables:${dbName}`);
      invalidateCache(`rows:${dbName}:${tableName}`);
      return ok({ tableName: newName });
    }

    // PATCH /api/excel-db/:dbName/tables/:tableName/rows/:rowId  → update row
    if (tableName && section === "rows" && rowIdStr) {
      const id = parseInt(rowIdStr, 10);
      if (isNaN(id)) return err("Invalid row ID");
      const { id: _id, created_at, updated_at, ...cleanData } = body;
      const row = ExcelEngine.updateRow(dbName, tableName, id, cleanData);
      
      // Clear cache for this table's rows
      invalidateCache(`rows:${dbName}:${tableName}`);
      return ok(row);
    }

    return err("Not found", 404);
  } catch (e: any) {
    return err(e.message);
  }
}

// ═══════════════════════════════════════════════════════════════════
// DELETE
// ═══════════════════════════════════════════════════════════════════
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { segments } = await params;
  const [dbName, , tableName, section, rowIdStr] = segments ?? [];

  try {
    // DELETE /api/excel-db/:dbName  → delete database
    if (dbName && segments.length === 1) {
      ExcelEngine.deleteDatabase(dbName);
      
      invalidateCache(`tables:${dbName}`);
      invalidateCache(`rows:${dbName}`);
      return ok({ deleted: dbName });
    }

    // DELETE /api/excel-db/:dbName/tables/:tableName  → delete table
    if (tableName && segments.length === 3) {
      ExcelEngine.deleteTable(dbName, tableName);
      
      invalidateCache(`tables:${dbName}`);
      invalidateCache(`rows:${dbName}:${tableName}`);
      return ok({ deleted: tableName });
    }

    // DELETE /api/excel-db/:dbName/tables/:tableName/rows/:rowId  → delete row
    if (tableName && section === "rows" && rowIdStr) {
      const id = parseInt(rowIdStr, 10);
      if (isNaN(id)) return err("Invalid row ID");
      ExcelEngine.deleteRow(dbName, tableName, id);
      
      invalidateCache(`rows:${dbName}:${tableName}`);
      invalidateCache(`tables:${dbName}`); // table row count metadata changed
      return ok({ deleted: id });
    }

    return err("Not found", 404);
  } catch (e: any) {
    return err(e.message);
  }
}