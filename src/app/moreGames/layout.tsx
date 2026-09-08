import { requireUserAccess } from "@/lib/access/allowlist";

export default async function MoreGamesProtectedLayout({ children }: LayoutProps<"/moreGames">) {
  await requireUserAccess();

  return children;
}
