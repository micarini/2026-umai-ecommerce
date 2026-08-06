"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useApp } from "@/context/AppContext";
import FavoriteButton from "@/components/FavoriteButton";

function getProductImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/")) return image;
  return `/images/products/${image}`;
}

// ── Selector de customización single ──────────────────────────────────────────
function SingleSelect({ customization, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-teal">
        {customization.name}
        {customization.required && <span className="ml-1 text-salmon">*</span>}
      </p>
      {customization.description && (
        <p className="mb-3 text-xs text-teal/50">{customization.description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {customization.options.map((opt) => {
          const selected = value === opt.label;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(opt.label)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                selected
                  ? "border-teal bg-teal text-white"
                  : "border-sand bg-cream text-teal hover:border-teal/40"
              }`}
            >
              {opt.label}
              {opt.price > 0 && (
                <span className={`ml-1 text-xs ${selected ? "text-white/70" : "text-salmon"}`}>
                  +${opt.price.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Selector de customización multi ───────────────────────────────────────────
function MultiSelect({ customization, values, onChange }) {
  function toggle(label) {
    if (values.includes(label)) {
      onChange(values.filter((v) => v !== label));
    } else {
      onChange([...values, label]);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-teal">
        {customization.name}
        <span className="ml-2 text-xs font-normal text-teal/40">(select multiple)</span>
      </p>
      {customization.description && (
        <p className="mb-3 text-xs text-teal/50">{customization.description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {customization.options.map((opt) => {
          const selected = values.includes(opt.label);
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => toggle(opt.label)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                selected
                  ? "border-wasabi bg-wasabi text-white"
                  : "border-sand bg-cream text-teal hover:border-wasabi/40"
              }`}
            >
              {opt.label}
              {opt.price > 0 && (
                <span className={`ml-1 text-xs ${selected ? "text-white/70" : "text-salmon"}`}>
                  +${opt.price.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function ProductDetail({ product, relatedProducts = [] }) {
  const { addToCart } = useApp();
  const isCustom = product.type === "custom";

  // Estado de customizaciones: { [customizationName]: string | string[] }
  const [selections, setSelections] = useState(() => {
    const init = {};
    for (const c of product.customizations) {
      init[c.name] = c.multiSelect ? [] : "";
    }
    return init;
  });

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Precio calculado
  const extraPrice = product.customizations.reduce((total, c) => {
    const sel = selections[c.name];
    if (c.multiSelect) {
      return (
        total +
        c.options
          .filter((o) => sel.includes(o.label))
          .reduce((s, o) => s + o.price, 0)
      );
    }
    const option = c.options.find((o) => o.label === sel);
    return total + (option?.price || 0);
  }, 0);

  const totalPrice = (isCustom ? 0 : product.price) + extraPrice;

  function updateSelection(name, value) {
    setSelections((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    for (const c of product.customizations) {
      if (!c.required) continue;
      const sel = selections[c.name];
      if (c.multiSelect ? sel.length === 0 : !sel) return false;
    }
    return true;
  }

  function handleAddToCart() {
    if (!validate()) return;

    const customizationsList = product.customizations
      .map((c) => {
        const sel = selections[c.name];
        if (c.multiSelect) {
          return sel.length > 0 ? { name: c.name, values: sel } : null;
        }
        return sel ? { name: c.name, value: sel } : null;
      })
      .filter(Boolean);

    addToCart({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: totalPrice,
      quantity,
      customizations: customizationsList,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const tagCategories = product.categories.filter(
    (c) => typeof c === "object" && c.type === "tag"
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-teal/50">
        <Link href="/" className="hover:text-teal">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-teal">Menu</Link>
        <span>/</span>
        <span className="text-teal">{product.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-sand">
          {product.image ? (
            <Image
              src={getProductImageSrc(product.image)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-teal/30">
              No image
            </div>
          )}

          {/* Favorite button */}
          <FavoriteButton
            productId={product._id}
            className="absolute right-4 top-4 h-10 w-10 text-lg"
          />
        </div>

        {/* Info + customizations */}
        <div className="flex flex-col">
          {/* Tags */}
          {tagCategories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {tagCategories.map((cat) => (
                <span
                  key={cat._id}
                  className="rounded-full bg-wasabi-light px-3 py-1 text-xs font-semibold text-wasabi"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-extrabold text-teal">{product.name}</h1>
          <p className="mt-3 text-teal/60">{product.description}</p>

          {/* Precio */}
          <div className="mt-4 flex items-baseline gap-2">
            {isCustom ? (
              <span className="text-3xl font-extrabold text-teal">
                ${totalPrice.toFixed(2)}
                <span className="ml-2 text-base font-normal text-teal/40">calculated</span>
              </span>
            ) : (
              <span className="text-3xl font-extrabold text-teal">
                ${totalPrice.toFixed(2)}
                {extraPrice > 0 && (
                  <span className="ml-2 text-sm font-normal text-teal/40">
                    (${product.price.toFixed(2)} + ${extraPrice.toFixed(2)} extras)
                  </span>
                )}
              </span>
            )}
          </div>

          {product.stock < 5 && product.stock > 0 && (
            <p className="mt-1 text-xs font-semibold text-salmon">
              Only {product.stock} left!
            </p>
          )}

          {/* Customizaciones */}
          {product.customizations.length > 0 && (
            <div className="mt-8 space-y-6 border-t border-sand pt-6">
              {product.customizations.map((c) =>
                c.multiSelect ? (
                  <MultiSelect
                    key={c.name}
                    customization={c}
                    values={selections[c.name]}
                    onChange={(v) => updateSelection(c.name, v)}
                  />
                ) : (
                  <SingleSelect
                    key={c.name}
                    customization={c}
                    value={selections[c.name]}
                    onChange={(v) => updateSelection(c.name, v)}
                  />
                )
              )}
            </div>
          )}

          {/* Cantidad + Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-7 w-7 rounded-full text-teal hover:bg-sand"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-bold text-teal">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="h-7 w-7 rounded-full text-teal hover:bg-sand"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!validate()}
              className="flex-1 rounded-full bg-salmon py-3 text-sm font-bold text-white transition hover:bg-salmon-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added
                ? "Added! ✓"
                : `Add to cart · $${(totalPrice * quantity).toFixed(2)}`}
            </button>
          </div>

          {product.customizations.some((c) => c.required) && !validate() && (
            <p className="mt-2 text-xs text-teal/40">
              * Please make all required selections before adding to cart.
            </p>
          )}
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-sand pt-12">
          <h2 className="mb-6 text-xl font-extrabold text-teal">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <Link key={p._id} href={`/product/${p._id}`} className="group block">
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-sand">
                  {p.image && (
                    <Image
                      src={getProductImageSrc(p.image)}
                      alt={p.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, 50vw"
                    />
                  )}
                </div>
                <div className="mt-3 px-1">
                  <p className="text-sm font-bold uppercase tracking-wide text-teal">{p.name}</p>
                  <p className="text-sm font-bold text-salmon">${p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
