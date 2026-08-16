import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);


export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const role = (req.auth?.user?.role as string)?.toUpperCase() ?? "USER";

    const isAdminRoute    = nextUrl.pathname.startsWith("/admin");
    const isAuthRoute     = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
    const isProtectedRoute = isAdminRoute || nextUrl.pathname.startsWith("/dashboard");
    // Note: /profile protects itself via server-side auth() in the page component

    // ─── Auth pages (login / register) ──────────────────────────
    // Already logged in → send home
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
        return NextResponse.next();
    }

    // ─── Protected routes ────────────────────────────────────────
    // Not logged in → send to custom login page
    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + (nextUrl.search || ""));
        return NextResponse.redirect(loginUrl);
    }

    // ─── Admin routes ────────────────────────────────────────────
    if (isAdminRoute && role !== "ADMIN") {
        const deniedUrl = new URL("/", nextUrl);
        deniedUrl.searchParams.set("error", "AccessDenied");
        return NextResponse.redirect(deniedUrl);
    }

    // ─── Security headers for protected pages ───────────────────
    const response = NextResponse.next();
    if (isProtectedRoute) {
        response.headers.set("Cache-Control", "no-store, max-age=0");
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("X-Frame-Options", "DENY");
    }

    return response;
});

// Match all routes EXCEPT api, static assets, and images
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
