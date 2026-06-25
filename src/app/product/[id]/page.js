import { notFound } from "next/navigation";

import ProductDetail from "@/components/ProductDetail";
import { getProductById, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found" };
  return { title: `${product.name} — Honu Bowls` };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const categoryIds = product.categories
    .filter((c) => typeof c === "object")
    .map((c) => c._id);

  const related = await getRelatedProducts(product._id, categoryIds, 3);

  return (
    <main className="min-h-screen bg-cream text-teal">
      <ProductDetail product={product} relatedProducts={related} />
    </main>
  );
}
