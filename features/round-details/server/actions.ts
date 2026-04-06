"use server";

import { RESOLUTION_TEMPLATE_CONFIG } from "@/lib/excel-engine/db";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";

const DB_NAME = RESOLUTION_TEMPLATE_CONFIG.name;
const TABLE_NAME = RESOLUTION_TEMPLATE_CONFIG.tables.resolutions.name;

export async function findResolutionsAction(filters: {
  game: string;
  category: string;
}) {
  try {
    const rows = await ExcelEngine.findRows(DB_NAME, TABLE_NAME, filters);
    return JSON.parse(JSON.stringify(rows));
  } catch (e) {
    return [];
  }
}