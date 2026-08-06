"use client";

import Image from "next/image";
import Link from "next/link";

import { useApp } from "@/context/AppContext";

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

function CartItemRow({ item }) {
  const { updateCartQuantity, removeFromCart } = useApp();

  return (
    <div className="flex gap-4 border-b border-sand py-6 last:border-b-0">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand">
        {item.image ? (
          <Image
            src={getProductImageSrc(item.image)}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.productId}`}
            className="text-sm font-bold uppercase tracking-wide text-teal hover:underline"
          >
            {item.name}
          </Link>
          {formatCustomizations(item.customizations) && (
            <p className="mt-1 text-xs text-teal/50">
              {formatCustomizations(item.customizations)}
            </p>
          )}
          <p className="mt-1 text-sm text-teal/60">${item.price.toFixed(2)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1.5">
            <button
              type="button"
              onClick={() =>
                updateCartQuantity(item.productId, item.customizations, item.quantity - 1)
              }
              className="h-7 w-7 rounded-full text-teal hover:bg-sand"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-bold text-teal">{item.quantity}</span>
            <button
              type="button"
              onClick={() =>
                updateCartQuantity(item.productId, item.customizations, item.quantity + 1)
              }
              className="h-7 w-7 rounded-full text-teal hover:bg-sand"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-teal">${item.subtotal.toFixed(2)}</span>
            <button
              type="button"
              onClick={() => removeFromCart(item.productId, item.customizations)}
              aria-label="Remove item"
              className="h-8 w-8 rounded-full text-teal/40 hover:bg-sand hover:text-salmon"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, cartTotal } = useApp();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-cream text-teal">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-teal">Your cart is empty</h1>
          <p className="mt-2 text-teal/60">Looks like you haven&apos;t added any bowls yet.</p>
          <Link
            href="/categories"
            className="mt-6 rounded-full bg-salmon px-6 py-3 text-sm font-bold text-white transition hover:bg-salmon-dark"
          >
            Browse the menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-teal">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-teal">Your Cart</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-sand bg-white/40 px-6 lg:col-span-2">
            {cart.map((item) => (
              <CartItemRow key={`${item.productId}-${JSON.stringify(item.customizations)}`} item={item} />
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-sand bg-white/40 p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-extrabold text-teal">Order Summary</h2>
            <div className="mt-4 flex items-center justify-between border-t border-sand pt-4">
              <span className="text-sm text-teal/60">Total</span>
              <span className="text-2xl font-extrabold text-teal">${cartTotal.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-salmon py-3 text-center text-sm font-bold text-white transition hover:bg-salmon-dark"
            >
              Continue to checkout
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
