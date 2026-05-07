"use server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export async function findProfile(filters: {
  email: string;
}) {
   try {
    const rows = await ExcelEngine.findRows(DB_NAME, TABLE_NAME, filters);
    console.log("ROWS FOUND:", rows);

    return JSON.parse(JSON.stringify(rows));
  } catch (e) {
    console.error("FIND PROFILE ERROR:", e);
    return [];
  }
}