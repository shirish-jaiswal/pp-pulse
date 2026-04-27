"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export async function deleteRole(id: number) : Promise<{ success: boolean }> {
  try {
    await ExcelEngine.deleteRow(DB_NAME, TABLE_NAME, id);
    return { success: true };
  } catch (error: any) {
    throw new Error("Could not delete row. It might be missing or the file is locked.");
  }
}