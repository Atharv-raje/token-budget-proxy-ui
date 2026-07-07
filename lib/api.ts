import type {
  ApiKey,
  CreatedApiKey,
  CreateKeyInput,
  UpdateKeyInput,
} from "./types";

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as { error?: string; detail?: string }).error ??
      (data as { detail?: string }).detail ??
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export async function fetchKeys(): Promise<ApiKey[]> {
  return jsonOrThrow<ApiKey[]>(await fetch("/api/keys", { cache: "no-store" }));
}

export async function createKey(input: CreateKeyInput): Promise<CreatedApiKey> {
  return jsonOrThrow<CreatedApiKey>(
    await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function updateKey(
  id: number,
  input: UpdateKeyInput
): Promise<ApiKey> {
  return jsonOrThrow<ApiKey>(
    await fetch(`/api/keys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function logout(): Promise<void> {
  await fetch("/api/logout", { method: "POST" });
}
