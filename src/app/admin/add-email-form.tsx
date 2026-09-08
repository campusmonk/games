"use client";

import { useActionState } from "react";
import { Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { addBulkEmailsAction, addEmailAction, type AdminActionState, uploadCsvEmailsAction } from "./actions";

export default function AddEmailForm() {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(addEmailAction, {});
  const [bulkState, bulkAction, bulkPending] = useActionState<AdminActionState, FormData>(addBulkEmailsAction, {});
  const [csvState, csvAction, csvPending] = useActionState<AdminActionState, FormData>(uploadCsvEmailsAction, {});

  return (
    <div className="grid gap-6">
      <form action={action} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-card-foreground/80">
            Add Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="border-input bg-background text-foreground"
            placeholder="student@example.com"
          />
          {state.message ? <p className="text-sm text-muted-foreground">{state.message}</p> : null}
        </div>

        <Button disabled={pending} type="submit" className="gap-2">
          <Plus className="size-4" />
          {pending ? "Adding" : "Add"}
        </Button>
      </form>

      <form action={bulkAction} className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="emails" className="text-card-foreground/80">
            Add Bulk Emails
          </Label>
          <Textarea
            id="emails"
            name="emails"
            required
            rows={5}
            className="min-h-28 resize-y border-input bg-background text-foreground"
            placeholder={"student1@example.com\nstudent2@example.com\nstudent3@example.com"}
          />
          {bulkState.message ? <p className="text-sm text-muted-foreground">{bulkState.message}</p> : null}
        </div>

        <Button disabled={bulkPending} type="submit" className="w-fit gap-2">
          <Plus className="size-4" />
          {bulkPending ? "Adding Emails" : "Add Bulk"}
        </Button>
      </form>

      <form action={csvAction} encType="multipart/form-data" className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="csv" className="text-card-foreground/80">
            Upload CSV
          </Label>
          <Input
            id="csv"
            name="csv"
            type="file"
            accept=".csv,text/csv"
            required
            className="border-input bg-background text-foreground"
          />
          {csvState.message ? <p className="text-sm text-muted-foreground">{csvState.message}</p> : null}
        </div>

        <Button disabled={csvPending} type="submit" className="w-fit gap-2">
          <Upload className="size-4" />
          {csvPending ? "Uploading CSV" : "Upload CSV"}
        </Button>
      </form>
    </div>
  );
}
