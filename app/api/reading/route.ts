import { NextRequest, NextResponse } from "next/server";
import { runReading } from "@/lib/pipeline/runReading";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  try {
    const reading = await runReading(body);
    return NextResponse.json(reading);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate reading";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
