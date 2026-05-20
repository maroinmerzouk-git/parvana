"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveMenu } from "@/app/admin/actions";

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; version: number }
  | { kind: "error"; message: string; details?: unknown };

export function MenuEditor({
  initialJson,
  initialVersion,
  source,
}: {
  initialJson: string;
  initialVersion: number | null;
  source: "db" | "fallback";
}) {
  const [json, setJson] = React.useState(initialJson);
  const [state, setState] = React.useState<SaveState>({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ kind: "saving" });
    const result = await saveMenu(json);
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-ink-soft">
        <span>
          {source === "db" ? (
            <>Version actuelle&nbsp;: <strong className="text-ink">v{initialVersion}</strong></>
          ) : (
            "Pas encore de version en base — affichage du JSON par défaut"
          )}
        </span>
      </div>

      <Textarea
        value={json}
        onChange={(e) => {
          setJson(e.target.value);
          if (state.kind !== "idle") setState({ kind: "idle" });
        }}
        className="min-h-[480px] font-mono text-xs leading-relaxed"
        spellCheck={false}
        aria-label="Contenu JSON du menu"
      />

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
            onClick={() => setJson(initialJson)}
            disabled={json === initialJson || state.kind === "saving"}
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
