import { NextRequest, NextResponse } from "next/server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";

type Ctx = { params: Promise<{ segments: string[] }> };

function ok(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ─── Route shape ────────────────────────────────────────────────────
//
//  DATABASE
//  GET    /api/excel-db                        → list all databases
//  POST   /api/excel-db                        → create database        body: { name }
//  PATCH  /api/excel-db/:dbName                → rename database        body: { newName }
//  DELETE /api/excel-db/:dbName                → delete database
//
//  TABLE
//  GET    /api/excel-db/:dbName/tables                   → list tables
//  POST   /api/excel-db/:dbName/tables                   → create table   body: { tableName, columns }
//  PATCH  /api/excel-db/:dbName/tables/:tableName        → rename table   body: { newName }
//  DELETE /api/excel-db/:dbName/tables/:tableName        → delete table
//
//  DATA
//  GET    /api/excel-db/:dbName/tables/:tableName/rows          → get rows
//  POST   /api/excel-db/:dbName/tables/:tableName/rows          → insert row   body: { ...fields }
//  PATCH  /api/excel-db/:dbName/tables/:tableName/rows/:rowId   → update row   body: { ...fields }
//  DELETE /api/excel-db/:dbName/tables/:tableName/rows/:rowId   → delete row
//
// ────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════
// GET
// ═══════════════════════════════════════════════════════════════════
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { segments } = await params;
  const [dbName, , tableName, section] = segments ?? [];

  try {
    // GET /api/excel-db/:dbName/tables  → list tables
    if (dbName && !tableName) {
      const tables = ExcelEngine.getTables(dbName).map((name) => {
        const columns = ExcelEngine.getSchema(dbName, name);
        const rows = ExcelEngine.getRows(dbName, name);
        return { name, columnCount: columns.length, rowCount: rows.length, columns };
      });
      return ok(tables);
    }

    // GET /api/excel-db/:dbName/tables/:tableName/rows  → get rows
    if (tableName && section === "rows") {
      const rows = ExcelEngine.getRows(dbName, tableName);
      const columns = ExcelEngine.getSchema(dbName, tableName);
      return ok({ rows, columns });
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
      return ok(result, 201);
    }

    // POST /api/excel-db/:dbName/tables/:tableName/rows  → insert row
    if (tableName && section === "rows") {
      const { id, created_at, updated_at, ...cleanData } = body;
      const row = ExcelEngine.insertRow(dbName, tableName, cleanData);
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
      return ok({ name: newName });
    }

    // PATCH /api/excel-db/:dbName/tables/:tableName  → rename table
    if (tableName && segments.length === 3) {
      const { newName } = body;
      if (!newName) return err("newName is required");
      ExcelEngine.renameTable(dbName, tableName, newName);
      return ok({ tableName: newName });
    }

    // PATCH /api/excel-db/:dbName/tables/:tableName/rows/:rowId  → update row
    if (tableName && section === "rows" && rowIdStr) {
      const id = parseInt(rowIdStr, 10);
      if (isNaN(id)) return err("Invalid row ID");
      const { id: _id, created_at, updated_at, ...cleanData } = body;
      const row = ExcelEngine.updateRow(dbName, tableName, id, cleanData);
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
      return ok({ deleted: dbName });
    }

    // DELETE /api/excel-db/:dbName/tables/:tableName  → delete table
    if (tableName && segments.length === 3) {
      ExcelEngine.deleteTable(dbName, tableName);
      return ok({ deleted: tableName });
    }

    // DELETE /api/excel-db/:dbName/tables/:tableName/rows/:rowId  → delete row
    if (tableName && section === "rows" && rowIdStr) {
      const id = parseInt(rowIdStr, 10);
      if (isNaN(id)) return err("Invalid row ID");
      ExcelEngine.deleteRow(dbName, tableName, id);
      return ok({ deleted: id });
    }

    return err("Not found", 404);
  } catch (e: any) {
    return err(e.message);
  }
}

