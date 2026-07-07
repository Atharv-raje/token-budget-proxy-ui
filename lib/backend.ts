import "server-only";

/**
 * Server-only wrapper for talking to the FastAPI backend.
 * Injects the admin password header so it never reaches the browser.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export async function backendFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": ADMIN_PASSWORD,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

/** Forward a backend Response (status + JSON body) back to the browser. */
export async function passthrough(res: Response): Promise<Response> {
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
