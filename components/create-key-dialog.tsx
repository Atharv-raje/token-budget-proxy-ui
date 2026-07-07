"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateKey } from "@/hooks/use-keys";
import type { CreatedApiKey } from "@/lib/types";

export function CreateKeyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("0.50");
  const [rpm, setRpm] = useState("60");
  const [created, setCreated] = useState<CreatedApiKey | null>(null);
  const { mutateAsync, isPending } = useCreateKey();

  function reset() {
    setName("");
    setBudget("0.50");
    setRpm("60");
    setCreated(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const key = await mutateAsync({
        name: name.trim(),
        budget_usd: Number(budget),
        rpm_limit: Number(rpm),
      });
      setCreated(key);
      toast.success(`Key "${key.name}" created`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create key");
    }
  }

  async function copyKey() {
    if (!created) return;
    await navigator.clipboard.writeText(created.api_key);
    toast.success("Key copied to clipboard");
  }

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button>Create key</Button>} />
      <DialogContent>
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle>Key created</DialogTitle>
              <DialogDescription>
                Copy it now — you won&apos;t be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-md border bg-muted p-3 font-mono text-sm break-all">
              {created.api_key}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={copyKey}>
                Copy
              </Button>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>
                Issue a new key with a USD budget.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="alice"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="rpm">Rate limit (rpm)</Label>
                  <Input
                    id="rpm"
                    type="number"
                    min="1"
                    value={rpm}
                    onChange={(e) => setRpm(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending || !name.trim()}>
                {isPending ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
