"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export interface QUERIES_TEMPLATE_TYPE {
    id: number;
    game: string;
    filters: string;
    query: string;
    created_at: string;
    updated_at: string;
}

export async function getAllQueriesTemplate() : Promise<QUERIES_TEMPLATE_TYPE[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows)) as QUERIES_TEMPLATE_TYPE[];
  } catch (e) {
    return [];
  }
}