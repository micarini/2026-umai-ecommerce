import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return Response.json({ message: "Invalid amount." }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { message: "Payments are not configured yet." },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return Response.json(
      { message: error.message || "Could not start payment." },
      { status: 500 }
    );
  }
}
