import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  safeReturnPath,
  SPLITWISE_STATE_COOKIE,
  splitwiseAuthorizeUrl,
} from "@/lib/splitwise";

/** Avvia il collegamento: manda l'utente su Splitwise a dare il permesso. */
export function GET(req: NextRequest) {
  const returnTo = safeReturnPath(req.nextUrl.searchParams.get("return"));
  const state = randomUUID();
  const url = splitwiseAuthorizeUrl(req.nextUrl.origin, state);
  if (!url) return NextResponse.redirect(new URL(returnTo, req.nextUrl.origin));

  const res = NextResponse.redirect(url);
  res.cookies.set(SPLITWISE_STATE_COOKIE, `${state}|${returnTo}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  return res;
}
