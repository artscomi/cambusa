import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/terms",
  "/privacy-policy",
  "/cookies",
  "/sitemap.xml",
  "/sitemap-0.xml",
  "/robots.txt",
  "/blog(.*)",
  // Cambusa Express: liste condivise senza registrazione
  "/express(.*)",
  // Cron di Vercel: protetto dalla variabile CRON_SECRET, non dal login
  "/api/cron(.*)",
  // Collegamento a Splitwise da Cambusa Express, senza account Cambusa
  "/api/splitwise(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) await auth.protect()
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
