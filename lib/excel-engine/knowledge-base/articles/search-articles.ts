"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export async function searchArticles(keywords: string[]) {
    try {
        const targetColumns = ["seo_title", "seo_description"];

        const results = ExcelEngine.findRowsByKeywords(
            DB_NAME,
            TABLE_NAME,
            keywords,
            targetColumns
        );

        const plainData = JSON.parse(JSON.stringify(results ?? []));

        return {
            success: true,
            data: plainData,
        };
    } catch (error: any) {
        return {
            success: false,
            data: [],
            error: error.message,
        };
    }
}