"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export interface DATA_VIEWS_TYPE {
    id: number;
    uuid: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export async function getAllDataViews() : Promise<DATA_VIEWS_TYPE[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows)) as DATA_VIEWS_TYPE[];
  } catch (e) {
    return [];
  }
}