import { NextRequest, NextResponse } from "next/server";
import {
  exchangeSplitwiseCode,
  safeReturnPath,
  SPLITWISE_STATE_COOKIE,
  SPLITWISE_TOKEN_COOKIE,
} from "@/lib/splitwise";

/** Ritorno da Splitwise: salva il permesso e riporta l'utente alla sua lista. */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const [expectedState, rawReturn] = (
    req.cookies.get(SPLITWISE_STATE_COOKIE)?.value ?? ""
  ).split("|");
  const returnTo = safeReturnPath(rawReturn);
  const back = (status: "ok" | "errore") =>
    new URL(`${returnTo}?splitwise=${status}`, origin);

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  let res: NextResponse;
  if (!code || !state || !expectedState || state !== expectedState) {
    // Permesso negato, oppure richiesta non partita da Cambusa
    res = NextResponse.redirect(back("errore"));
  } else {
    try {
      const token = await exchangeSplitwiseCode(origin, code);
      res = NextResponse.redirect(back("ok"));
      res.cookies.set(SPLITWISE_TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    } catch (e) {
      console.error("Splitwise callback:", e);
      res = NextResponse.redirect(back("errore"));
    }
  }
  res.cookies.delete(SPLITWISE_STATE_COOKIE);
  return res;
}
