// Mirrors the backend's key summary shape (app/routers/admin.py _key_summary).
export interface ApiKey {
  id: number;
  name: string;
  key_prefix: string;
  budget_usd: number;
  used_usd: number;
  remaining_usd: number;
  rpm_limit: number;
  is_active: boolean;
}

// POST /admin/keys additionally returns the plaintext key once.
export interface CreatedApiKey extends ApiKey {
  api_key: string;
}

export interface CreateKeyInput {
  name: string;
  budget_usd: number;
  rpm_limit?: number;
}

export interface UpdateKeyInput {
  budget_usd?: number;
  rpm_limit?: number;
  is_active?: boolean;
}
