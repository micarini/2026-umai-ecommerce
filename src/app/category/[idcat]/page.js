import Link from "next/link";
import { notFound } from "next/navigation";

import ProductGrid from "@/components/ProductGrid";
import { getCategoryById, getTagCategories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { idcat } = await params;
  const category = await getCategoryById(idcat);
  if (!category) return { title: "Not found" };
  return { title: `${category.name} — Honu Bowls` };
}

export default async function CategoryProductsPage({ params, searchParams }) {
  const { idcat } = await params;
  const activeTag = (await searchParams)?.tag || null;

  const category = await getCategoryById(idcat);
  if (!category) notFound();

  let products = await getProductsByCategory(category._id);

  // Filtrar por tag si hay uno activo
  if (activeTag) {
    products = products.filter((p) =>
      p.categories.some(
        (c) => typeof c === "object" && c.name === activeTag
      )
    );
  }

  // Tags disponibles en los productos de esta categoría
  const tagSet = new Set();
  for (const p of await getProductsByCategory(category._id)) {
    for (const c of p.categories) {
      if (typeof c === "object" && c.type === "tag") {
        tagSet.add(c.name);
      }
    }
  }
  const tags = [...tagSet].sort();

  return (
    <main className="min-h-screen bg-cream text-teal">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <Link
          href="/categories"
          className="text-sm font-semibold text-teal/40 hover:text-teal"
        >
          ← Back to menu
        </Link>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-wasabi">
            {category.name}
          </p>
          <h1 className="mt-1 text-4xl font-extrabold text-teal">
            {category.description || `Our ${category.name}`}
          </h1>
        </div>

        {/* Tag filters */}
        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href={`/category/${idcat}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                !activeTag
                  ? "border-teal bg-teal text-white"
                  : "border-sand bg-cream text-teal hover:border-teal/40"
              }`}
            >
              All
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/category/${idcat}?tag=${encodeURIComponent(tag)}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  activeTag === tag
                    ? "border-wasabi bg-wasabi text-white"
                    : "border-sand bg-cream text-teal hover:border-wasabi/40"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </div>
    </main>
  );
}
