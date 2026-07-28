import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookieValue, COOKIE_NAME } from "./lib/session";

const PUBLIC_DASHBOARD_PATHS = [
  "/dashboard/login",
  "/dashboard/forgot-password",
  "/dashboard/reset-password",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_DASHBOARD_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const companyId = await verifySessionCookieValue(req.cookies.get(COOKIE_NAME)?.value);
  if (!companyId) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/dashboard/login", req.url));
  }

  const headers = new Headers(req.headers);
  headers.set("x-company-id", companyId);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/dashboard/jobs",
    "/api/dashboard/jobs/:path*",
    "/api/dashboard/notify-code",
    "/api/dashboard/extract",
    "/api/dashboard/change-password",
    "/api/dashboard/email",
    "/api/dashboard/profile",
    "/api/dashboard/export",
    "/api/dashboard/line-integration",
    "/api/dashboard/billing-portal",
  ],
};
