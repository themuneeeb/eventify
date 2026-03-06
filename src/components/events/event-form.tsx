"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TicketTypeRow } from "@/components/events/ticket-type-row";
import { createEventAction } from "@/actions/event.actions";
import { AlertCircle, Plus, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TicketTypeInput } from "@/validations/event.schema";

interface EventFormProps {
  categories: { id: string; name: string }[];
  locations: { id: string; name: string; city: string; country: string }[];
}

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Tickets" },
  { id: 3, label: "Review" },
];

const DEFAULT_TICKET: TicketTypeInput = {
  name: "",
  kind: "STANDARD",
  price: 0,
  quantity: 100,
  description: "",
  saleStart: "",
  saleEnd: "",
};

export function EventForm({ categories, locations }: EventFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, formAction, isPending] = useActionState(createEventAction, undefined);

  // ─── Form state ──────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [ticketTypes, setTicketTypes] = useState<TicketTypeInput[]>([
    { ...DEFAULT_TICKET },
  ]);

  // ─── Ticket helpers ──────────────────────
  function addTicketType() {
    setTicketTypes((prev) => [...prev, { ...DEFAULT_TICKET }]);
  }

  function removeTicketType(index: number) {
    setTicketTypes((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTicketType(
    index: number,
    field: keyof TicketTypeInput,
    value: string | number
  ) {
    setTicketTypes((prev) =>
      prev.map((tt, i) => (i === index ? { ...tt, [field]: value } : tt))
    );
  }

  // ─── Step validation ─────────────────────
  function canProceedStep1() {
    return title && description && categoryId && locationId && startDate && endDate;
  }

  function canProceedStep2() {
    return (
      ticketTypes.length > 0 && ticketTypes.every((tt) => tt.name && tt.quantity > 0)
    );
  }

  // ─── Handle redirect on success ──────────
  useEffect(() => {
    if (state?.success && !state?.error) {
      router.push("/dashboard/organizer/events");
    }
  }, [router, state?.error, state?.success]);

  // ─── Build FormData for submission ───────
  function handleSubmit(formData: FormData) {
    formData.set("title", title);
    formData.set("description", description);
    formData.set("categoryId", categoryId);
    formData.set("locationId", locationId);
    formData.set("startDate", startDate);
    formData.set("endDate", endDate);
    formData.set("coverImage", coverImage);
    formData.set("status", status);
    formData.set("ticketTypes", JSON.stringify(ticketTypes));
    return formAction(formData);
  }

  return (
    <div>
      {/* Step indicator — HCI: Visibility of system status */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (s.id < step) setStep(s.id);
              }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all",
                step === s.id
                  ? "bg-brand-orange text-white"
                  : step > s.id
                    ? "bg-success text-white"
                    : "bg-brand-sage/20 text-brand-sage"
              )}
              aria-label={`Step ${s.id}: ${s.label}`}
            >
              {step > s.id ? <Check className="h-4 w-4" /> : s.id}
            </button>
            <span
              className={cn(
                "hidden text-sm sm:inline",
                step === s.id ? "text-brand-charcoal font-medium" : "text-brand-sage"
              )}
            >
              {s.label}
            </span>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px w-8 sm:w-16",
                  step > s.id ? "bg-success" : "bg-brand-sage/20"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error display */}
      {state?.error && (
        <div
          className="bg-destructive/10 text-destructive mb-6 flex items-center gap-2 rounded-lg p-3 text-sm"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <form action={handleSubmit}>
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Tell us about your event. All fields are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="title"
                label="Event Title"
                placeholder="e.g., Summer Music Festival 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={state?.fieldErrors?.title?.[0]}
                required
              />

              <Textarea
                id="description"
                label="Description"
                placeholder="Describe your event in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={state?.fieldErrors?.description?.[0]}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="categoryId"
                    className="text-brand-charcoal text-sm font-medium"
                  >
                    Category
                  </label>
                  <select
                    id="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="border-brand-sage/50 focus:border-brand-orange focus:ring-brand-orange/20 flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="locationId"
                    className="text-brand-charcoal text-sm font-medium"
                  >
                    Location
                  </label>
                  <select
                    id="locationId"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="border-brand-sage/50 focus:border-brand-orange focus:ring-brand-orange/20 flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    required
                  >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} — {loc.city}, {loc.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="startDate"
                  label="Start Date & Time"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <Input
                  id="endDate"
                  label="End Date & Time"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <Input
                id="coverImage"
                label="Cover Image URL (optional)"
                placeholder="https://example.com/image.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Ticket Types */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Ticket Types</CardTitle>
              <CardDescription>
                Define at least one ticket type for your event.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticketTypes.map((ticket, index) => (
                <TicketTypeRow
                  key={index}
                  index={index}
                  ticket={ticket}
                  onChange={updateTicketType}
                  onRemove={removeTicketType}
                  canRemove={ticketTypes.length > 1}
                />
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addTicketType}
                className="w-full"
              >
                <Plus className="h-4 w-4" /> Add Another Ticket Type
              </Button>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Event</CardTitle>
              <CardDescription>
                Make sure everything looks good before creating.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event summary */}
              <div className="border-brand-sage/20 bg-brand-off-white rounded-lg border p-4">
                <h3 className="text-brand-charcoal text-lg font-semibold">
                  {title || "Untitled Event"}
                </h3>
                <p className="text-brand-soft-black mt-1 line-clamp-3 text-sm">
                  {description || "No description"}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-brand-sage">Category: </span>
                    <span className="text-brand-charcoal">
                      {categories.find((c) => c.id === categoryId)?.name || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-sage">Location: </span>
                    <span className="text-brand-charcoal">
                      {locations.find((l) => l.id === locationId)?.name || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-sage">Start: </span>
                    <span className="text-brand-charcoal">
                      {startDate ? new Date(startDate).toLocaleString() : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-sage">End: </span>
                    <span className="text-brand-charcoal">
                      {endDate ? new Date(endDate).toLocaleString() : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket types summary */}
              <div>
                <h4 className="text-brand-charcoal mb-2 text-sm font-medium">
                  Ticket Types ({ticketTypes.length})
                </h4>
                <div className="space-y-2">
                  {ticketTypes.map((tt, i) => (
                    <div
                      key={i}
                      className="border-brand-sage/20 flex items-center justify-between rounded-lg border bg-white px-4 py-2 text-sm"
                    >
                      <div>
                        <span className="text-brand-charcoal font-medium">
                          {tt.name || `Ticket #${i + 1}`}
                        </span>
                        <span className="text-brand-sage ml-2">({tt.kind})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-brand-orange font-medium">
                          {tt.kind === "FREE" ? "Free" : `$${tt.price}`}
                        </span>
                        <span className="text-brand-sage ml-2">× {tt.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish toggle — HCI: Clear affordance for the key decision */}
              <div className="border-brand-sage/20 bg-brand-cream/50 flex items-center gap-3 rounded-lg border p-4">
                <input
                  type="checkbox"
                  id="publish"
                  checked={status === "PUBLISHED"}
                  onChange={(e) => setStatus(e.target.checked ? "PUBLISHED" : "DRAFT")}
                  className="border-brand-sage text-brand-orange accent-brand-orange focus:ring-brand-orange h-4 w-4 rounded"
                />
                <label htmlFor="publish" className="text-sm">
                  <span className="text-brand-charcoal font-medium">
                    Publish immediately
                  </span>
                  <span className="text-brand-soft-black ml-1">
                    — If unchecked, event will be saved as draft.
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedStep1()) || (step === 2 && !canProceedStep2())
              }
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" isLoading={isPending}>
              <Check className="h-4 w-4" /> Create Event
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
