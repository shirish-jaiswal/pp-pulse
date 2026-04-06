"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME, TABLE_NAME } from ".";

export async function saveResolutionAction(data: { game: string; category: string; content: string }, id?: number | null) {
  let result;
  if (id) {
    result = await ExcelEngine.updateRow(DB_NAME, TABLE_NAME, id, data);
  } else {
    result = await ExcelEngine.insertRow(DB_NAME, TABLE_NAME, data);
  }
  
  return JSON.parse(JSON.stringify(result));
}