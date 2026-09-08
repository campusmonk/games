import Link from "next/link";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllowedEmails, requireAdminAccess } from "@/lib/access/allowlist";
import { getGlobalDailyLimits } from "@/lib/access/daily-limits";
import { cn } from "@/lib/utils";

import { deleteEmailAction, logoutAdmin } from "./actions";
import AddEmailForm from "./add-email-form";
import LimitSettingsForms from "./limit-settings-forms";

export const metadata = {
  title: "Admin Panel",
  description: "Manage the allowed email list for cognitive games.",
};

const emailPageSize = 10;

function getEmailLimit(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed < emailPageSize) return emailPageSize;

  return Math.ceil(parsed / emailPageSize) * emailPageSize;
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdminAccess();

  const params = await searchParams;
  const emailLimit = getEmailLimit(params.emails);
  const { emails, total, demoEmail, storageMessage } = await getAllowedEmails({ limit: emailLimit });
  const limits = await getGlobalDailyLimits();
  const visibleCount = Math.min(emails.length, total);
  const nextEmailLimit = Math.min(emailLimit + emailPageSize, total);
  const hasMoreEmails = visibleCount < total;
  const canShowLessEmails = emailLimit > emailPageSize;

  return (
    <main className="min-h-screen bg-background px-4 pb-20 pt-28 text-foreground sm:px-8 lg:px-12">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-game text-2xl leading-none text-primary">Admin Panel</p>
            <h1 className="mt-3 font-game text-5xl leading-none text-foreground drop-shadow-pop-md">
              Allowed Users
            </h1>
          </div>

          <form action={logoutAdmin}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-pop-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Total Users</p>
            <p className="mt-3 font-game text-6xl leading-none text-primary">{total}</p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-md border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Games / day</p>
                <p className="mt-2 font-game text-3xl leading-none text-card-foreground">{limits.gamesPerDay ?? "Unlimited"}</p>
              </div>
              <div className="rounded-md border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Communication round / day</p>
                <p className="mt-2 font-game text-3xl leading-none text-card-foreground">
                  {limits.communicationPerDay ?? "Unlimited"}
                </p>
              </div>
              <div className="rounded-md border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Debug assessment / day</p>
                <p className="mt-2 font-game text-3xl leading-none text-card-foreground">
                  {limits.debugPerDay ?? "Unlimited"}
                </p>
              </div>
            </div>

            {demoEmail ? (
              <div className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Demo Email</p>
                <p className="mt-2 break-all text-sm text-muted-foreground">{demoEmail}</p>
              </div>
            ) : null}
          </aside>

          <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-pop-md">
            {storageMessage ? (
              <div className="mb-5 rounded-md border border-primary/35 bg-primary/10 px-4 py-3 text-sm text-foreground">
                {storageMessage}
              </div>
            ) : null}

            <div className="mb-6 grid gap-3 rounded-lg border border-border bg-background p-4">
              <LimitSettingsForms limits={limits} />
            </div>

            <AddEmailForm />

            <div className="mt-6 overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-[1fr_auto] bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground">
                <span>Email</span>
                <span>Action</span>
              </div>

              {emails.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">No emails added yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {emails.map((email) => (
                    <li key={email} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3">
                      <span className="break-all text-sm text-card-foreground/85">{email}</span>
                      <form action={deleteEmailAction}>
                        <Input name="email" type="hidden" value={email} />
                        <Button type="submit" size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" aria-label={`Delete ${email}`}>
                          <Trash2 className="size-4" />
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}

              {total > emailPageSize ? (
                <div className="flex flex-col gap-3 border-t border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {visibleCount} of {total} emails
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hasMoreEmails ? (
                      <Link
                        href={`/admin?emails=${nextEmailLimit}`}
                        scroll={false}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                      >
                        <ChevronDown className="size-4" />
                        See 10 More
                      </Link>
                    ) : null}
                    {canShowLessEmails ? (
                      <Link
                        href="/admin?emails=10"
                        scroll={false}
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
                      >
                        <ChevronUp className="size-4" />
                        Show First 10
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
