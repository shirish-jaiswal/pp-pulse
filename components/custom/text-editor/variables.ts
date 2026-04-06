"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";

const DB_NAME = "resolution_template";
const TABLE_NAME = "variables"; 

export async function getVariablesAction() {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    
    const formatted = rawRows.map((row: any) => ({
      key: row.variable_key || row.key,
      value: row.display_name || row.label || row.value,
    }));

    return JSON.parse(JSON.stringify(formatted));
  } catch (e) {
    console.error("Fetch variables failed:", e);
    return [];
  }
}