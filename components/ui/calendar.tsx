"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={fr}
      className={cn("p-2 text-ink", className)}
      classNames={{
        root: "text-ink",
        months: "flex flex-col gap-3",
        month: "space-y-3",
        month_caption:
          "flex items-center justify-center h-9 capitalize font-display text-sm",
        caption_label: "capitalize font-display text-sm text-ink",
        nav: "absolute inset-x-1 top-2 flex items-center justify-between pointer-events-none",
        button_previous:
          "h-7 w-7 pointer-events-auto inline-flex items-center justify-center rounded-md border border-ink/15 bg-beige hover:bg-sand transition-colors",
        button_next:
          "h-7 w-7 pointer-events-auto inline-flex items-center justify-center rounded-md border border-ink/15 bg-beige hover:bg-sand transition-colors",
        chevron: "h-4 w-4 fill-ink",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-ink-soft w-9 text-[10px] uppercase tracking-[0.12em] font-medium pb-1",
        week: "flex w-full mt-1",
        day: "h-9 w-9 text-center text-sm p-0 relative",
        day_button:
          "h-9 w-9 rounded-md inline-flex items-center justify-center font-normal text-ink hover:bg-sand transition-colors aria-selected:bg-terracotta aria-selected:text-beige aria-selected:hover:bg-terracotta-dark disabled:text-ink-soft/30 disabled:line-through disabled:cursor-not-allowed disabled:hover:bg-transparent",
        today: "font-medium",
        outside: "text-ink-soft/40",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4 text-ink", className)} />
          ) : (
            <ChevronRight className={cn("h-4 w-4 text-ink", className)} />
          ),
      }}
      {...props}
    />
  );
}
