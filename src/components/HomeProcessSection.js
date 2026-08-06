const STEPS = [
  {
    number: "01",
    title: "Responsibly caught",
    description: "Wild fish from certified fisheries that protect turtle habitats and never trawl reefs.",
  },
  {
    number: "02",
    title: "Grown down the road",
    description: "Organic produce from a dozen local farms, delivered the morning we serve it.",
  },
  {
    number: "03",
    title: "Built to order",
    description: "Assembled the moment you order so nothing sits, nothing wilts, nothing is thrown out.",
  },
  {
    number: "04",
    title: "Home in a shell",
    description: "Served in 100% plant-based, compostable bowls — zero single-use plastic, ever.",
  },
];

export default function HomeProcessSection() {
  return (
    <section className="relative overflow-hidden bg-teal py-16">
      <svg
        className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 text-white/5"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M50 25 L70 37.5 L70 62.5 L50 75 L30 62.5 L30 37.5 Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative mx-auto max-w-6xl px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
          From source to bowl
        </p>
        <h2 className="mt-2 max-w-2xl text-4xl font-extrabold text-white">
          Sourced with the same care the honu deserves.
        </h2>

        <div className="mt-12 grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number}>
              <p className="text-sm font-extrabold text-wasabi-light">{step.number}</p>
              <h3 className="mt-3 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
