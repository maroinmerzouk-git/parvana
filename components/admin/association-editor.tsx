"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAssociationSettings } from "@/app/admin/actions";
import type { AssociationSettings } from "@/lib/association";

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function AssociationEditor({
  initial,
}: {
  initial: AssociationSettings;
}) {
  const [showDates, setShowDates] = React.useState(initial.ateliers.showDates);
  const [startDate, setStartDate] = React.useState(initial.ateliers.startDate);
  const [endDate, setEndDate] = React.useState(initial.ateliers.endDate);
  const [state, setState] = React.useState<SaveState>({ kind: "idle" });

  const dirty = () => {
    if (state.kind !== "idle") setState({ kind: "idle" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showDates && startDate && endDate && startDate > endDate) {
      setState({
        kind: "error",
        message: "La date de début doit précéder la date de fin.",
      });
      return;
    }

    setState({ kind: "saving" });
    const result = await saveAssociationSettings({
      ateliers: { showDates, startDate, endDate },
    });
    setState(
      result.ok
        ? { kind: "success" }
        : { kind: "error", message: result.error },
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset className="rounded-lg border border-ink/15 bg-sand/40 p-4 md:p-6">
        <legend className="px-2 font-display text-2xl italic text-ink">
          Les ateliers
        </legend>

        <label className="mt-2 flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={showDates}
            onChange={(e) => {
              setShowDates(e.target.checked);
              dirty();
            }}
            className="h-4 w-4 accent-terracotta"
          />
          Afficher les dates sur le site
        </label>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ateliers-start">Date de début</Label>
            <Input
              id="ateliers-start"
              type="date"
              value={startDate}
              disabled={!showDates}
              onChange={(e) => {
                setStartDate(e.target.value);
                dirty();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ateliers-end">Date de fin</Label>
            <Input
              id="ateliers-end"
              type="date"
              value={endDate}
              disabled={!showDates}
              onChange={(e) => {
                setEndDate(e.target.value);
                dirty();
              }}
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-ink-soft">
          Décochez «&nbsp;Afficher les dates&nbsp;» pour masquer toute période
          sur la page Association. Vous pouvez ne renseigner qu&apos;une seule
          des deux dates.
        </p>
      </fieldset>

      {state.kind === "error" && (
        <div className="rounded-md border border-terracotta-dark/30 bg-terracotta/5 p-4 text-sm text-terracotta-dark">
          {state.message}
        </div>
      )}
      {state.kind === "success" && (
        <div className="rounded-md border border-emerald-700/30 bg-emerald-50 p-4 text-sm text-emerald-900">
          Réglages enregistrés — la page Association est à jour.
        </div>
      )}

      <div className="flex justify-end border-t border-ink/10 pt-4">
        <Button type="submit" size="sm" disabled={state.kind === "saving"}>
          {state.kind === "saving" ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
