"use client";

import { useMemo, useState } from "react";

import ProductGrid from "@/components/ProductGrid";

export default function ProductCatalog({ products, tagCategories }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const maxProductPrice = useMemo(
    () => Math.max(1, ...products.map((p) => p.price)),
    [products]
  );
  const [maxPrice, setMaxPrice] = useState(Math.ceil(maxProductPrice));

  const filtered = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      product.categories.some(
        (c) => typeof c === "object" && c._id === selectedCategory
      );

    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-3xl border border-sand bg-white/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bowls..."
          className="w-full rounded-full border border-sand bg-cream px-5 py-2.5 text-sm text-teal outline-none focus:border-teal sm:max-w-xs"
        />

        <div className="flex items-center gap-3">
          <label className="whitespace-nowrap text-xs font-bold uppercase tracking-wide text-teal/50">
            Up to ${maxPrice}
          </label>
          <input
            type="range"
            min="1"
            max={Math.ceil(maxProductPrice)}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32 accent-salmon"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            !selectedCategory
              ? "border-teal bg-teal text-white"
              : "border-sand bg-cream text-teal hover:border-teal/40"
          }`}
        >
          All
        </button>
        {tagCategories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => setSelectedCategory(cat._id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              selectedCategory === cat._id
                ? "border-wasabi bg-wasabi text-white"
                : "border-sand bg-cream text-teal hover:border-wasabi/40"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-sand p-8 text-center text-teal/40">
            No bowls match your search.
          </p>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>
    </div>
  );
}
