"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export async function deleteQueryTemplate(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    ExcelEngine.deleteRow(DB_NAME, TABLE_NAME, id);
    
    return { 
      success: true 
    };
  } catch (error: any) {
    console.error("Delete execution failed:", error.message);
    
    return {
      success: false,
      error: error.message || "Could not delete row. It might be missing or the database file is locked."
    };
  }
}