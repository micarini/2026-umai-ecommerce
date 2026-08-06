"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useApp } from "@/context/AppContext";
import FavoriteButton from "@/components/FavoriteButton";

function getProductImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/")) return image;
  return `/images/products/${image}`;
}

export default function FavoritesPage() {
  const { favorites } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFavoriteProducts() {
      if (favorites.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const results = await Promise.all(
        favorites.map(async (productId) => {
          const res = await fetch(`/api/products/${productId}`);
          return res.ok ? res.json() : null;
        })
      );

      if (!cancelled) {
        setProducts(results.filter(Boolean));
        setLoading(false);
      }
    }

    loadFavoriteProducts();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  return (
    <main className="min-h-screen bg-cream text-teal">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-teal">Your Favorites</h1>

        {loading ? (
          <p className="mt-8 text-teal/50">Loading favorites...</p>
        ) : products.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-sand p-16 text-center">
            <p className="text-teal/60">You don&apos;t have any favorites yet.</p>
            <Link
              href="/categories"
              className="mt-6 rounded-full bg-salmon px-6 py-3 text-sm font-bold text-white transition hover:bg-salmon-dark"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="group block">
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-sand">
                  <Link href={`/product/${product._id}`}>
                    {product.image ? (
                      <Image
                        alt={product.name}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        src={getProductImageSrc(product.image)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-teal/30">
                        No image
                      </div>
                    )}
                  </Link>

                  <FavoriteButton productId={product._id} className="absolute right-3 top-3 h-9 w-9" />
                </div>

                <Link href={`/product/${product._id}`} className="mt-4 block px-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-teal">
                      {product.name}
                    </h2>
                    <span className="shrink-0 text-sm font-bold text-salmon">
                      ${product.price}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-teal/55">
                    {product.description || "No description"}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
