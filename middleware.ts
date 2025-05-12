import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the auth token from the cookies
  const authToken = request.cookies.get("auth-token")?.value

  // Define protected routes that require authentication
  const protectedRoutes = ["/profile", "/settings", "/favorites"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If trying to access a protected route without being logged in
  if (isProtectedRoute && !authToken) {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile/:path*", "/settings/:path*", "/favorites/:path*"],
}
