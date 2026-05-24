"use client";

import * as React from "react";
import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/app/admin/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = { ok: false };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-lg border border-ink/10 bg-beige p-6 shadow-sm"
    >
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
        />
      </div>
      {state.error && (
        <p className="text-xs text-terracotta-dark" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Connexion…" : "Entrer"}
      </Button>
    </form>
  );
}
