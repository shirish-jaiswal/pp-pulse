"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export interface STORED_QUERIES_TEMPLATE_TYPE {
    id: number;
    title: string;
    query_string: string;
    filters: string;
    default_columns: string;
    index: string;
    description: string;
    created_at?: string;
    updated_at?: string
}

export async function getAllStoredQueries() : Promise<STORED_QUERIES_TEMPLATE_TYPE[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows)) as STORED_QUERIES_TEMPLATE_TYPE[];
  } catch (e) {
    return [];
  }
}