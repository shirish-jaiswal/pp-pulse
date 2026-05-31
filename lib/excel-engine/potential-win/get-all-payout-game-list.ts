"use server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { DB_NAME } from ".";

export async function getAllGameTableNames() {
    try {
        const tables = ExcelEngine.getTables(DB_NAME);
        return tables; 
    } catch (e) {
        console.error("GET ALL TABLE NAMES ERROR:", e);
        return [];
    }
}