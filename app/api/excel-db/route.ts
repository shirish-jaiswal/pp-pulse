import { NextRequest, NextResponse } from "next/server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";

function ok(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  try {
    const databases = ExcelEngine.getDatabases().map((name) => {
      try {
        return { name, tableCount: ExcelEngine.getTables(name).length };
      } catch {
        return { name, tableCount: 0 };
      }
    });
    return ok(databases);
  } catch (e: any) {
    return err(e.message, 500);
  }
}

// POST /api/excel-db → create database  body: { name }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name } = body;
    if (!name) return err("name is required");
    const result = ExcelEngine.createDatabase(name);
    return ok(result, 201);
  } catch (e: any) {
    return err(e.message);
  }
}