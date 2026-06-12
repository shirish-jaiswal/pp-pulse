"use server";

import c_getDecryptedFdKey from "./c_getDecryptedFdKey";
import {
    FreshdeskArticleRow,
    saveFreshdeskArticlesBatch,
} from "@/lib/excel-engine/knowledge-base/articles/load-all-articles";


import apiRequest from "../api-request";
import { deleteAllArticles } from "@/lib/excel-engine/knowledge-base/articles/delete-all";

export async function syncFreshdeskArticles() {
    try {
        // Delete existing articles before sync
        await deleteAllArticles();

        const fdKey = await c_getDecryptedFdKey();

        if (!fdKey) {
            throw new Error(
                "Unauthorized or missing valid Freshdesk API credentials."
            );
        }

        const DOMAIN = process.env.NEXT_PUBLIC_FRESHDESK_DOMAIN!;

        const authHeader = Buffer.from(`${fdKey}:X`).toString("base64");

        const headers = {
            Authorization: `Basic ${authHeader}`,
        };

        let page = 1;
        let keepFetching = true;
        let totalSynced = 0;

        while (keepFetching) {
            const articles: any[] = await apiRequest({
                method: "GET",
                endpoint: `/v2/solutions/folders/103000385679/articles?per_page=100&page=${page}`,
                baseURL: DOMAIN,
                headers,
                requireCookie: false,
            });

            // Stop when empty array is returned
            if (!articles || articles.length === 0) {
                console.log(
                    `🛑 Empty array hit at page ${page}. Fetching completed.`
                );

                keepFetching = false;
                break;
            }

            const pageBatch: FreshdeskArticleRow[] = [];

            for (const article of articles) {
                const folderItem = article.hierarchy?.find(
                    (h: any) => h.type === "folder"
                );

                const folderName = folderItem
                    ? folderItem.data.name
                    : "";

                const payload: FreshdeskArticleRow = {
                    article_id: article.id,
                    title: article.title,

                    // Excel cell safety limit
                    description:
                        article.description &&
                        article.description.length > 30000
                            ? article.description.substring(0, 30000)
                            : article.description || "",

                    description_text:
                        article.description_text || "",

                    seo_title:
                        article.seo_data?.meta_title || "",

                    seo_description:
                        article.seo_data?.meta_description || "",

                    folder_name: folderName,

                    created_at: article.created_at,

                    updated_at: article.updated_at,
                };

                pageBatch.push(payload);
            }

            if (pageBatch.length > 0) {
                await saveFreshdeskArticlesBatch(pageBatch);
                totalSynced += pageBatch.length;
            }

            page++;
        }

        return {
            success: true,
            count: totalSynced,
        };
    } catch (error: any) {
        console.error(
            "❌ Freshdesk Sync Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            count: 0,
            error: error.message,
        };
    }
}