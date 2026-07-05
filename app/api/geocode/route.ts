import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Missing required query parameter 'q'" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");

  const response = await fetch(url, {
    headers: {
      // Nominatim's usage policy requires a descriptive User-Agent identifying the app.
      "User-Agent": "Discovery-SelfDiscoveryApp/0.1 (prototype; contact via project repo)",
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Geocoding lookup failed" }, { status: 502 });
  }

  const results = (await response.json()) as NominatimResult[];

  return NextResponse.json({
    candidates: results.map((r) => ({
      displayName: r.display_name,
      latitude: Number(r.lat),
      longitude: Number(r.lon),
    })),
  });
}
