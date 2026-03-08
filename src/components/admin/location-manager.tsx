"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createLocationAction, deleteLocationAction } from "@/actions/admin.actions";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, MapPin, AlertCircle, CheckCircle } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  _count: { events: number };
}

export function LocationManager({ locations }: { locations: Location[] }) {
  const { addToast } = useToast();
  const [state, formAction, isCreating] = useActionState(createLocationAction, undefined);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteLocationAction(id);
      addToast({
        type: result.error ? "error" : "success",
        title: result.error || result.success || "Done",
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="text-brand-orange h-5 w-5" />
          Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Input name="name" placeholder="Venue name" required />
          <Input name="address" placeholder="Address" required />
          <Input name="city" placeholder="City" required />
          <div className="flex gap-2">
            <Input name="country" placeholder="Country" required />
            <Button type="submit" size="sm" isLoading={isCreating} className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {state?.error && (
          <p className="text-destructive flex items-center gap-1 text-xs">
            <AlertCircle className="h-3 w-3" /> {state.error}
          </p>
        )}
        {state?.success && (
          <p className="text-success flex items-center gap-1 text-xs">
            <CheckCircle className="h-3 w-3" /> {state.success}
          </p>
        )}

        <div className="space-y-2">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="border-brand-sage/20 flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <div>
                <span className="text-brand-charcoal text-sm font-medium">
                  {loc.name}
                </span>
                <span className="text-brand-sage ml-2 text-xs">
                  {loc.city}, {loc.country}
                </span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {loc._count.events} events
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending || loc._count.events > 0}
                onClick={() => handleDelete(loc.id)}
                className="text-destructive hover:text-destructive"
                title={loc._count.events > 0 ? "Cannot delete: has events" : "Delete"}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
