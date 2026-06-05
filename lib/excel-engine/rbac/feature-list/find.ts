"use server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export async function findFeatureList(filters: {
  email: string;
}) {
  debugger;
   try {
    const rows = await ExcelEngine.findRows(DB_NAME, TABLE_NAME, filters);
    return JSON.parse(JSON.stringify(rows));
  } catch (e) {
    console.error("FIND PROFILE ERROR:", e);
    return [];
  }
}