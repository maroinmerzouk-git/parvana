"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { saveMenu } from "@/app/admin/actions";
import {
  menuTagSchema,
  effectiveMenuMode,
  EMPTY_MENU_SERVICE,
} from "@/lib/schemas/menu";
import type { Menu, MenuService, MenuTag, MenuMode } from "@/lib/menu";

type Mode = MenuMode;

const TAGS = menuTagSchema.options;

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; version: number }
  | { kind: "error"; message: string; details?: unknown };

/** Build the payload for one service, keeping only the fields the mode uses. */
function normalize(service: MenuService, mode: Mode): MenuService {
  const base = { active: service.active, mode, intro: "", formule: "", categories: [] };
  if (mode === "formule") {
    return { ...base, formule: service.formule ?? "" };
  }
  if (mode === "texte") {
    return { ...base, text: service.text ?? "" };
  }
  return {
    ...base,
    mode: "carte",
    intro: service.intro,
    formule: service.formule ?? "",
    categories: service.categories,
  };
}

export function MenuEditor({
  initialMenu,
  initialVersion,
  source,
}: {
  initialMenu: Menu;
  initialVersion: number | null;
  source: "db" | "fallback";
}) {
  const initialBoissons = initialMenu.boissons ?? EMPTY_MENU_SERVICE;
  const [midi, setMidi] = React.useState<MenuService>(initialMenu.midi);
  const [soir, setSoir] = React.useState<MenuService>(initialMenu.soir);
  const [boissons, setBoissons] = React.useState<MenuService>(initialBoissons);
  const [midiMode, setMidiMode] = React.useState<Mode>(effectiveMenuMode(initialMenu.midi));
  const [soirMode, setSoirMode] = React.useState<Mode>(effectiveMenuMode(initialMenu.soir));
  const [state, setState] = React.useState<SaveState>({ kind: "idle" });

  const dirty = () => {
    if (state.kind !== "idle") setState({ kind: "idle" });
  };

  const reset = () => {
    setMidi(initialMenu.midi);
    setSoir(initialMenu.soir);
    setBoissons(initialBoissons);
    setMidiMode(effectiveMenuMode(initialMenu.midi));
    setSoirMode(effectiveMenuMode(initialMenu.soir));
    setState({ kind: "idle" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Un service actif doit avoir le contenu de son mode.
    for (const [svc, mode, label] of [
      [midi, midiMode, "midi"],
      [soir, soirMode, "soir"],
    ] as const) {
      if (!svc.active) continue;
      if (mode === "formule" && !(svc.formule ?? "").trim()) {
        setState({
          kind: "error",
          message: `Le menu ${label} est actif en « formule seule » : indiquez l'intitulé de la formule.`,
        });
        return;
      }
      if (mode === "texte" && !(svc.text ?? "").trim()) {
        setState({
          kind: "error",
          message: `Le menu ${label} est actif en « texte simple » : saisissez le contenu.`,
        });
        return;
      }
    }

    // La carte des boissons est en texte libre uniquement.
    if (boissons.active && !(boissons.text ?? "").trim()) {
      setState({
        kind: "error",
        message: "La carte des boissons est active : saisissez les boissons.",
      });
      return;
    }

    setState({ kind: "saving" });
    const menu: Menu = {
      midi: normalize(midi, midiMode),
      soir: normalize(soir, soirMode),
      boissons: normalize(boissons, "texte"),
    };
    const result = await saveMenu(JSON.stringify(menu));
    if (result.ok) {
      setState({ kind: "success", version: result.version });
    } else {
      setState({
        kind: "error",
        message: result.error,
        details: result.details,
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
        {source === "db" ? (
          <>
            Version actuelle&nbsp;:{" "}
            <strong className="text-ink">v{initialVersion}</strong>
          </>
        ) : (
          "Pas encore de version en base — valeurs par défaut affichées"
        )}
      </p>

      <ServiceEditor
        label="Menu midi"
        idPrefix="midi"
        value={midi}
        mode={midiMode}
        onChange={(next) => {
          setMidi(next);
          dirty();
        }}
        onModeChange={(m) => {
          setMidiMode(m);
          dirty();
        }}
      />

      <ServiceEditor
        label="Menu soir"
        idPrefix="soir"
        value={soir}
        mode={soirMode}
        onChange={(next) => {
          setSoir(next);
          dirty();
        }}
        onModeChange={(m) => {
          setSoirMode(m);
          dirty();
        }}
      />

      <fieldset className="rounded-lg border border-ink/15 bg-sand/40 p-4 md:p-6">
        <legend className="px-2 font-display text-2xl italic text-ink">
          Carte des boissons
        </legend>

        <label className="mt-2 flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={boissons.active}
            onChange={(e) => {
              setBoissons({ ...boissons, active: e.target.checked });
              dirty();
            }}
            className="h-4 w-4 accent-terracotta"
          />
          Section active (visible sur le site)
        </label>

        <div className="mt-6 space-y-2 border-t border-ink/10 pt-6">
          <Label htmlFor="boissons-text">Boissons (texte libre)</Label>
          <Textarea
            id="boissons-text"
            value={boissons.text ?? ""}
            onChange={(e) => {
              setBoissons({ ...boissons, text: e.target.value });
              dirty();
            }}
            className="min-h-[280px] font-mono text-sm leading-relaxed"
            maxLength={5000}
            placeholder={"Cocktails\n- Lahla — grenade, framboise, citron, menthe — 8€\n- Rosea — pêche, fraise, lavande — 8€\n\nLimonades maison\n- Citron, fraise — 5€\n\nBoissons chaudes\n- Thé vert cardamome — 3,50€"}
          />
          <p className="text-xs text-ink-soft">
            La carte des boissons s&apos;écrit en texte libre. La mise en forme
            (sauts de ligne) est conservée telle quelle sur le site.
          </p>
        </div>
      </fieldset>

      {state.kind === "error" && (
        <div className="rounded-md border border-terracotta-dark/30 bg-terracotta/5 p-4 text-sm text-terracotta-dark">
          <p className="font-medium">{state.message}</p>
          {state.details ? (
            <pre className="mt-2 max-h-48 overflow-auto rounded bg-beige p-2 text-xs text-ink">
              {JSON.stringify(state.details, null, 2)}
            </pre>
          ) : null}
        </div>
      )}

      {state.kind === "success" && (
        <div className="rounded-md border border-emerald-700/30 bg-emerald-50 p-4 text-sm text-emerald-900">
          Menu publié — version v{state.version} en ligne.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
        <p className="text-xs text-ink-soft">
          Chaque sauvegarde crée une nouvelle version. Aucune version
          précédente n&apos;est écrasée.
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={state.kind === "saving"}
          >
            Réinitialiser
          </Button>
          <Button type="submit" size="sm" disabled={state.kind === "saving"}>
            {state.kind === "saving" ? "Publication…" : "Valider et publier"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function ServiceEditor({
  label,
  idPrefix,
  value,
  mode,
  onChange,
  onModeChange,
}: {
  label: string;
  idPrefix: string;
  value: MenuService;
  mode: Mode;
  onChange: (next: MenuService) => void;
  onModeChange: (m: Mode) => void;
}) {
  const set = (patch: Partial<MenuService>) => onChange({ ...value, ...patch });

  const setCategory = (index: number, patch: Partial<MenuService["categories"][number]>) =>
    set({
      categories: value.categories.map((c, i) =>
        i === index ? { ...c, ...patch } : c,
      ),
    });

  const setItem = (
    catIndex: number,
    itemIndex: number,
    patch: Partial<MenuService["categories"][number]["items"][number]>,
  ) =>
    setCategory(catIndex, {
      items: value.categories[catIndex].items.map((it, i) =>
        i === itemIndex ? { ...it, ...patch } : it,
      ),
    });

  const toggleTag = (catIndex: number, itemIndex: number, tag: MenuTag) => {
    const current = value.categories[catIndex].items[itemIndex].tags ?? [];
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setItem(catIndex, itemIndex, { tags: next });
  };

  return (
    <fieldset className="rounded-lg border border-ink/15 bg-sand/40 p-4 md:p-6">
      <legend className="px-2 font-display text-2xl italic text-ink">
        {label}
      </legend>

      <label className="mt-2 flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={value.active}
          onChange={(e) => set({ active: e.target.checked })}
          className="h-4 w-4 accent-terracotta"
        />
        Service actif (visible sur le site)
      </label>

      <div className="mt-5">
        <Label className="mb-2 block">Type de menu</Label>
        <RadioGroup
          value={mode}
          onValueChange={(v) => onModeChange(v as Mode)}
          className="flex flex-wrap gap-x-6 gap-y-2"
        >
          <label className="flex items-center gap-2 text-sm text-ink">
            <RadioGroupItem value="formule" />
            Formule seule (intitulé uniquement)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <RadioGroupItem value="carte" />
            Carte complète
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <RadioGroupItem value="texte" />
            Texte simple
          </label>
        </RadioGroup>
      </div>

      {mode !== "texte" && (
        <div className="mt-5 space-y-2">
          <Label htmlFor={`${idPrefix}-formule`}>Intitulé de la formule</Label>
          <Input
            id={`${idPrefix}-formule`}
            value={value.formule ?? ""}
            onChange={(e) => set({ formule: e.target.value })}
            placeholder="Ex. : Formule entrée + plat ou plat + dessert — 15,50€"
            maxLength={200}
          />
        </div>
      )}

      {mode === "texte" && (
        <div className="mt-6 space-y-2 border-t border-ink/10 pt-6">
          <Label htmlFor={`${idPrefix}-text`}>Menu (texte libre)</Label>
          <Textarea
            id={`${idPrefix}-text`}
            value={value.text ?? ""}
            onChange={(e) => set({ text: e.target.value })}
            className="min-h-[280px] font-mono text-sm leading-relaxed"
            maxLength={5000}
            placeholder={"Entrées\n- Borani Banjan\n- Shorwa\n\nPlats\n- Kabuli Pulao\n\nBoissons\n- Thé vert cardamome"}
          />
          <p className="text-xs text-ink-soft">
            Saisissez tout le menu (plats et boissons). La mise en forme (sauts
            de ligne) est conservée telle quelle sur le site.
          </p>
        </div>
      )}

      {mode === "carte" && (
        <div className="mt-6 space-y-6 border-t border-ink/10 pt-6">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-intro`}>Texte de présentation</Label>
            <Textarea
              id={`${idPrefix}-intro`}
              value={value.intro}
              onChange={(e) => set({ intro: e.target.value })}
              className="min-h-[90px]"
              maxLength={800}
              placeholder="Quelques mots d'introduction au service…"
            />
          </div>

          {value.categories.map((cat, ci) => (
            <div
              key={ci}
              className="rounded-md border border-ink/10 bg-beige/60 p-4"
            >
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${idPrefix}-cat-${ci}`}>Catégorie</Label>
                  <Input
                    id={`${idPrefix}-cat-${ci}`}
                    value={cat.title}
                    onChange={(e) => setCategory(ci, { title: e.target.value })}
                    placeholder="Entrées, Plats, Desserts…"
                    maxLength={60}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    set({
                      categories: value.categories.filter((_, i) => i !== ci),
                    })
                  }
                >
                  Supprimer
                </Button>
              </div>

              <div className="mt-4 space-y-4">
                {cat.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="space-y-3 rounded border border-ink/10 bg-sand/60 p-3"
                  >
                    <div className="flex items-end gap-3">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={`${idPrefix}-${ci}-${ii}-name`}>
                          Nom du plat
                        </Label>
                        <Input
                          id={`${idPrefix}-${ci}-${ii}-name`}
                          value={item.name}
                          onChange={(e) =>
                            setItem(ci, ii, { name: e.target.value })
                          }
                          maxLength={120}
                        />
                      </div>
                      <div className="w-28 space-y-1">
                        <Label htmlFor={`${idPrefix}-${ci}-${ii}-price`}>
                          Prix
                        </Label>
                        <Input
                          id={`${idPrefix}-${ci}-${ii}-price`}
                          value={item.price ?? ""}
                          onChange={(e) =>
                            setItem(ci, ii, { price: e.target.value })
                          }
                          placeholder="6€"
                          maxLength={20}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCategory(ci, {
                            items: cat.items.filter((_, i) => i !== ii),
                          })
                        }
                      >
                        ✕
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`${idPrefix}-${ci}-${ii}-desc`}>
                        Description
                      </Label>
                      <Textarea
                        id={`${idPrefix}-${ci}-${ii}-desc`}
                        value={item.description}
                        onChange={(e) =>
                          setItem(ci, ii, { description: e.target.value })
                        }
                        className="min-h-[60px]"
                        maxLength={500}
                      />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {TAGS.map((tag) => (
                        <label
                          key={tag}
                          className="flex items-center gap-1.5 text-xs text-ink-soft"
                        >
                          <input
                            type="checkbox"
                            checked={item.tags?.includes(tag) ?? false}
                            onChange={() => toggleTag(ci, ii, tag)}
                            className="h-3.5 w-3.5 accent-terracotta"
                          />
                          {tag}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCategory(ci, {
                      items: [
                        ...cat.items,
                        { name: "", description: "", price: "", tags: [] },
                      ],
                    })
                  }
                >
                  + Ajouter un plat
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              set({
                categories: [
                  ...value.categories,
                  { title: "", items: [] },
                ],
              })
            }
          >
            + Ajouter une catégorie
          </Button>
        </div>
      )}
    </fieldset>
  );
}
