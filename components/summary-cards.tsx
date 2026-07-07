"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiKey } from "@/lib/types";

function money(n: number): string {
  return `$${n.toFixed(4)}`;
}

export function SummaryCards({ keys }: { keys: ApiKey[] }) {
  const totalBudget = keys.reduce((s, k) => s + k.budget_usd, 0);
  const totalSpent = keys.reduce((s, k) => s + k.used_usd, 0);
  const totalRemaining = keys.reduce((s, k) => s + k.remaining_usd, 0);
  const active = keys.filter((k) => k.is_active).length;

  const items = [
    { label: "API keys", value: `${keys.length}`, sub: `${active} active` },
    { label: "Total spent", value: money(totalSpent) },
    { label: "Total budget", value: money(totalBudget) },
    { label: "Remaining", value: money(totalRemaining) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {it.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{it.value}</div>
            {it.sub && (
              <div className="text-xs text-muted-foreground">{it.sub}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
