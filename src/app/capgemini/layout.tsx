import { requireUserAccess } from "@/lib/access/allowlist";

export default async function CapgeminiProtectedLayout({ children }: LayoutProps<"/capgemini">) {
  await requireUserAccess();

  return children;
}
