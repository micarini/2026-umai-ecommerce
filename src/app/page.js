import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Sushi Shop
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold">
            Custom Sushi Bowls
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            Explore our delicious customizable sushi bowls. Admin panel available at /dashboard.
          </p>
        </section>

        <ProductGrid products={products} />
      </div>
    </main>
  );
}
