"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateEventAction } from "@/actions/event.actions";
import { AlertCircle, CheckCircle, Save } from "lucide-react";
import { useCallback } from "react";

interface EventEditFormProps {
  event: {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    locationId: string;
    startDate: Date;
    endDate: Date;
    coverImage: string | null;
    status: string;
  };
  categories: { id: string; name: string }[];
  locations: { id: string; name: string; city: string; country: string }[];
}

export function EventEditForm({ event, categories, locations }: EventEditFormProps) {
  const updateWithId = useCallback(
    (prevState: { error?: string; success?: string } | undefined, formData: FormData) =>
      updateEventAction(event.id, prevState, formData),
    [event.id]
  );

  const [state, formAction, isPending] = useActionState(updateWithId, undefined);

  function formatDateForInput(date: Date) {
    return new Date(date).toISOString().slice(0, 16);
  }

  return (
    <form action={formAction}>
      {state?.error && (
        <div
          className="bg-destructive/10 text-destructive mb-6 flex items-center gap-2 rounded-lg p-3 text-sm"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      {state?.success && (
        <div
          className="bg-success/10 text-success mb-6 flex items-center gap-2 rounded-lg p-3 text-sm"
          role="status"
        >
          <CheckCircle className="h-4 w-4 shrink-0" />
          {state.success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="title"
            name="title"
            label="Event Title"
            defaultValue={event.title}
            required
          />

          <Textarea
            id="description"
            name="description"
            label="Description"
            defaultValue={event.description}
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
                name="categoryId"
                defaultValue={event.categoryId}
                className="border-brand-sage/50 focus:border-brand-orange focus:ring-brand-orange/20 flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              >
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
                name="locationId"
                defaultValue={event.locationId}
                className="border-brand-sage/50 focus:border-brand-orange focus:ring-brand-orange/20 flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              >
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
              name="startDate"
              label="Start Date & Time"
              type="datetime-local"
              defaultValue={formatDateForInput(event.startDate)}
            />
            <Input
              id="endDate"
              name="endDate"
              label="End Date & Time"
              type="datetime-local"
              defaultValue={formatDateForInput(event.endDate)}
            />
          </div>

          <Input
            id="coverImage"
            name="coverImage"
            label="Cover Image URL (optional)"
            defaultValue={event.coverImage || ""}
          />

          <div className="space-y-1.5">
            <label htmlFor="status" className="text-brand-charcoal text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={event.status}
              className="border-brand-sage/50 focus:border-brand-orange focus:ring-brand-orange/20 flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isPending}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
