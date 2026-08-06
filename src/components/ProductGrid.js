import Image from "next/image";
import Link from "next/link";

import FavoriteButton from "@/components/FavoriteButton";

function getProductImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/")) return image;
  return `/images/products/${image}`;
}

export default function ProductGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-sand p-8 text-center text-teal/40">
        No products loaded yet.
      </p>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/product/${product._id}`}
          className="group block"
        >
          {/* Foto */}
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-sand">
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

            {/* Badge de categoría principal */}
            {product.categories?.[0] && typeof product.categories[0] !== "string" && (
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-wasabi backdrop-blur-sm">
                {product.categories[0].name}
              </span>
            )}

            <FavoriteButton productId={product._id} className="absolute right-3 top-3 h-9 w-9" />
          </div>

          {/* Info */}
          <div className="mt-4 px-1">
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
          </div>
        </Link>
      ))}
    </div>
  );
}
