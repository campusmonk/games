import { requireUserAccess } from "@/lib/access/allowlist";

export default async function QuizProtectedLayout({
  children,
}: LayoutProps<"/quiz">) {
  await requireUserAccess();

  return children;
}
