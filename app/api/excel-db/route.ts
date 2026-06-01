import { NextRequest, NextResponse } from "next/server";
import { ExcelEngine } from "@/lib/excel-engine/excel-engine";

function ok(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ─── SIMPLE IN-MEMORY CACHE ──────────────────────────────────────────
// Reuses the global cache strategy to keep engine reads at a minimum.
// Note: In Next.js App Router, these global variables persist across requests 
// within the same container instance.
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache life

function getCache(key: string) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

function invalidateCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
// ────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const cacheKey = "databases:list";
    const cachedData = getCache(cacheKey);
    if (cachedData) return ok(cachedData);

    const databases = ExcelEngine.getDatabases().map((name) => {
      try {
        return { name, tableCount: ExcelEngine.getTables(name).length };
      } catch {
        return { name, tableCount: 0 };
      }
    });

    setCache(cacheKey, databases);
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
    
    // Invalidate the overall database listings cache since a new one was created
    invalidateCache("databases:list");
    
    return ok(result, 201);
  } catch (e: any) {
    return err(e.message);
  }
}




















