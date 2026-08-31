import { NextResponse } from "next/server";

import { runIngest } from "@/lib/ingest/run";

export const maxDuration = 300; // segundos (plano Hobby permite até 300 em rota)
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.INGEST_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const bearer = header.replace(/^Bearer\s+/i, "");
  const url = new URL(req.url);
  return bearer === secret || url.searchParams.get("key") === secret;
}

async function handle(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }
  try {
    const result = await runIngest();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[api/ingest]", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "falha" },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;
