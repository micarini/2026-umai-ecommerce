import Image from "next/image";
import Link from "next/link";

import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-cream text-teal">

      {/* ── Hero full-width ── */}
      <section className="relative h-[75vh] w-full overflow-hidden">
        <Image
          src="/images/products/hero-background.png"
          alt="Fresh poke bowls at Honu Bowls"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />

        {/* Gradiente oscuro de abajo hacia arriba, solo en la mitad inferior */}
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

        {/* Texto superpuesto, bottom-left como Sweetgreen */}
        <div className="absolute bottom-0 left-0 px-8 pb-10 lg:px-16 lg:pb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
            Fresh · Local · Customizable
          </p>
          <h1 className="mt-3 max-w-xl text-5xl font-extrabold leading-tight text-white lg:text-7xl">
            Fresh bowls,<br />your way.
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-full bg-salmon px-7 py-3 text-sm font-bold text-white hover:bg-salmon-dark"
            >
              Order now →
            </a>
            <Link
              href="/categories"
              className="rounded-full border-2 border-white/40 px-7 py-3 text-sm font-bold text-white hover:border-white/70"
            >
              Browse categories
            </Link>
          </div>
        </div>
      </section>

      {/* ── Catálogo ── */}
      <section id="menu" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 border-b border-sand pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-wasabi">
            Our menu
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-teal">All bowls</h2>
        </div>

        <ProductGrid products={products} />
      </section>
    </main>
  );
}
