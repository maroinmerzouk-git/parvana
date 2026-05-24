"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  cateringSchema,
  EVENT_TYPES,
  eventTypeLabels,
  type CateringInput,
} from "@/lib/schemas/catering";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type SubmissionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; name: string }
  | { kind: "error"; message: string };

const PARTY_SIZE_OPTIONS = [10, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300, 500];

export function CateringForm() {
  const [state, setState] = React.useState<SubmissionState>({ kind: "idle" });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CateringInput>({
    resolver: zodResolver(cateringSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventDate: "",
      eventType: "mariage",
      partySize: 30,
      budget: "",
      message: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: CateringInput) => {
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setState({
          kind: "error",
          message:
            body.error ??
            "Une erreur est survenue. Réessayez ou appelez-nous au 06 22 64 32 53.",
        });
        return;
      }
      setState({ kind: "success", name: values.name });
      reset();
    } catch {
      setState({
        kind: "error",
        message:
          "Connexion impossible. Réessayez ou appelez-nous au 06 22 64 32 53.",
      });
    }
  };

  if (state.kind === "success") {
    return (
      <div className="rounded-lg border border-terracotta/30 bg-sand p-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
          Demande envoyée
        </p>
        <h2 className="mt-4 font-display text-3xl italic text-ink">
          Merci{state.name ? `, ${state.name.split(" ")[0]}` : ""}.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          Nous avons reçu votre demande traiteur. Maryam vous répondra par email
          sous 2 à 3 jours ouvrés pour échanger sur votre événement.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => setState({ kind: "idle" })}
        >
          Faire une autre demande
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Event type */}
      <div className="space-y-2">
        <Label htmlFor="eventType">Type d&apos;événement</Label>
        <Controller
          control={control}
          name="eventType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="eventType" className="sm:max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {eventTypeLabels[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.eventType && (
          <FieldError>{errors.eventType.message}</FieldError>
        )}
      </div>

      {/* Date + Party size */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Date de l&apos;événement</Label>
          <Controller
            control={control}
            name="eventDate"
            render={({ field }) => {
              const selected = field.value ? new Date(field.value) : undefined;
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      id="eventDate"
                      type="button"
                      className={cn(
                        "flex h-11 w-full items-center justify-between rounded-md border border-ink/20 bg-beige px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:border-terracotta focus-visible:ring-2 focus-visible:ring-terracotta/30",
                        !selected && "text-ink-soft/60",
                      )}
                    >
                      {selected
                        ? format(selected, "EEEE d MMMM yyyy", { locale: fr })
                        : "Choisir une date"}
                      <CalendarIcon className="h-4 w-4 opacity-60" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={selected}
                      onSelect={(d) => {
                        if (d) field.onChange(format(d, "yyyy-MM-dd"));
                      }}
                      disabled={[{ before: new Date() }]}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
          {errors.eventDate && (
            <FieldError>{errors.eventDate.message}</FieldError>
          )}
          <p className="text-xs text-ink-soft/80">
            Prévoir idéalement 2 à 3 semaines de délai.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="partySize">Nombre de convives</Label>
          <Controller
            control={control}
            name="partySize"
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger id="partySize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PARTY_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n === 500 ? "500 et +" : `~ ${n} personnes`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.partySize && (
            <FieldError>{errors.partySize.message}</FieldError>
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" {...register("name")} autoComplete="name" />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            autoComplete="email"
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            autoComplete="tel"
            placeholder="06 12 34 56 78"
          />
          {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget indicatif (optionnel)</Label>
        <Input
          id="budget"
          {...register("budget")}
          placeholder="Ex : 25 € / personne, ou enveloppe globale"
        />
        {errors.budget && <FieldError>{errors.budget.message}</FieldError>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Précisions (optionnel)</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Allergies, type de prestation souhaitée (buffet, plats à partager, service à table), contraintes de lieu…"
          rows={5}
        />
        {errors.message && <FieldError>{errors.message.message}</FieldError>}
      </div>

      {state.kind === "error" && (
        <div className="rounded-md border border-terracotta-dark/30 bg-terracotta/5 p-4 text-sm text-terracotta-dark">
          {state.message}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-soft/80">
          Maryam vous répondra personnellement par email sous 2 à 3 jours
          ouvrés.
        </p>
        <Button type="submit" size="lg" disabled={state.kind === "submitting"}>
          {state.kind === "submitting"
            ? "Envoi en cours…"
            : "Envoyer la demande"}
        </Button>
      </div>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-terracotta-dark" role="alert">
      {children}
    </p>
  );
}
