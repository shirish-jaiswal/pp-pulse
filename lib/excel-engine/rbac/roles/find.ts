"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export async function findRole(filters: {
    title: string
}) {
    try {
        const rows = await ExcelEngine.findRows(DB_NAME, TABLE_NAME, filters);
        return JSON.parse(JSON.stringify(rows));
    } catch (e) {
        return [];
    }
}