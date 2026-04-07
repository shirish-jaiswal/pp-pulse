"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME, TABLE_NAME } from ".";

export interface CATEGORYTYPE {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

export async function getCategories() : Promise<CATEGORYTYPE[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows)) as CATEGORYTYPE[];
  } catch (e) {
    return [];
  }
}