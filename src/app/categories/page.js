import Link from "next/link";

import { getMainCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

const categoryEmoji = {
  Bowls: "🥣",
  Drinks: "🥤",
  Desserts: "🍡",
};

const categoryBg = {
  Bowls: "bg-sand",
  Drinks: "bg-wasabi-light",
  Desserts: "bg-cream",
};

export default async function CategoriesPage() {
  const categories = await getMainCategories();

  return (
    <main className="min-h-screen bg-cream text-teal">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-wasabi">Menu</p>
        <h1 className="mt-2 text-4xl font-extrabold text-teal">What are you craving?</h1>
        <p className="mt-3 max-w-xl text-base text-teal/60">
          Explore our fresh poke bowls, refreshing drinks and light desserts.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat._id}`}
              className={`group flex flex-col items-center justify-center gap-4 rounded-3xl p-12 text-center transition hover:shadow-md ${categoryBg[cat.name] || "bg-sand"}`}
            >
              <span className="text-6xl">{categoryEmoji[cat.name] || "🍜"}</span>
              <div>
                <h2 className="text-2xl font-extrabold text-teal">{cat.name}</h2>
                {cat.description && (
                  <p className="mt-1 text-sm text-teal/50">{cat.description}</p>
                )}
              </div>
              <span className="text-xs font-bold text-salmon opacity-0 transition group-hover:opacity-100">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
