import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_CANDIDATES = [
  "access_token",
  "auth_token",
  "token",
  "jwt",
  "Authentication",
] as const;

const AUTH_ROUTES = ["/login", "/register"] as const;
const PROTECTED_ROUTE_PREFIXES = ["/clubs/create", "/events/create", "/chat"] as const;

const hasAuthCookie = (request: NextRequest): boolean =>
  AUTH_COOKIE_CANDIDATES.some((cookieKey) =>
    Boolean(request.cookies.get(cookieKey)?.value),
  );

const isAuthRoute = (pathname: string): boolean =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

const isProtectedRoute = (pathname: string): boolean =>
  PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = hasAuthCookie(request);

  // Disable redirect to allow re-login if session is stale
  // if (isAuthRoute(pathname) && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const redirectTarget = `${pathname}${search}`;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", redirectTarget);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/clubs/create/:path*", "/events/create/:path*", "/chat/:path*"],
};

