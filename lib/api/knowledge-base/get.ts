// app/actions/kb-actions.ts
"use server";

import { ExcelEngine } from "@/lib/excel-engine/excel-engine";


const DB_NAME = "knowledge_base";
const TABLE_NAME = "articles";

export async function getKBArticles(query?: string) {
  try {
    const rows = ExcelEngine.getRows(DB_NAME, TABLE_NAME);
    
    if (!query) return rows;

    const lowerQuery = query.toLowerCase();
    return rows.filter((row: any) => 
      row.systitle?.toLowerCase().includes(lowerQuery) || 
      row.category?.toLowerCase().includes(lowerQuery) ||
      row.publisher?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function addKBArticle(data: { 
  systitle: string; 
  category: string; 
  status: string; 
  publisher: string 
}) {
  const DB = "knowledge_base";
  const TABLE = "articles";

  // Map the incoming form data to your specific Excel schema
  // ExcelEngine.insertRow handles 'id' and 'created_at' automatically
  const newRow = {
    systitle: data.systitle,
    category: data.category,
    status: data.status,
    publisher: data.publisher,
    sysupdated_at: new Date().toISOString() // Specific column name you requested
  };

  return ExcelEngine.insertRow(DB, TABLE, newRow);
}