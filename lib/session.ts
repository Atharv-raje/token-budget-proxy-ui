import "server-only";

import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  authed?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "insecure-dev-secret-please-set-32-chars",
  cookieName: "tbp_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAuthed(): Promise<boolean> {
  const session = await getSession();
  return session.authed === true;
}
