import { promises as fs } from "node:fs";
import { stat } from "node:fs/promises";
import { basename, extname, relative, resolve } from "node:path";
import { NextResponse } from "next/server";
import { getCatalogDir, DEFAULT_REVALIDATE_SECONDS } from "@/lib/catalog-fs";

export const runtime = "nodejs";
export const revalidate = DEFAULT_REVALIDATE_SECONDS;

const MIME_TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".json": "application/json",
};

const CACHE_HEADER = "public, max-age=3600, stale-while-revalidate=86400";

function isHiddenSegment(segment: string): boolean {
  return segment.startsWith(".") || segment.startsWith("_");
}

export async function GET(
  _req: Request,
  { params }: { params: { path?: string[] } }
) {
  const segments = params.path ?? [];

  if (segments.length === 0) {
    return NextResponse.json({ error: "Missing asset path" }, { status: 400 });
  }

  if (segments.some((segment) => segment.includes("..") || isHiddenSegment(segment))) {
    return NextResponse.json({ error: "Invalid asset path" }, { status: 404 });
  }

  const catalogDir = getCatalogDir();
  const absolutePath = resolve(catalogDir, ...segments);
  const rel = relative(catalogDir, absolutePath);
  if (rel.startsWith("..")) {
    return NextResponse.json({ error: "Invalid asset path" }, { status: 404 });
  }

  let fileStats;
  try {
    fileStats = await stat(absolutePath);
  } catch {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  if (!fileStats.isFile()) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const fileBuffer = await fs.readFile(absolutePath);
  const body = new Uint8Array(fileBuffer);
  const ext = extname(absolutePath).toLowerCase();
  const mime = MIME_TYPES[ext] ?? "application/octet-stream";

  const response = new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Cache-Control": CACHE_HEADER,
      "X-Served-From": "catalog-assets",
      "Content-Disposition": `inline; filename="${basename(absolutePath)}"`,
    },
  });

  return response;
}
