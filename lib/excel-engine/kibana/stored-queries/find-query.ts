"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from "."; 
import { DB_NAME } from "..";
import { STORED_QUERIES_TEMPLATE_TYPE } from "./get-all";

export async function findStoredQueries(keywords: string[]) {
    try {
        // Target structural metadata columns to find your specific template row
        const targetColumns = ["title", "description"];

        const results = ExcelEngine.findRowsByKeywords(
            DB_NAME,
            TABLE_NAME,
            keywords,
            targetColumns
        );

        // Standardize data representation out of Excel row instances
        const plainData: STORED_QUERIES_TEMPLATE_TYPE[] = JSON.parse(JSON.stringify(results ?? []));

        return {
            success: true,
            data: plainData,
        };
    } catch (error: any) {
        return {
            success: false,
            data: [],
            error: error.message || "An error occurred while fetching query templates.",
        };
    }
}