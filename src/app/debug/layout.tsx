import { requireUserAccess } from "@/lib/access/allowlist";

export default async function DebugProtectedLayout({
  children,
}: LayoutProps<"/debug">) {
  await requireUserAccess();

  return children;
}
