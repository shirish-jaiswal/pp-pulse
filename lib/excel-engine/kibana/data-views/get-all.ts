"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export interface DATA_VIEWS_TYPE {
    id: number;
    uuid: string;
    name: string;
    default_fields: string[];
    pop_fields: string[];
    created_at: string;
    updated_at: string;
}

export async function getAllDataViews(): Promise<DATA_VIEWS_TYPE[]> {
    try {
        const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);

        return JSON.parse(JSON.stringify(rawRows)).map((row: any) => ({
            ...row,
            default_fields: row.default_fields
                ? row.default_fields
                      .split(",")
                      .map((item: string) => item.trim())
                      .filter(Boolean)
                : [],
            pop_fields: row.pop_fields
                ? row.pop_fields
                      .split(",")
                      .map((item: string) => item.trim())
                      .filter(Boolean)
                : [],
        })) as DATA_VIEWS_TYPE[];
    } catch (e) {
        return [];
    }
}