"use server"

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from "."; 
import { DB_NAME } from "..";
import { STORED_QUERIES_TEMPLATE_TYPE } from "./get-all";

export async function updateQueryTemplate(
    id: number,
    updates: Partial<Omit<STORED_QUERIES_TEMPLATE_TYPE, "id">>
) {
    try {
        const updatedRow = ExcelEngine.updateRow(
            DB_NAME,
            TABLE_NAME,
            id,
            updates
        );

        // Safe conversion using unknown to bypass structural mismatch warnings
        const plainData = updatedRow as unknown as STORED_QUERIES_TEMPLATE_TYPE;

        return {
            success: true,
            data: plainData,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to update the query template.",
        };
    }
}