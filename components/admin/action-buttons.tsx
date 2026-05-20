"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { RejectDialog } from "./reject-dialog";
import { confirmReservation, markSeen } from "@/app/admin/actions";

export function ActionButtons({
  id,
  status,
  unread,
}: {
  id: string;
  status: string;
  unread: boolean;
}) {
  const [pending, startTransition] = React.useTransition();

  if (status === "pending") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() =>
            startTransition(async () => {
              await confirmReservation(id);
            })
          }
          disabled={pending}
        >
          {pending ? "…" : "Confirmer"}
        </Button>
        <RejectDialog id={id} />
        {unread && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              startTransition(async () => {
                await markSeen(id);
              })
            }
            disabled={pending}
          >
            Marquer comme vu
          </Button>
        )}
      </div>
    );
  }

  return null;
}
