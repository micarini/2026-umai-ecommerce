"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CardNumberElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaCheckCircle, FaStore, FaTruck } from "react-icons/fa";

import { useApp } from "@/context/AppContext";
import PaymentCardForm from "@/components/PaymentCardForm";
import { getStripe } from "@/lib/stripe-client";

function getProductImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/")) return image;
  return `/images/products/${image}`;
}

function formatCustomizations(customizations) {
  if (!customizations || customizations.length === 0) return "";
  return customizations
    .map((c) => `${c.name}: ${c.values ? c.values.join(", ") : c.value}`)
    .join(" · ");
}

function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { cart, cartTotal, activeUser, clearCart } = useApp();

  const [name, setName] = useState(activeUser?.name || "");
  const [email, setEmail] = useState(activeUser?.email || "");
  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardElementsComplete, setCardElementsComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  useEffect(() => {
    if (!activeUser) {
      router.replace("/login?next=/checkout");
    }
  }, [activeUser, router]);

  useEffect(() => {
    if (!completedOrder && cart.length === 0) {
      router.replace("/cart");
    }
  }, [cart, completedOrder, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!cardElementsComplete.number || !cardElementsComplete.expiry || !cardElementsComplete.cvc) {
      setError("Please complete your card details.");
      return;
    }

    if (!stripe || !elements) return;

    setIsSubmitting(true);

    try {
      const intentRes = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal }),
      });
      const intentData = await intentRes.json();

      if (!intentRes.ok) {
        setError(intentData.message || "Could not start payment.");
        return;
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: { name: cardName || name },
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message || "Payment failed.");
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        setError("Payment could not be completed.");
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUser._id,
          name,
          email,
          shippingMethod,
          address: shippingMethod === "pickup" ? "" : address,
          notes,
          items: cart,
          total: cartTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Payment succeeded but the order could not be created.");
        return;
      }

      setOrderSnapshot({
        items: cart,
        total: cartTotal,
        name,
        email,
        shippingMethod,
        address: shippingMethod === "pickup" ? "" : address,
      });
      setCompletedOrder(data);
      clearCart();
    } catch {
      setError("Could not complete checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!activeUser || (!completedOrder && cart.length === 0)) {
    return null;
  }

  if (completedOrder && orderSnapshot) {
    return (
      <main className="min-h-screen bg-cream text-teal">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <FaCheckCircle className="h-12 w-12 text-wasabi" />
            <h1 className="mt-4 text-3xl font-extrabold text-teal">Thank you!</h1>
            <p className="mt-2 text-teal/60">
              Your order has been placed successfully. Please check the details below.
            </p>
            <p className="mt-4 rounded-full bg-sand px-6 py-2 text-sm font-bold text-teal">
              Order {completedOrder.orderNumber}
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-sand bg-white/40">
            <h2 className="border-b border-sand px-6 py-4 text-sm font-bold uppercase tracking-wide text-teal/60">
              What you ordered
            </h2>
            {orderSnapshot.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border-b border-sand p-6 last:border-b-0"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-sand">
                  {item.image ? (
                    <Image
                      src={getProductImageSrc(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-teal">{item.name}</p>
                  {formatCustomizations(item.customizations) && (
                    <p className="mt-1 text-xs text-teal/50">
                      {formatCustomizations(item.customizations)}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-teal/60">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-bold text-teal">${item.subtotal.toFixed(2)}</p>
              </div>
            ))}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-teal/60">Total</span>
              <span className="text-xl font-extrabold text-teal">
                ${orderSnapshot.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-sand bg-white/40 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-teal/60">
              Delivery details
            </h2>
            <div className="mt-3 flex items-center gap-2 font-bold text-wasabi">
              {orderSnapshot.shippingMethod === "pickup" ? (
                <FaStore className="h-4 w-4" />
              ) : (
                <FaTruck className="h-4 w-4" />
              )}
              {orderSnapshot.shippingMethod === "pickup" ? "Pickup at store" : "Delivery"}
            </div>
            {orderSnapshot.address && (
              <p className="mt-2 text-teal/70">{orderSnapshot.address}</p>
            )}
            <p className="mt-3 text-sm text-teal/60">
              {orderSnapshot.name} · {orderSnapshot.email}
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/user"
              className="rounded-full bg-salmon px-6 py-3 text-sm font-bold text-white transition hover:bg-salmon-dark"
            >
              View my orders
            </Link>
            <Link
              href="/"
              className="rounded-full border border-sand px-6 py-3 text-sm font-bold text-teal transition hover:bg-sand"
            >
              Back to menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-teal">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-teal">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <form
            className="space-y-4 rounded-3xl border border-sand bg-white/40 p-6 lg:col-span-2"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
                Name
              </label>
              <input
                className="w-full rounded-lg border border-sand bg-cream px-4 py-3 outline-none focus:border-teal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
                Email
              </label>
              <input
                className="w-full rounded-lg border border-sand bg-cream px-4 py-3 outline-none focus:border-teal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
                Shipping
              </label>
              <div className="flex gap-2">
                {[
                  { value: "delivery", label: "Delivery" },
                  { value: "pickup", label: "Pickup at store" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setShippingMethod(option.value)}
                    className={`flex-1 rounded-lg border px-4 py-3 text-sm font-bold transition ${
                      shippingMethod === option.value
                        ? "border-teal bg-teal text-white"
                        : "border-sand bg-cream text-teal hover:border-teal/40"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {shippingMethod === "delivery" && (
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
                  Delivery address
                </label>
                <input
                  className="w-full rounded-lg border border-sand bg-cream px-4 py-3 outline-none focus:border-teal"
                  placeholder="Street, number, city"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
                Order notes (optional)
              </label>
              <textarea
                className="w-full rounded-lg border border-sand bg-cream px-4 py-3 outline-none focus:border-teal"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="border-t border-sand pt-4">
              <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-teal/60">
                Payment
              </label>
              <PaymentCardForm
                cardName={cardName}
                onCardNameChange={setCardName}
                onElementsChange={setCardElementsComplete}
              />
            </div>

            {error && <p className="text-sm text-salmon">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !stripe}
              className="w-full rounded-full bg-salmon py-3 text-sm font-bold text-white transition hover:bg-salmon-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Processing payment..." : `Place order · $${cartTotal.toFixed(2)}`}
            </button>
          </form>

          <aside className="h-fit rounded-3xl border border-sand bg-white/40 p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-extrabold text-teal">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {cart.map((item) => (
                <li
                  key={`${item.productId}-${JSON.stringify(item.customizations)}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-teal/70">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="font-bold text-teal">${item.subtotal.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-sand pt-4">
              <span className="text-sm text-teal/60">Total</span>
              <span className="text-2xl font-extrabold text-teal">${cartTotal.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={getStripe()}>
      <CheckoutForm />
    </Elements>
  );
}
