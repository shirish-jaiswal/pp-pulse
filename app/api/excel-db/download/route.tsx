import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get("file");

  if (!fileName || fileName.includes("..")) {
    return new Response("Invalid file name", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "db_storage", fileName);
  console.log("Downloading:", filePath);

  if (!fs.existsSync(filePath)) {
    return new Response("File not found", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}