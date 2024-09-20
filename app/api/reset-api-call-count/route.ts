import { NextResponse } from "next/server";
import { resetApiCallCount } from "./actions";

export async function POST(req: Request) {
  try {
    await resetApiCallCount();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reset API call count" }, { status: 500 });
  }
}
