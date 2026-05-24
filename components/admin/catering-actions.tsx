"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  archiveCateringRequest,
  markCateringSeen,
} from "@/app/admin/actions";

export function CateringActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {status === "new" && (
        <Button
          size="sm"
          onClick={() =>
            startTransition(async () => {
              await markCateringSeen(id);
            })
          }
          disabled={pending}
        >
          {pending ? "…" : "Marquer comme vu"}
        </Button>
      )}
      {status !== "archived" && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            startTransition(async () => {
              await archiveCateringRequest(id);
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
