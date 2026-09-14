import { requireUserAccess } from "@/lib/access/allowlist";

export default async function AiAssistProtectedLayout({
  children,
}: LayoutProps<"/AI-assist">) {
  await requireUserAccess();

  return children;
}
