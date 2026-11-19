import { NextResponse } from "next/server";
import db from "@/utils/db";
import { EXPRESS_RETENTION_MONTHS } from "@/lib/express/retention";

export const dynamic = "force-dynamic";

/**
 * Pulizia giornaliera delle liste Express inattive, chiamata dal cron di Vercel (vercel.json).
 * Vercel invia "Authorization: Bearer <CRON_SECRET>": senza la variabile CRON_SECRET non parte.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - EXPRESS_RETENTION_MONTHS);

  // Prodotti e voti si cancellano a cascata insieme alla lista
  const { count } = await db.expressList.deleteMany({ where: { updatedAt: { lt: cutoff } } });

  return NextResponse.json({ deleted: count, olderThan: cutoff.toISOString() });
}
