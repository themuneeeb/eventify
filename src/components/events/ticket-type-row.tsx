"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { TicketTypeInput } from "@/validations/event.schema";

interface TicketTypeRowProps {
  index: number;
  ticket: TicketTypeInput;
  onChange: (index: number, field: keyof TicketTypeInput, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const KINDS = [
  { value: "FREE", label: "Free" },
  { value: "STANDARD", label: "Standard" },
  { value: "VIP", label: "VIP" },
  { value: "EARLY_BIRD", label: "Early Bird" },
];

export function TicketTypeRow({
  index,
  ticket,
  onChange,
  onRemove,
  canRemove,
}: TicketTypeRowProps) {
  return (
    <div className="border-brand-sage/20 bg-brand-off-white rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-brand-charcoal text-sm font-medium">
          Ticket #{index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive"
            aria-label={`Remove ticket type ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Name"
          id={`ticket-name-${index}`}
          placeholder="e.g., General Admission"
          value={ticket.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label
            htmlFor={`ticket-kind-${index}`}
            className="text-brand-charcoal text-sm font-medium"
          >
            Type
          </label>
          <select
            id={`ticket-kind-${index}`}
            value={ticket.kind}
            onChange={(e) => onChange(index, "kind", e.target.value)}
            className="border-brand-sage/50 focus:border-brand-orange focus:ring-brand-orange/20 flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Price ($)"
          id={`ticket-price-${index}`}
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={ticket.kind === "FREE" ? 0 : ticket.price}
          onChange={(e) => onChange(index, "price", parseFloat(e.target.value) || 0)}
          disabled={ticket.kind === "FREE"}
        />

        <Input
          label="Quantity"
          id={`ticket-qty-${index}`}
          type="number"
          min="1"
          placeholder="100"
          value={ticket.quantity}
          onChange={(e) => onChange(index, "quantity", parseInt(e.target.value) || 1)}
          required
        />
      </div>

      <div className="mt-3">
        <Input
          label="Description (optional)"
          id={`ticket-desc-${index}`}
          placeholder="Brief description of what this ticket includes"
          value={ticket.description || ""}
          onChange={(e) => onChange(index, "description", e.target.value)}
        />
      </div>
    </div>
  );
}
