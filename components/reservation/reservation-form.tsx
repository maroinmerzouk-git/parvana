"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  reservationSchema,
  type ReservationInput,
} from "@/lib/schemas/reservation";
import {
  reservationDayOptions,
  reservationHoursError,
  closedDaysOfWeek,
  type OpeningHours,
  type ReservationService,
} from "@/lib/hours";
import { DAY_KEYS, DAY_LABELS_FR } from "@/lib/schemas/hours";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export function ReservationForm({ hours }: { hours: OpeningHours }) {
  const [state, setState] = React.useState<SubmissionState>({ kind: "idle" });

  // Jours fermés (fériés hebdomadaires) désactivés dans le calendrier.
  const closedDows = React.useMemo(() => closedDaysOfWeek(hours), [hours]);
  const closedLabel = React.useMemo(() => {
    const labels = DAY_KEYS.filter(
      (k) => hours.days[k].closed || hours.days[k].ranges.length === 0,
    ).map((k) => DAY_LABELS_FR[k].toLowerCase());
    if (labels.length === 0) return null;
    if (labels.length === 1) return `Le restaurant est fermé le ${labels[0]}.`;
    const last = labels[labels.length - 1];
    return `Le restaurant est fermé le ${labels
      .slice(0, -1)
      .join(", ")} et le ${last}.`;
  }, [hours]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      service: "midi",
      arrivalTime: "",
      partySize: 2,
      message: "",
    },
    mode: "onBlur",
  });

  const service = watch("service");
  const date = watch("date");
  const arrivalTime = watch("arrivalTime");

  // Créneaux et disponibilité des services dérivés de la date choisie et des
  // horaires d'ouverture (plus de créneaux en dur).
  const dayOptions = React.useMemo(
    () => (date ? reservationDayOptions(hours, date) : null),
    [hours, date],
  );
  const slots = dayOptions ? dayOptions[service].slots : [];

  // Si le service sélectionné n'est pas proposé ce jour-là, basculer vers
  // l'autre service quand il l'est.
  React.useEffect(() => {
    if (!dayOptions) return;
    if (!dayOptions[service].available) {
      const other: ReservationService = service === "midi" ? "soir" : "midi";
      if (dayOptions[other].available) setValue("service", other);
    }
  }, [dayOptions, service, setValue]);

  // Réinitialiser le créneau s'il n'existe plus dans la liste courante
  // (changement de date ou de service).
  React.useEffect(() => {
    if (arrivalTime && !slots.includes(arrivalTime)) {
      setValue("arrivalTime", "");
    }
  }, [arrivalTime, slots, setValue]);

  const onSubmit = async (values: ReservationInput) => {
    // Garde-fou : bloque une soumission incohérente avec les horaires même si
    // l'UI a été contournée (le serveur revérifie de toute façon).
    const hoursError = reservationHoursError(hours, values);
    if (hoursError) {
      setState({ kind: "error", message: hoursError });
      return;
    }
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
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
          Nous avons reçu votre demande. Maryam vous confirmera personnellement
          par email dans les prochaines heures. Tant que vous n&apos;avez pas
          reçu ce mail de confirmation, votre table n&apos;est pas garantie.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => setState({ kind: "idle" })}
        >
          Faire une autre réservation
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Service */}
      <fieldset className="space-y-3">
        <Label asChild>
          <legend>Service</legend>
        </Label>
        <Controller
          control={control}
          name="service"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-2 gap-3"
            >
              {(
                [
                  ["midi", "Déjeuner"],
                  ["soir", "Dîner"],
                ] as const
              ).map(([value, label]) => {
                const opt = dayOptions?.[value];
                // Avant de choisir une date, les deux services restent
                // sélectionnables ; ensuite, on désactive ce qui est fermé.
                const disabled = dayOptions ? !opt?.available : false;
                const sub = !date
                  ? "Choisissez d'abord une date"
                  : opt?.available
                    ? opt.rangeText
                    : "Non proposé ce jour-là";
                return (
                  <label
                    key={value}
                    htmlFor={`service-${value}`}
                    className={cn(
                      "flex items-start gap-3 rounded-md border bg-beige p-4 transition-colors",
                      disabled
                        ? "cursor-not-allowed border-ink/10 opacity-50"
                        : "cursor-pointer",
                      !disabled && field.value === value
                        ? "border-terracotta ring-1 ring-terracotta"
                        : !disabled && "border-ink/20 hover:border-ink/40",
                    )}
                  >
                    <RadioGroupItem
                      value={value}
                      id={`service-${value}`}
                      disabled={disabled}
                    />
                    <div>
                      <p className="font-display text-lg text-ink">{label}</p>
                      <p className="text-xs text-ink-soft">{sub}</p>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          )}
        />
        {errors.service && (
          <FieldError>{errors.service.message}</FieldError>
        )}
      </fieldset>

      {/* Date + arrivalTime */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Controller
            control={control}
            name="date"
            render={({ field }) => {
              const selected = field.value ? new Date(field.value) : undefined;
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      id="date"
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
                      disabled={[
                        { dayOfWeek: closedDows }, // jours fermés (horaires)
                        { before: new Date() },
                      ]}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
          {errors.date && <FieldError>{errors.date.message}</FieldError>}
          {closedLabel && (
            <p className="text-xs text-ink-soft/80">{closedLabel}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrivalTime">Heure d&apos;arrivée</Label>
          <Controller
            control={control}
            name="arrivalTime"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={slots.length === 0}
              >
                <SelectTrigger id="arrivalTime">
                  <SelectValue
                    placeholder={
                      !date
                        ? "Choisissez d'abord une date"
                        : slots.length === 0
                          ? "Aucun créneau ce jour-là"
                          : "Choisir un créneau"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {slots.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(":", "h")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.arrivalTime && (
            <FieldError>{errors.arrivalTime.message}</FieldError>
          )}
        </div>
      </div>

      {/* Party size */}
      <div className="space-y-2">
        <Label htmlFor="partySize">Nombre de personnes</Label>
        <Controller
          control={control}
          name="partySize"
          render={({ field }) => (
            <Select
              value={String(field.value)}
              onValueChange={(v) => field.onChange(Number(v))}
            >
              <SelectTrigger id="partySize" className="sm:max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n > 1 ? "personnes" : "personne"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.partySize && (
          <FieldError>{errors.partySize.message}</FieldError>
        )}
        <p className="text-xs text-ink-soft/80">
          Au-delà de 10 personnes :{" "}
          <a
            href="tel:+33622643253"
            className="text-terracotta hover:text-terracotta-dark"
          >
            06 22 64 32 53
          </a>
          .
        </p>
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
        <Label htmlFor="message">Message (optionnel)</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Allergies, occasion spéciale, demandes particulières…"
          rows={4}
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
          Votre demande est validée manuellement. Vous recevrez un email de
          confirmation de Maryam.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={state.kind === "submitting"}
        >
          {state.kind === "submitting"
            ? "Envoi en cours…"
            : "Envoyer la demande"}
        </Button>
      </div>

      <p className="text-xs text-ink-soft/70">
        Vos données (nom, email, téléphone) sont utilisées uniquement pour
        traiter votre réservation et ne sont jamais cédées à des tiers.{" "}
        <a
          href="/confidentialite"
          className="text-terracotta hover:text-terracotta-dark"
        >
          En savoir plus
        </a>
        .
      </p>
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
