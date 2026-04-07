"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME, TABLE_NAME } from ".";

export async function findResolutionTemplatesAction(filters: {
  game: string;
  category: string;
}) {
  console.log("Finding resolution templates with filters:", filters);
  try {
    const rows = await ExcelEngine.findRows(DB_NAME, TABLE_NAME, filters);
    return JSON.parse(JSON.stringify(rows));
  } catch (e) {
    return [];
  }
}