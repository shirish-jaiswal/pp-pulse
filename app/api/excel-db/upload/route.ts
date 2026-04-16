import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "db_storage");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.name);

  // 🔍 Check if file already exists
  if (fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "File with same name already exists" },
      { status: 409 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ success: true, file: file.name });
}