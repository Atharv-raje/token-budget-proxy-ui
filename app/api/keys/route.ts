import { NextResponse } from "next/server";

import { isAuthed } from "@/lib/session";
import { backendFetch, passthrough } from "@/lib/backend";

async function guard(): Promise<Response | null> {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  const res = await backendFetch("/admin/keys");
  return passthrough(res);
}

export async function POST(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const res = await backendFetch("/admin/keys", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return passthrough(res);
}
