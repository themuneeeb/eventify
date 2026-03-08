"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { approveOrganizerAction } from "@/actions/admin.actions";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import { UserCheck } from "lucide-react";

interface PendingOrganizer {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
}

export function PendingOrganizers({ organizers }: { organizers: PendingOrganizer[] }) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  if (organizers.length === 0) return null;

  function handleApprove(userId: string) {
    startTransition(async () => {
      const result = await approveOrganizerAction(userId);
      addToast({
        type: result.success ? "success" : "error",
        title: result.success || "Error",
      });
    });
  }

  return (
    <Card className="border-brand-orange/30 bg-brand-orange/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCheck className="text-brand-orange h-5 w-5" />
          Pending Organizer Approvals ({organizers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {organizers.map((org) => (
          <div
            key={org.id}
            className="border-brand-sage/20 flex items-center justify-between rounded-lg border bg-white p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {org.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-brand-charcoal text-sm font-medium">{org.name}</p>
                <p className="text-brand-sage text-xs">
                  {org.email} · Applied {formatDate(org.createdAt)}
                </p>
              </div>
            </div>
            <Button size="sm" disabled={isPending} onClick={() => handleApprove(org.id)}>
              Approve
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
