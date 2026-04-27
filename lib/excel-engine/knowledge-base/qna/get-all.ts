"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export interface QNA {
  id: number;
  question: string;
  answer: string;
  options: string;
  priority: number;
  created_at?: string;
  updated_at?: string;
}


export async function getAllQna() : Promise<QNA[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows));
  } catch (e) {
    return [];
  }
}
