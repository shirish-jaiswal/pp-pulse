"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";
import { HelpNotes } from "./get-all";

export async function saveHelpNotes(
    data: Partial<HelpNotes>,
    id?: number | null
) {
    if (!data.notes || !data.priority) {
        throw new Error("Notes and Priority are required");
    }

    const payload: Partial<HelpNotes> = {
        notes: data.notes,
        priority: data.priority ?? 0,
    };

    let result;

    if (id !== undefined && id !== null) {
        result = await ExcelEngine.updateRow(DB_NAME, TABLE_NAME, id, payload);
    } else {
        result = await ExcelEngine.insertRow(DB_NAME, TABLE_NAME, payload);
    }

    return result;
}