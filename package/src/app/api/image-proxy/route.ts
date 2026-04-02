import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) return new Response("Missing url", { status: 400 });
  if (!imageUrl.startsWith("http")) return new Response("Invalid url", { status: 400 });

  try {
    const res = await fetch(imageUrl, {
      headers: {
        Referer: "https://www.microtek.in/",
        Origin: "https://www.microtek.in",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) return new Response("Image fetch failed", { status: res.status });

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("Content-Type") || "image/jpeg";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response("Proxy error", { status: 500 });
  }
}