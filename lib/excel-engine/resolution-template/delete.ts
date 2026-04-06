"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME, TABLE_NAME } from ".";

export async function deleteResolutionAction(id: number) : Promise<{ success: boolean }> {
  try {
    await ExcelEngine.deleteRow(DB_NAME, TABLE_NAME, id);
    return { success: true };
  } catch (error: any) {
    console.error("Delete failed:", error.message);
    throw new Error("Could not delete row. It might be missing or the file is locked.");
  }
}