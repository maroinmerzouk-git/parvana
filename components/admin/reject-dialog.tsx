"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { rejectReservation } from "@/app/admin/actions";

export function RejectDialog({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Refuser
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(360px,calc(100vw-2rem))]"
      >
        <form
          ref={formRef}
          action={(formData) => {
            startTransition(async () => {
              await rejectReservation(formData);
              setOpen(false);
            });
          }}
          className="space-y-3"
        >
          <input type="hidden" name="id" value={id} />
          <div>
            <Label htmlFor={`reject-msg-${id}`}>
              Message au client (optionnel)
            </Label>
            <Textarea
              id={`reject-msg-${id}`}
              name="message"
              placeholder="Service complet ce jour-là, ou autre raison. Ce texte sera inclus dans l'email envoyé au client."
              rows={4}
              maxLength={500}
              className="mt-2"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={pending}
            >
              {pending ? "Envoi…" : "Confirmer le refus"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
