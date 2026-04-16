"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME, TABLE_NAME } from ".";

export interface VariableTypes {
  id: number;
  key: string;
  value: string;
  isLink: string,
  linkTemplate: string,
  created_at: string;
  updated_at: string;
}

export async function getAllVariables(): Promise<VariableTypes[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows)) as VariableTypes[];
  } catch (e) {
    return [];
  }
}