"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateKey } from "@/hooks/use-keys";
import type { ApiKey } from "@/lib/types";

export function EditKeyDialog({
  apiKey,
  open,
  onOpenChange,
}: {
  apiKey: ApiKey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [budget, setBudget] = useState("0");
  const [rpm, setRpm] = useState("60");
  const [active, setActive] = useState(true);
  const { mutateAsync, isPending } = useUpdateKey();

  useEffect(() => {
    if (apiKey) {
      setBudget(String(apiKey.budget_usd));
      setRpm(String(apiKey.rpm_limit));
      setActive(apiKey.is_active);
    }
  }, [apiKey]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey) return;
    try {
      await mutateAsync({
        id: apiKey.id,
        input: {
          budget_usd: Number(budget),
          rpm_limit: Number(rpm),
          is_active: active,
        },
      });
      toast.success(`Updated "${apiKey.name}"`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update key");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit {apiKey?.name}</DialogTitle>
            <DialogDescription>
              Adjust the budget, rate limit, or active state.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="edit-budget">Budget (USD)</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="edit-rpm">Rate limit (rpm)</Label>
                <Input
                  id="edit-rpm"
                  type="number"
                  min="1"
                  value={rpm}
                  onChange={(e) => setRpm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <Label htmlFor="edit-active">Active</Label>
              <Switch
                id="edit-active"
                checked={active}
                onCheckedChange={setActive}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
