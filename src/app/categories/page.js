import Link from "next/link";

import { getCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
            Categories
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold">
            Bowl Categories
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            Explore our different sushi bowl categories and find your favorite flavors.
          </p>
        </section>

        {categories.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No categories loaded yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:bg-emerald-50"
                href={`/category/${category._id}`}
              >
                <h2 className="text-xl font-semibold text-slate-950">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {category.description || "No description"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
