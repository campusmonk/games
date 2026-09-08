import { requireUserAccess } from "@/lib/access/allowlist";

export default async function AccentureProtectedLayout({ children }: LayoutProps<"/accenture">) {
  await requireUserAccess();

  return children;
}
