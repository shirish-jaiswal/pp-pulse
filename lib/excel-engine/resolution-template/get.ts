"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME, TABLE_NAME } from ".";

export interface ResolutionTemplate {
  id: number;
  title: string;
  game: string;
  category: string;
  subcategory: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}


export async function getResolutionsAction() : Promise<ResolutionTemplate[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows));
  } catch (e) {
    return [];
  }
}
