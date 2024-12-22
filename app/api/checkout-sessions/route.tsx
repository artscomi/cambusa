import {  currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const price =
  process.env.NODE_ENV === "development"
    ? "price_1Q08H3D79nSJWeoGYqipLIOR"
    : "price_1Q1ofmD79nSJWeoGrZDSsoo4";

export async function POST(req: Request) {
  const user = await currentUser();

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${req.headers.get(
        "origin"
      )}/payment-return-page/?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
      redirect_on_completion: "if_required",
      payment_method_types: ["card", "paypal"],
      customer_email: user?.emailAddresses[0].emailAddress,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: (err as any).statusCode || 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const session_id = url.searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email ?? "Email not available",
    });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: (err as any).statusCode || 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: Request) {
  return NextResponse.json({}, { status: 200 });
}
