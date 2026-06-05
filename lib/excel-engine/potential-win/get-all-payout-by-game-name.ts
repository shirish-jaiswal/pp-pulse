"use server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME } from ".";

export async function getAllPayoutsByGameName(tableName: string) {
   try {
    const rows = await ExcelEngine.getRows(DB_NAME, tableName);

    return JSON.parse(JSON.stringify(rows));
  } catch (e) {
    console.error("FIND PROFILE ERROR:", e);
    return [];
  }
}