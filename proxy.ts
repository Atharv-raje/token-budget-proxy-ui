import { NextResponse, type NextRequest } from "next/server";

// Lightweight UX gate: if there's no session cookie, bounce "/" to /login.
// Authoritative auth is enforced server-side in the dashboard page and in the
// /api/keys route handlers.
export default function proxy(request: NextRequest) {
  const hasSession = request.cookies.has("tbp_session");
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
