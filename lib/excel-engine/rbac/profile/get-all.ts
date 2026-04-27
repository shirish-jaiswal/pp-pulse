"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export interface Profile {
  id: number;
  name: string;
  email: boolean;
  role: string;
  settings: string;
  created_at?: string;
  updated_at?: string;
}


export async function getAllProfile() : Promise<Profile[]> {
  try {
    const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    return JSON.parse(JSON.stringify(rawRows));
  } catch (e) {
    return [];
  }
}
