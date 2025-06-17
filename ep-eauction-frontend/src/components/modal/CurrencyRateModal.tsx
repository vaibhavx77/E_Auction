'use client';

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CurrencyRateModal({
  open,
  onClose,
  onSave,
  initialData = {},
  mode = 'add'
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { from: string; to: string; rate: number }) => void;
  initialData?: { from?: string; to?: string; rate?: number };
  mode?: "add" | "edit";
}) {
  const [from, setFrom] = React.useState(initialData.from || "");
  const [rate, setRate] = React.useState(initialData.rate ? String(initialData.rate) : "");

  React.useEffect(() => {
    setFrom(initialData.from || "");
    setRate(initialData.rate !== undefined ? String(initialData.rate) : "");
  }, [open, initialData]);

  // "to" is always GBP for your UI!
  const to = "GBP";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !rate) return;
    onSave({ from: from.toUpperCase(), to, rate: parseFloat(rate) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? "Edit Currency Rate" : "Add Currency Rate"}
          </DialogTitle>
          <DialogDescription>
      Add or edit an exchange rate for a currency (to GBP).
    </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Currency Code (e.g. USD)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            disabled={mode === 'edit'}
          />
          <Input
            placeholder="Exchange Rate (to GBP)"
            type="number"
            step="0.0001"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            required
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">{mode === "edit" ? "Save Changes" : "Add Rate"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
