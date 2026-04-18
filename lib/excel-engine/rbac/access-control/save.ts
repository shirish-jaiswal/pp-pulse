"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";


export async function saveFeatureList(data: { role: string; feature_list: string, }, id?: number | null) {
  let result;
  if (id) {
    result = await ExcelEngine.updateRow(DB_NAME, TABLE_NAME, id, data);
  } else {
    result = await ExcelEngine.insertRow(DB_NAME, TABLE_NAME, data);
  }

  return JSON.parse(JSON.stringify(result));
}