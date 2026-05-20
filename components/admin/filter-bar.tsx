"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type FilterGroup = {
  param: string;
  label: string;
  options: Array<{ value: string; label: string }>;
};

const groups: FilterGroup[] = [
  {
    param: "status",
    label: "Statut",
    options: [
      { value: "", label: "Tous" },
      { value: "pending", label: "En attente" },
      { value: "confirmed", label: "Confirmées" },
      { value: "rejected", label: "Refusées" },
    ],
  },
  {
    param: "service",
    label: "Service",
    options: [
      { value: "", label: "Tous" },
      { value: "midi", label: "Déjeuner" },
      { value: "soir", label: "Dîner" },
    ],
  },
  {
    param: "when",
    label: "Période",
    options: [
      { value: "", label: "Toutes" },
      { value: "upcoming", label: "À venir" },
      { value: "past", label: "Passées" },
    ],
  },
];

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (param: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(param, value);
    else next.delete(param);
    router.replace(`?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const current = params.get(group.param) ?? "";
        return (
          <div key={group.param} className="flex flex-wrap items-center gap-2">
            <span className="w-20 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
              {group.label}
            </span>
            {group.options.map((opt) => {
              const active = current === opt.value;
              return (
                <button
                  key={opt.value || "all"}
                  type="button"
                  onClick={() => setParam(group.param, opt.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] transition-colors",
                    active
                      ? "border-terracotta bg-terracotta text-beige"
                      : "border-ink/20 bg-beige text-ink hover:border-ink/40",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
