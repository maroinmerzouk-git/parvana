"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { archiveOrder, markOrderSeen } from "@/app/admin/actions";

export function OrderActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {status === "new" && (
        <Button
          size="sm"
          onClick={() =>
            startTransition(async () => {
              await markOrderSeen(id);
            })
          }
          disabled={pending}
        >
          {pending ? "…" : "Marquer comme vue"}
        </Button>
      )}
      {status !== "archived" && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            startTransition(async () => {
              await archiveOrder(id);
            })
          }
          disabled={pending}
        >
          Archiver
        </Button>
      )}
    </div>
  );
}
