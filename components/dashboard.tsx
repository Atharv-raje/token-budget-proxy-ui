"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/summary-cards";
import { KeysTable } from "@/components/keys-table";
import { CreateKeyDialog } from "@/components/create-key-dialog";
import { useKeys } from "@/hooks/use-keys";
import { logout } from "@/lib/api";

export function Dashboard() {
  const router = useRouter();
  const { data: keys, isLoading, isError, error } = useKeys();

  async function onLogout() {
    await logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">TokenBudgetProxy</h1>
          <p className="text-sm text-muted-foreground">
            Per-user API keys &amp; budgets · live spend
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateKeyDialog />
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Failed to load keys: {error instanceof Error ? error.message : "unknown error"}.
          Is the backend running at BACKEND_URL?
        </div>
      ) : isLoading ? (
        <div className="rounded-lg border bg-background p-10 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <SummaryCards keys={keys ?? []} />
          <KeysTable keys={keys ?? []} />
        </div>
      )}
    </main>
  );
}
