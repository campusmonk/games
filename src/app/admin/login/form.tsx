"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAdmin, type AdminActionState } from "../actions";

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(loginAdmin, {});

  return (
    <form action={action} className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-pop-lg">
      <div className="grid gap-2">
        <Label htmlFor="password" className="text-card-foreground/80">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="border-input bg-background text-foreground"
        />
      </div>

      {state.message ? (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <Button disabled={pending} type="submit" className="mt-5 w-full" variant="pixel" size="lg">
        {pending ? "Checking..." : "Login"}
      </Button>
    </form>
  );
}
