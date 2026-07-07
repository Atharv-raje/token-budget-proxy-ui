"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { EditKeyDialog } from "@/components/edit-key-dialog";
import { useUpdateKey } from "@/hooks/use-keys";
import type { ApiKey } from "@/lib/types";

function money(n: number): string {
  return `$${n.toFixed(4)}`;
}

export function KeysTable({ keys }: { keys: ApiKey[] }) {
  const [editing, setEditing] = useState<ApiKey | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { mutateAsync } = useUpdateKey();

  async function toggleActive(key: ApiKey, next: boolean) {
    try {
      await mutateAsync({ id: key.id, input: { is_active: next } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function copyPrefix(prefix: string) {
    await navigator.clipboard.writeText(prefix);
    toast.message("Prefix copied");
  }

  function openEdit(key: ApiKey) {
    setEditing(key);
    setEditOpen(true);
  }

  if (keys.length === 0) {
    return (
      <div className="rounded-lg border bg-background p-10 text-center text-sm text-muted-foreground">
        No API keys yet. Create one to get started.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead className="w-[220px]">Spend</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead className="text-right">RPM</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => {
              const pct =
                key.budget_usd > 0
                  ? Math.min(100, (key.used_usd / key.budget_usd) * 100)
                  : 0;
              return (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => copyPrefix(key.key_prefix)}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground"
                      title="Copy prefix"
                    >
                      {key.key_prefix}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Progress value={pct} className="w-full" />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {money(key.used_usd)} / {money(key.budget_usd)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {money(key.remaining_usd)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {key.rpm_limit}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={key.is_active}
                        onCheckedChange={(v) => toggleActive(key, v)}
                      />
                      <Badge variant={key.is_active ? "secondary" : "outline"}>
                        {key.is_active ? "active" : "off"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(key)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <EditKeyDialog
        apiKey={editing}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
