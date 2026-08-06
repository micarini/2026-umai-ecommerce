import Image from "next/image";

const STATS = [
  { value: "100%", label: "compostable packaging" },
  { value: "12+", label: "local farm partners" },
  { value: "0", label: "single-use plastic" },
];

export default function HomeStorySection() {
  return (
    <section id="story" className="bg-wasabi-light">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-wasabi">Our story</p>
            <h2 className="mt-2 text-4xl font-extrabold text-teal">Named after the honu.</h2>

            <p className="mt-6 text-teal/70">
              <span className="font-bold text-teal">Honu</span> is the Hawaiian word for the
              green sea turtle — to islanders a symbol of good luck, long life, peace and safe
              passage across the ocean. Divers consider it a guardian, and it always finds its
              way home.
            </p>
            <p className="mt-4 text-teal/70">
              That felt right for what we do. We source from the same ocean the honu calls home,
              so we treat it with the same care: wild-caught fish, organic produce and nothing
              wasteful. We build every bowl the way the honu lives — unhurried, wholesome and
              gentle on the planet.
            </p>

            <div className="mt-10 flex flex-wrap gap-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold text-salmon">{stat.value}</p>
                  <p className="mt-1 text-sm text-teal/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-sand bg-cream p-10 text-center">
            <Image
              src="/images/logo/icon.svg"
              alt=""
              width={147}
              height={130}
              className="mx-auto"
            />
            <p className="mt-4 text-3xl font-extrabold text-teal">
              honu bowls<span className="text-salmon">.</span>
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-teal/50">
              The turtle is the bowl
            </p>
            <p className="mx-auto mt-4 max-w-sm text-sm text-teal/60">
              Our mark hides a honu in plain sight — the shell becomes the bowl, the hexagon its
              scutes, the chopstick its tail.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
