import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl;
    if (url.pathname.startsWith("/home") && !req.nextauth.token) {
      // Redirect to the sign-in page with a callback URL
      url.pathname = "/";
      url.search = `callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Allow access if a token exists
    },
  }
);

console.log("Middlerware");


export const config = {
  matcher: ["/home/:path*"], // Apply middleware to /home and its subroutes
};
