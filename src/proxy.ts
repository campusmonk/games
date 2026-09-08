import { NextResponse, type NextRequest } from "next/server";

import { accessCookieNames, verifyAccessToken } from "@/lib/access/session";

const protectedPrefixes = ["/moreGames", "/accenture", "/capgemini", "/communication-round", "/debug", "/quiz"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedPath(pathname)) return NextResponse.next();

  const token = request.cookies.get(accessCookieNames.user)?.value;
  const session = await verifyAccessToken(token, "user");

  if (session) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/access";
  url.search = "";
  url.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/moreGames/:path*",
    "/accenture/:path*",
    "/capgemini/:path*",
    "/communication-round/:path*",
    "/debug/:path*",
    "/quiz/:path*",
  ],
};
