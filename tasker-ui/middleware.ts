import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@/lib/types";

const rolePrefixes: Record<Role, string> = {
  client: "/client",
  expert: "/expert",
  admin: "/admin",
  enterprise: "/enterprise",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedRole = (Object.keys(rolePrefixes) as Role[]).find((role) => pathname.startsWith(rolePrefixes[role]));
  if (!protectedRole && !pathname.startsWith("/dashboard")) return NextResponse.next();

  const cookieRole = req.cookies.get("aitasker_role")?.value as Role | undefined;
  if (!cookieRole) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (protectedRole && cookieRole !== protectedRole) {
    const url = req.nextUrl.clone();
    url.pathname = rolePrefixes[cookieRole] ? `${rolePrefixes[cookieRole]}/dashboard` : "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/expert/:path*", "/admin/:path*", "/enterprise/:path*", "/dashboard/:path*"],
};
