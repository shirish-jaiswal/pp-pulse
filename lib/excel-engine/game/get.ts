"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME, TABLE_NAME } from ".";

export interface GAMETYPE {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

export async function getGamesAction() : Promise<GAMETYPE[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows)) as GAMETYPE[];
  } catch (e) {
    return [];
  }
}