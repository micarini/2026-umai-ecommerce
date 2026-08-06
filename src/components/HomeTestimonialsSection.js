import Image from "next/image";
import { FaStar } from "react-icons/fa";

import NewsletterForm from "@/components/NewsletterForm";

const TESTIMONIALS = [
  {
    quote:
      "The freshest bowl in town, hands down. You can taste that the fish came in that morning.",
    name: "Mia R.",
    role: "Regular since day one",
    initial: "M",
    color: "bg-salmon",
  },
  {
    quote: "Building my own bowl is half the fun. Love that the packaging just goes in the compost.",
    name: "Jonah T.",
    role: "Build-your-own devotee",
    initial: "J",
    color: "bg-wasabi",
  },
  {
    quote: "Finally a healthy lunch that actually fills me up. The dragon bowl is unreal.",
    name: "Ana L.",
    role: "Lunch-break regular",
    initial: "A",
    color: "bg-teal-light",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-[#F2B705]">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className="h-4 w-4" />
      ))}
    </div>
  );
}

export default function HomeTestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-wasabi">Loved locally</p>
        <h2 className="mt-2 text-4xl font-extrabold text-teal">What the neighborhood says</h2>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-3xl border border-sand bg-white/40 p-6">
            <Stars />
            <p className="mt-4 text-teal/80">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`}
              >
                {t.initial}
              </div>
              <div>
                <p className="text-sm font-bold text-teal">{t.name}</p>
                <p className="text-xs text-teal/50">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-10 overflow-hidden rounded-3xl bg-salmon px-8 py-10 sm:px-12">
        <Image
          src="/images/logo/icon.svg"
          alt=""
          width={220}
          height={195}
          className="pointer-events-none absolute -right-6 -bottom-10 opacity-20 sm:opacity-30"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-3xl font-extrabold text-white">Join the pod.</h3>
            <p className="mt-2 max-w-sm text-sm text-white/80">
              New seasonal bowls, early access to specials, and the occasional turtle fact. No
              spam — promise.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
