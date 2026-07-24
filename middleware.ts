import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookieValue, COOKIE_NAME } from "./lib/session";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  const companyId = await verifySessionCookieValue(req.cookies.get(COOKIE_NAME)?.value);
  if (!companyId) {
    return NextResponse.redirect(new URL("/dashboard/login", req.url));
  }

  const headers = new Headers(req.headers);
  headers.set("x-company-id", companyId);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: "/dashboard/:path*",
};
