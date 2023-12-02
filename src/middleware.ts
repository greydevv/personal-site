import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isMaintenanceModeOn = process.env.NEXT_PUBLIC_MAINTENANCE?.toUpperCase() === "YES";
  if (isMaintenanceModeOn) {
    // If user is attempting to visit any page while maintenance mode is on, redirect to maintenance page.
    request.nextUrl.pathname = "/maintenance";
    return NextResponse.rewrite(request.nextUrl);
  } else if (request.nextUrl.pathname === "/maintenance") {
    // If user is attempting to visit maintenance page when maintenance mode is off, redirect to 404.
    request.nextUrl.pathname = "/404";
    return NextResponse.rewrite(request.nextUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons/
     * - signature.svg
     */
    "/((?!api|_next/static|.*\\..*|_next/image|favicon.ico).*)",
  ],
};
