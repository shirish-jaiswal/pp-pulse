"use server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME } from ".";

export async function getPotentialWinningPayoutsByGameName(tableName: string, filters: {
    bet_codes?: string[];
}) {
   try {
    const rows = await ExcelEngine.findRows(DB_NAME, tableName, filters);
    console.log("ROWS FOUND:", rows);

    return JSON.parse(JSON.stringify(rows));
  } catch (e) {
    console.error("FIND PROFILE ERROR:", e);
    return [];
  }
}