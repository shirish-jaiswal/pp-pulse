"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from "."; 
import { DB_NAME } from "..";
import { STORED_QUERIES_TEMPLATE_TYPE } from "./get-all";

/**
 * Creates/Saves a brand new query template record.
 * @param template Data excluding the auto-generated id, created_at, and updated_at fields
 */
export async function createQueryTemplate(
    template: Omit<STORED_QUERIES_TEMPLATE_TYPE, "id">
) {
    try {
        const newRow = ExcelEngine.insertRow(
            DB_NAME,
            TABLE_NAME,
            template
        );

        return {
            success: true,
            data: newRow as STORED_QUERIES_TEMPLATE_TYPE,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to save the query template.",
        };
    }
}