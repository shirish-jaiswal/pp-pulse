"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";
import { TABLE_NAME } from ".";
import { DB_NAME } from "..";
import { QNA } from "./get-all";

export async function saveQna(
    data: Partial<QNA>,
    id?: number | null
) {
    if (!data.question || !data.answer) {
        throw new Error("Question and Answer are required");
    }

    const payload: Partial<QNA> = {
        question: data.question,
        answer: data.answer,
        options: data.options ?? "",
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