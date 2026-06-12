"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export async function deleteAllArticles(): Promise<{ success: boolean }> {
    try {
        // Get all rows first
        const rows = ExcelEngine.getRows(DB_NAME, TABLE_NAME);

        if (!rows || rows.length === 0) {
            return { success: true };
        }

        // Delete rows one by one using their IDs
        for (const row of rows) {
            if (row.id !== undefined && row.id !== null) {
                await ExcelEngine.deleteRow(DB_NAME, TABLE_NAME, row.id);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Delete all articles failed:", error.message);

        throw new Error(
            "Could not delete all articles. The file may be locked or inaccessible."
        );
    }
}