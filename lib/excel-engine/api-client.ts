const BASE = "/api/excel-db";

// ============ DATABASE ============

export async function fetchDatabases() {
  const res = await fetch(BASE);
  return res.json();
}

export async function createDatabase(name: string) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function renameDatabase(oldName: string, newName: string) {
  const res = await fetch(`${BASE}/${oldName}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newName }),
  });
  return res.json();
}

export async function deleteDatabase(name: string) {
  const res = await fetch(`${BASE}/${name}`, { method: "DELETE" });
  return res.json();
}

// ============ TABLES ============

export async function fetchTables(dbName: string) {
  const res = await fetch(`${BASE}/${dbName}/tables`);
  return res.json();
}

export async function createTable(dbName: string, tableName: string, columns: string[]) {
  const res = await fetch(`${BASE}/${dbName}/tables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableName, columns }),
  });
  return res.json();
}

export async function renameTable(dbName: string, oldName: string, newName: string) {
  const res = await fetch(`${BASE}/${dbName}/tables/${oldName}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newName }),
  });
  return res.json();
}

export async function deleteTable(dbName: string, tableName: string) {
  const res = await fetch(`${BASE}/${dbName}/tables/${tableName}`, { method: "DELETE" });
  return res.json();
}

// ============ DATA ============

export async function fetchRows(dbName: string, tableName: string) {
  const res = await fetch(`${BASE}/${dbName}/tables/${tableName}/rows`);
  return res.json();
}

export async function insertRow(dbName: string, tableName: string, data: Record<string, any>) {
  const res = await fetch(`${BASE}/${dbName}/tables/${tableName}/rows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRow(dbName: string, tableName: string, id: number, data: Record<string, any>) {
  const res = await fetch(`${BASE}/${dbName}/tables/${tableName}/rows/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteRow(dbName: string, tableName: string, id: number) {
  const res = await fetch(`${BASE}/${dbName}/tables/${tableName}/rows/${id}`, { method: "DELETE" });
  return res.json();
}