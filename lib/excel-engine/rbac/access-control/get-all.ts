"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";

export interface AccessControlTemplate {
    id: number;
    role: string;
    feature_list: string;
    created_at?: string;
    updated_at?: string;
}


export async function getAllFeatureList(): Promise<AccessControlTemplate[]> {
    try {
        const rawRows = await ExcelEngine.getRows(DB_NAME, TABLE_NAME);
        return JSON.parse(JSON.stringify(rawRows));
    } catch (e) {
        return [];
    }
}
