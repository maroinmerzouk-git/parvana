"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveOpeningHours } from "@/app/admin/actions";
import {
  DAY_KEYS,
  DAY_LABELS_FR,
  type DayKey,
  type OpeningHours,
  type DayHours,
  type ServiceRange,
} from "@/lib/schemas/hours";

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success" }
  | { kind: "error"; message: string };

// Clone profond pour ne jamais muter l'état initial.
function cloneHours(h: OpeningHours): OpeningHours {
  return {
    note: h.note ?? "",
    days: DAY_KEYS.reduce((acc, key) => {
      const d = h.days[key];
      acc[key] = { closed: d.closed, ranges: d.ranges.map((r) => ({ ...r })) };
      return acc;
    }, {} as Record<DayKey, DayHours>),
  };
}

const emptyRange: ServiceRange = { start: "12:00", end: "14:30", label: "" };

export function HoursEditor({ initial }: { initial: OpeningHours }) {
  const [hours, setHours] = React.useState<OpeningHours>(() =>
    cloneHours(initial),
  );
  const [state, setState] = React.useState<SaveState>({ kind: "idle" });

  // Toute modification efface le bandeau de statut précédent.
  const mutate = (fn: (draft: OpeningHours) => void) => {
    setHours((prev) => {
      const next = cloneHours(prev);
      fn(next);
      return next;
    });
    setState((s) => (s.kind === "idle" ? s : { kind: "idle" }));
  };

  const toggleClosed = (key: DayKey, closed: boolean) =>
    mutate((d) => {
      d.days[key].closed = closed;
      // Première ouverture d'un jour vide : proposer une plage par défaut.
      if (!closed && d.days[key].ranges.length === 0) {
        d.days[key].ranges.push({ ...emptyRange });
      }
    });

  const addRange = (key: DayKey) =>
    mutate((d) => {
      d.days[key].ranges.push({ ...emptyRange });
    });

  const removeRange = (key: DayKey, i: number) =>
    mutate((d) => {
      d.days[key].ranges.splice(i, 1);
    });

  const updateRange = (
    key: DayKey,
    i: number,
    field: keyof ServiceRange,
    value: string,
  ) =>
    mutate((d) => {
      d.days[key].ranges[i] = { ...d.days[key].ranges[i], [field]: value };
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation locale : fin après début pour chaque plage.
    for (const key of DAY_KEYS) {
      const day = hours.days[key];
      if (day.closed) continue;
      for (const r of day.ranges) {
        if (r.start >= r.end) {
          setState({
            kind: "error",
            message: `${DAY_LABELS_FR[key]} : l'heure de fin doit suivre l'heure de début.`,
          });
          return;
        }
      }
    }

    setState({ kind: "saving" });
    const result = await saveOpeningHours(hours);
    setState(
      result.ok ? { kind: "success" } : { kind: "error", message: result.error },
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {DAY_KEYS.map((key) => {
          const day = hours.days[key];
          return (
            <fieldset
              key={key}
              className="rounded-lg border border-ink/15 bg-sand/40 p-4 md:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <legend className="font-display text-xl italic text-ink">
                  {DAY_LABELS_FR[key]}
                </legend>
                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={day.closed}
                    onChange={(e) => toggleClosed(key, e.target.checked)}
                    className="h-4 w-4 accent-terracotta"
                  />
                  Fermé
                </label>
              </div>

              {!day.closed && (
                <div className="mt-4 space-y-3">
                  {day.ranges.length === 0 && (
                    <p className="text-sm text-ink-soft">
                      Aucune plage — ajoutez un service ci-dessous.
                    </p>
                  )}

                  {day.ranges.map((r, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[1fr_1fr_1.4fr_auto]"
                    >
                      <div className="space-y-1.5">
                        <Label htmlFor={`${key}-${i}-start`}>Ouverture</Label>
                        <Input
                          id={`${key}-${i}-start`}
                          type="time"
                          value={r.start}
                          onChange={(e) =>
                            updateRange(key, i, "start", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`${key}-${i}-end`}>Fermeture</Label>
                        <Input
                          id={`${key}-${i}-end`}
                          type="time"
                          value={r.end}
                          onChange={(e) =>
                            updateRange(key, i, "end", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`${key}-${i}-label`}>
                          Libellé (optionnel)
                        </Label>
                        <Input
                          id={`${key}-${i}-label`}
                          type="text"
                          placeholder="ex : brunch"
                          maxLength={40}
                          value={r.label ?? ""}
                          onChange={(e) =>
                            updateRange(key, i, "label", e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRange(key, i)}
                        aria-label={`Supprimer la plage ${i + 1} du ${DAY_LABELS_FR[key]}`}
                        className="text-ink-soft hover:text-terracotta"
                      >
                        Retirer
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRange(key)}
                  >
                    + Ajouter une plage
                  </Button>
                </div>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours-note">Note affichée sous les horaires</Label>
        <Input
          id="hours-note"
          type="text"
          maxLength={300}
          placeholder="ex : Service du soir du mardi au vendredi. Brunch le week-end."
          value={hours.note ?? ""}
          onChange={(e) => mutate((d) => void (d.note = e.target.value))}
        />
      </div>

      {state.kind === "error" && (
        <div className="rounded-md border border-terracotta-dark/30 bg-terracotta/5 p-4 text-sm text-terracotta-dark">
          {state.message}
        </div>
      )}
      {state.kind === "success" && (
        <div className="rounded-md border border-emerald-700/30 bg-emerald-50 p-4 text-sm text-emerald-900">
          Horaires enregistrés — la page Contact est à jour.
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
