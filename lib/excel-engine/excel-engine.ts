import fs from "fs";
import path from "path";
import { read, write, utils, WorkBook } from "xlsx";

const DB_DIR = path.join(process.cwd(), "db_storage");

function saveWorkbook(wb: WorkBook, filePath: string) {
  try {
    const buffer = write(wb, { type: "buffer", bookType: "xlsx" });
    fs.writeFileSync(filePath, buffer);
  } catch (err: any) {
    console.error("Write failed:", err.message);
    throw new Error("Failed to save file. File may be open in Excel or locked.");
  }
}

function validateDbName(name: string) {
  if (!name || name.includes(" ")) {
    throw new Error("DB name must not contain spaces");
  }
}

function getDBPath(dbName: string) {
  return path.join(DB_DIR, `${dbName}.xlsx`);
}

function loadWB(dbName: string): WorkBook {
  const filePath = getDBPath(dbName);
  if (!fs.existsSync(filePath)) throw new Error(`DB "${dbName}" not found`);
  return read(fs.readFileSync(filePath));
}

export const ExcelEngine = {
  createDatabase(dbName: string) {
    validateDbName(dbName);
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

    const filePath = getDBPath(dbName);
    if (fs.existsSync(filePath)) throw new Error("DB already exists");

    const wb = utils.book_new();
    utils.book_append_sheet(
      wb,
      utils.json_to_sheet([{ created_at: new Date().toISOString() }]),
      "__meta__"
    );
    utils.book_append_sheet(wb, utils.json_to_sheet([]), "__schema__");
    saveWorkbook(wb, filePath);
    return { name: dbName };
  },

  getDatabases(): string[] {
    if (!fs.existsSync(DB_DIR)) return [];
    return fs
      .readdirSync(DB_DIR)
      .filter((f) => f.endsWith(".xlsx"))
      .map((f) => f.replace(".xlsx", ""));
  },

  getDatabaseMeta(dbName: string) {
    const wb = loadWB(dbName);
    const metaSheet = wb.Sheets["__meta__"];
    const meta = metaSheet ? utils.sheet_to_json(metaSheet)[0] : {};
    const tables = wb.SheetNames.filter(
      (n) => !["__meta__", "__schema__"].includes(n)
    );
    return { name: dbName, tables, meta };
  },

  deleteDatabase(dbName: string) {
    const filePath = getDBPath(dbName);
    if (!fs.existsSync(filePath)) throw new Error(`DB "${dbName}" not found`);
    fs.unlinkSync(filePath);
  },

  renameDatabase(oldName: string, newName: string) {
    validateDbName(newName);
    const oldPath = getDBPath(oldName);
    const newPath = getDBPath(newName);
    if (!fs.existsSync(oldPath)) throw new Error("DB not found");
    if (fs.existsSync(newPath)) throw new Error("DB with new name already exists");
    fs.renameSync(oldPath, newPath);
  },

  // ============ TABLE CRUD ============
  createTable(dbName: string, tableName: string, columns: string[]) {
    const wb = loadWB(dbName);
    if (wb.SheetNames.includes(tableName)) throw new Error("Table already exists");

    const finalCols = ["id", ...columns, "created_at", "updated_at"];
    const sheet = utils.json_to_sheet([]);
    utils.sheet_add_aoa(sheet, [finalCols]);
    utils.book_append_sheet(wb, sheet, tableName);

    const schema: any[] = utils.sheet_to_json(wb.Sheets["__schema__"] || utils.json_to_sheet([]));
    schema.push({ table_name: tableName, columns: finalCols.join(",") });
    wb.Sheets["__schema__"] = utils.json_to_sheet(schema);

    saveWorkbook(wb, getDBPath(dbName));
    return { tableName, columns: finalCols };
  },

  getTables(dbName: string): string[] {
    const wb = loadWB(dbName);
    return wb.SheetNames.filter((n) => !["__meta__", "__schema__"].includes(n));
  },

  deleteTable(dbName: string, tableName: string) {
    const wb = loadWB(dbName);
    if (!wb.Sheets[tableName]) throw new Error("Table not found");

    delete wb.Sheets[tableName];
    wb.SheetNames = wb.SheetNames.filter((n) => n !== tableName);

    const schema: any[] = utils.sheet_to_json(wb.Sheets["__schema__"] || utils.json_to_sheet([]));
    wb.Sheets["__schema__"] = utils.json_to_sheet(
      schema.filter((s: any) => s.table_name !== tableName)
    );

    saveWorkbook(wb, getDBPath(dbName));
  },

  getSchema(dbName: string, tableName: string): string[] {
    const wb = loadWB(dbName);
    const schemaSheet = wb.Sheets["__schema__"];
    if (!schemaSheet) return [];
    const schemaData: any[] = utils.sheet_to_json(schemaSheet);
    const table = schemaData.find((s: any) => s.table_name === tableName);
    return table ? table.columns.split(",") : [];
  },

  renameTable(dbName: string, oldName: string, newName: string) {
    const wb = loadWB(dbName);
    if (!wb.Sheets[oldName]) throw new Error("Table not found");
    if (wb.Sheets[newName]) throw new Error("New table name already exists");

    wb.Sheets[newName] = wb.Sheets[oldName];
    delete wb.Sheets[oldName];
    wb.SheetNames = wb.SheetNames.map((n) => (n === oldName ? newName : n));

    const schemaSheet = wb.Sheets["__schema__"];
    if (schemaSheet) {
      const schemaData: any[] = utils.sheet_to_json(schemaSheet);
      wb.Sheets["__schema__"] = utils.json_to_sheet(
        schemaData.map((s) =>
          s.table_name === oldName ? { ...s, table_name: newName } : s
        )
      );
    }

    saveWorkbook(wb, getDBPath(dbName));
  },

  insertRow(dbName: string, tableName: string, data: Record<string, any>) {
    const wb = loadWB(dbName);
    const sheet = wb.Sheets[tableName];
    if (!sheet) throw new Error("Table not found");

    const rows: any[] = utils.sheet_to_json(sheet);
    const id = rows.length ? Math.max(...rows.map((r) => r.id || 0)) + 1 : 1;
    const now = new Date().toISOString();
    const newRow = { id, ...data, created_at: now, updated_at: now };
    rows.push(newRow);

    // Preserve column order from schema
    const schema = ExcelEngine.getSchema(dbName, tableName);
    wb.Sheets[tableName] = utils.json_to_sheet(rows, {
      header: schema.length ? schema : undefined,
    });

    saveWorkbook(wb, getDBPath(dbName));
    return newRow;
  },

  getRows(dbName: string, tableName: string): any[] {
    const wb = loadWB(dbName);
    const sheet = wb.Sheets[tableName];
    if (!sheet) throw new Error("Table not found");
    return utils.sheet_to_json(sheet);
  },

  updateRow(
    dbName: string,
    tableName: string,
    id: number,
    data: Record<string, any>
  ) {
    const wb = loadWB(dbName);
    const sheet = wb.Sheets[tableName];
    if (!sheet) throw new Error("Table not found");

    const rows: any[] = utils.sheet_to_json(sheet);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Row not found");

    rows[idx] = { ...rows[idx], ...data, updated_at: new Date().toISOString() };

    const schema = ExcelEngine.getSchema(dbName, tableName);
    wb.Sheets[tableName] = utils.json_to_sheet(rows, {
      header: schema.length ? schema : undefined,
    });

    saveWorkbook(wb, getDBPath(dbName));
    return rows[idx];
  },

  deleteRow(dbName: string, tableName: string, id: number) {
    const wb = loadWB(dbName);
    const sheet = wb.Sheets[tableName];
    if (!sheet) throw new Error("Table not found");

    const rows: any[] = utils.sheet_to_json(sheet);
    const filtered = rows.filter((r) => r.id !== id);
    if (filtered.length === rows.length) throw new Error("Row not found");

    const schema = ExcelEngine.getSchema(dbName, tableName);
    wb.Sheets[tableName] = utils.json_to_sheet(filtered, {
      header: schema.length ? schema : undefined,
    });

    saveWorkbook(wb, getDBPath(dbName));
  },

  findRows(
    dbName: string,
    tableName: string,
    filters: Record<string, string | string[]>
  ) {
    const wb = loadWB(dbName);
    const sheet = wb.Sheets[tableName];
    if (!sheet) throw new Error("Table not found");

    const rows = utils.sheet_to_json<Record<string, string>>(sheet);

    return rows.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        const rowValue = row[key];

        if (Array.isArray(value)) {
          return value.includes(rowValue);
        }

        return rowValue === value;
      })
    );
  }
};