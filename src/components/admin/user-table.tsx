"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import {
  approveOrganizerAction,
  blockUserAction,
  unblockUserAction,
  changeUserRoleAction,
} from "@/actions/admin.actions";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, ShieldOff, UserCheck, Calendar } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  isApproved: boolean;
  isBlocked: boolean;
  createdAt: Date;
  _count: { organizedEvents: number; orders: number };
}

export function UserTable({ users }: { users: User[] }) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [blockTarget, setBlockTarget] = useState<string | null>(null);

  function handleAction(action: () => Promise<{ success?: string; error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        addToast({ type: "error", title: "Error", message: result.error });
      } else {
        addToast({ type: "success", title: result.success || "Done" });
      }
      setBlockTarget(null);
    });
  }

  const roleBadgeVariant: Record<
    string,
    "default" | "success" | "destructive" | "outline" | "secondary"
  > = {
    ADMIN: "destructive",
    ORGANIZER: "default",
    ATTENDEE: "secondary",
  };

  return (
    <>
      <div className="border-brand-sage/20 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-brand-sage/20 bg-brand-off-white border-b">
              <th className="text-brand-sage px-4 py-3 font-medium">User</th>
              <th className="text-brand-sage px-4 py-3 font-medium">Role</th>
              <th className="text-brand-sage px-4 py-3 font-medium">Status</th>
              <th className="text-brand-sage px-4 py-3 font-medium">Events</th>
              <th className="text-brand-sage px-4 py-3 font-medium">Orders</th>
              <th className="text-brand-sage px-4 py-3 font-medium">Joined</th>
              <th className="text-brand-sage px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-brand-sage/10 border-b last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name || ""} />
                      )}
                      <AvatarFallback className="text-xs">
                        {user.name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-brand-charcoal font-medium">
                        {user.name || "—"}
                      </p>
                      <p className="text-brand-sage text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={roleBadgeVariant[user.role] || "outline"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {user.isBlocked ? (
                    <Badge variant="destructive">Blocked</Badge>
                  ) : user.role === "ORGANIZER" && !user.isApproved ? (
                    <Badge variant="outline">Pending</Badge>
                  ) : (
                    <Badge variant="success">Active</Badge>
                  )}
                </td>
                <td className="text-brand-soft-black px-4 py-3">
                  {user._count.organizedEvents}
                </td>
                <td className="text-brand-soft-black px-4 py-3">{user._count.orders}</td>
                <td className="text-brand-sage px-4 py-3 text-xs">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {user.role === "ORGANIZER" && !user.isApproved && !user.isBlocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          handleAction(() => approveOrganizerAction(user.id))
                        }
                        title="Approve"
                      >
                        <UserCheck className="text-success h-4 w-4" />
                      </Button>
                    )}
                    {user.isBlocked ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleAction(() => unblockUserAction(user.id))}
                        title="Unblock"
                      >
                        <ShieldCheck className="text-success h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => setBlockTarget(user.id)}
                        title="Block"
                        className="text-destructive"
                      >
                        <ShieldOff className="h-4 w-4" />
                      </Button>
                    )}
                    <select
                      className="border-brand-sage/30 focus:border-brand-orange rounded border bg-white px-1 py-0.5 text-xs focus:outline-none"
                      value={user.role}
                      onChange={(e) =>
                        handleAction(() => changeUserRoleAction(user.id, e.target.value))
                      }
                      disabled={isPending}
                    >
                      <option value="ATTENDEE">Attendee</option>
                      <option value="ORGANIZER">Organizer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!blockTarget}
        onOpenChange={(o) => !o && setBlockTarget(null)}
        title="Block User"
        description="This user will be unable to log in or perform any actions. You can unblock them later."
        confirmLabel="Block User"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => blockTarget && handleAction(() => blockUserAction(blockTarget))}
      />
    </>
  );
}
