"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export async function findBaccaratCards(filters: {
  code: string[];
}) {
  console.log("Finding baccarat cards with filters:", filters);
  try {
    console.log("filters", filters, "Db", DB_NAME, "Table", TABLE_NAME);
    const rows = await ExcelEngine.findRows(DB_NAME, TABLE_NAME, filters);

    console.log("Found rows:", rows);
    return JSON.parse(JSON.stringify(rows));
  } catch (e) {
    return [];
  }
}