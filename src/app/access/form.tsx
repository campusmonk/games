"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { requestAccess, type AccessState } from "./actions";

type Props = {
  next: string;
};

export default function AccessForm({ next }: Props) {
  const [state, action, pending] = useActionState<AccessState, FormData>(requestAccess, {});

  return (
    <form action={action} className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-pop-lg">
      <input name="next" type="hidden" value={next} />

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-card-foreground/80">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="border-input bg-background text-foreground"
          placeholder="student@example.com"
        />
      </div>

      {state.message ? (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <Button disabled={pending} type="submit" className="mt-5 w-full" variant="pixel" size="lg">
        {pending ? "Checking..." : "Continue"}
      </Button>
    </form>
  );
}
