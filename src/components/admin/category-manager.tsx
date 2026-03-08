"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCategoryAction, deleteCategoryAction } from "@/actions/admin.actions";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Tag, AlertCircle, CheckCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { events: number };
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const { addToast } = useToast();
  const [state, formAction, isCreating] = useActionState(createCategoryAction, undefined);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
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
          <Tag className="text-brand-orange h-5 w-5" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="flex gap-2">
          <Input
            name="name"
            placeholder="New category name"
            required
            className="flex-1"
          />
          <Button type="submit" size="sm" isLoading={isCreating}>
            <Plus className="h-4 w-4" /> Add
          </Button>
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
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border-brand-sage/20 flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-brand-charcoal text-sm font-medium">
                  {cat.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {cat._count.events} events
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending || cat._count.events > 0}
                onClick={() => handleDelete(cat.id)}
                className="text-destructive hover:text-destructive"
                title={cat._count.events > 0 ? "Cannot delete: has events" : "Delete"}
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
