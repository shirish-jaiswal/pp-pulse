"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export interface FreshdeskArticleRow {
    article_id: number;
    title: string;
    description: string;
    description_text: string;
    seo_title: string;
    seo_description: string;
    folder_name: string;
    created_at: string;
    updated_at: string;
}

/**
 * Saves multiple Freshdesk article rows to the Excel DB sheet in a single batch file operation
 */
export async function saveFreshdeskArticlesBatch(articles: FreshdeskArticleRow[]) {
    if (!articles || articles.length === 0) return null;

    const payloads = articles.map(data => ({
        article_id: data.article_id,
        title: data.title,
        description: data.description ?? "",
        description_text: data.description_text ?? "",
        seo_title: data.seo_title ?? "",
        seo_description: data.seo_description ?? "",
        folder_name: data.folder_name ?? "",
        created_at: data.created_at,
        updated_at: data.updated_at,
    }));

    // Triggers the batch method we added above
    return await ExcelEngine.insertRows(DB_NAME, TABLE_NAME, payloads);
}