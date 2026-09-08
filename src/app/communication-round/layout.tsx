import { requireUserAccess } from "@/lib/access/allowlist";

export default async function CommunicationRoundProtectedLayout({
  children,
}: LayoutProps<"/communication-round">) {
  await requireUserAccess();

  return children;
}
