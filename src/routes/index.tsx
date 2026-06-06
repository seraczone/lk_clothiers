import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import heroImg from "@/assets/hero.jpg";
import catBoubou from "@/assets/cat-boubou.jpg";
import { categories, newArrivals, bestSellers } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { genericWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import vLinen2pc from "@/assets/v-linen-2pc.mp4.asset.json";
import vCapeDress from "@/assets/v-cape-dress.mp4.asset.json";
import vLinenPants from "@/assets/v-linen-pants.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LK Clothiers — Modest Fashion, Timeless Elegance" },
      {
        name: "description",
        content:
          "Premium ready-to-wear modest fashion for women, girls and boys. Crafted in Abuja, worn worldwide.",
      },
      { property: "og:title", content: "LK Clothiers — Modest Fashion, Timeless Elegance" },
      {
        property: "og:description",
        content: "Premium ready-to-wear modest fashion for women, girls and boys.",
      },
    ],
  }),
  component: Index,
});

const lookbookVideos = [
  { src: vCapeDress.url, title: "Cape Dress", caption: "Silk & chiffon · fully lined" },
  { src: vLinen2pc.url, title: "Linen 2pc Set", caption: "Shirt & pant · styled separately" },
  { src: vLinenPants.url, title: "Linen Pants", caption: "Everyday ease · loungewear" },
];

function VideoLookbook() {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-14 reveal">
          <div>
            <p className="eyebrow mb-4 text-background/60">In Motion</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
              The lookbook,
              <br />
              <em className="italic text-[color:var(--accent)]">in motion</em>.
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-block lk-link text-xs uppercase tracking-[0.25em] text-background/80"
          >
            Shop the edit →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {lookbookVideos.map((v, i) => (
            <figure
              key={i}
              className="relative aspect-[9/16] overflow-hidden bg-background/10 reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <video
                src={v.src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-foreground/80 to-transparent text-background">
                <p className="font-display text-xl">{v.title}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] opacity-80 mt-1">
                  {v.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".reveal") ?? [];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function Hero() {
  return (
    <section className="relative min-h-[90svh]">
      <img
        src={heroImg}
        alt="LK Clothiers signature ivory kaftan"
        width={1080}
        height={1920}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-foreground/10" />
      <div className="relative z-10 flex items-end lg:items-center min-h-[90svh] px-6 lg:px-12 pb-16 lg:pb-0">
        <div className="lk-fade-up max-w-xl">
          <p className="eyebrow mb-6 text-white/80">LK Clothiers · Wuye, Abuja</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-white">
            Modest fashion,
            <br />
            <em className="italic text-[color:var(--accent)]">timeless</em> elegance.
          </h1>
          <p className="mt-6 text-base text-white/80 leading-relaxed max-w-sm">
            Premium ready-to-wear for women, girls and boys — designed for the modern African
            family.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-[color:var(--accent)] text-white px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-foreground transition-colors"
            >
              Shop Collection
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={genericWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-white/60 px-7 py-4 text-xs uppercase tracking-[0.25em] text-white hover:bg-white hover:text-foreground transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="mt-12 flex items-center gap-8 text-xs text-white/70">
            <span>Est. 2019</span>
            <span className="w-8 h-px bg-white/30" />
            <span>Abuja · Nigeria</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-8 right-8 z-10 flex items-end justify-between text-xs uppercase tracking-[0.25em] text-white/90">
        <span className="bg-foreground/70 backdrop-blur px-3 py-2">Autumn / Winter 26</span>
        <span className="bg-foreground/70 backdrop-blur px-3 py-2">Look 01 · Ivory Kaftan</span>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Free Delivery in Abuja",
    "Nationwide Shipping",
    "Atelier Appointments",
    "Bespoke Tailoring",
    "Modest by Design",
  ];
  const row = [...items, ...items, ...items];
  return (
    <div className="border-y border-border overflow-hidden bg-[color:var(--cream)] py-5">
      <div className="marquee-track flex gap-16 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-foreground/70">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-16">
            {t}
            <span className="text-[color:var(--accent)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-14 reveal">
        <div>
          <p className="eyebrow mb-4">The Collections</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl max-w-2xl leading-[1.05]">
            Considered wardrobes for the whole family.
          </h2>
        </div>
        <Link
          to="/shop"
          className="hidden md:inline-block lk-link text-xs uppercase tracking-[0.25em]"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {categories.map((c, i) => (
          <Link
            to="/shop/$category"
            params={{ category: c.key }}
            key={c.key}
            className="product-card group relative overflow-hidden bg-[color:var(--cream)] reveal aspect-[3/4]"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <img
              src={c.image}
              alt={`${c.name} collection`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 text-background">
              <p className="font-display text-2xl">{c.name}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] opacity-80 mt-1">{c.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductGrid({
  items,
  title,
  eyebrow,
  cta,
}: {
  items: ReturnType<typeof newArrivals>;
  title: string;
  eyebrow: string;
  cta?: { label: string; to: string };
}) {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 bg-[color:var(--cream)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-14 reveal">
          <div>
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">{title}</h2>
          </div>
          {cta && (
            <Link
              to={cta.to}
              className="hidden md:inline-block lk-link text-xs uppercase tracking-[0.25em]"
            >
              {cta.label} →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="grid lg:grid-cols-2 bg-foreground text-background">
      <div className="relative min-h-[60svh] lg:min-h-[80svh]">
        <img
          src={catBoubou}
          alt="LK atelier"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      </div>
      <div className="flex items-center px-6 lg:px-20 py-24 lg:py-0">
        <div className="max-w-lg reveal">
          <p className="eyebrow mb-6 text-background/60">Our Atelier</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            Quality, modesty, <em className="italic text-[color:var(--accent)]">elegance</em>.
          </h2>
          <p className="mt-8 text-background/70 leading-relaxed">
            Founded in Abuja, LK Clothiers is a quiet study in modern modesty. Each piece is cut
            from considered fabrics and finished by hand. We believe modest dress is not a
            limitation, but a language of confidence.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-background/80">
            <div>
              <p className="font-display text-3xl text-[color:var(--accent)]">6+</p>
              <p className="text-[10px] uppercase tracking-[0.2em] mt-2">Years crafting</p>
            </div>
            <div>
              <p className="font-display text-3xl text-[color:var(--accent)]">12k</p>
              <p className="text-[10px] uppercase tracking-[0.2em] mt-2">Women dressed</p>
            </div>
            <div>
              <p className="font-display text-3xl text-[color:var(--accent)]">36</p>
              <p className="text-[10px] uppercase tracking-[0.2em] mt-2">States delivered</p>
            </div>
          </div>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 border border-background/40 px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-background hover:text-foreground transition-colors"
          >
            Read our story
          </Link>
        </div>
      </div>
    </section>
  );
}

const reasons = [
  { t: "Premium Quality", d: "Hand-finished pieces in Italian and Turkish fabrics." },
  { t: "Elegant Designs", d: "Timeless silhouettes, refined for the modern woman." },
  { t: "Nationwide Delivery", d: "Express shipping to all 36 states in 2–5 days." },
  { t: "Exceptional Service", d: "Personal styling and bespoke alterations on request." },
];

function Why() {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 max-w-[1400px] mx-auto">
      <p className="eyebrow mb-4 reveal">Why LK</p>
      <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-2xl reveal">
        A quieter way to shop.
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {reasons.map((r, i) => (
          <div
            key={r.t}
            className="bg-background p-8 lg:p-10 reveal"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <p className="font-display text-[color:var(--accent)] text-2xl mb-6">0{i + 1}</p>
            <h3 className="font-display text-2xl mb-3">{r.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const testimonials = [
  {
    q: "My LK kaftan turned heads at every event of the season. The fabric, the cut — pure artistry.",
    n: "Aisha A.",
    c: "Abuja",
  },
  {
    q: "Finally a modest brand that doesn't compromise on style. Their workwear has redefined my wardrobe.",
    n: "Halima O.",
    c: "Lagos",
  },
  {
    q: "Bought matching pieces for my daughter and I. The quality is honestly worth every naira.",
    n: "Fatima B.",
    c: "Kano",
  },
];

function Testimonials() {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 bg-[color:var(--cream)]">
      <div className="max-w-[1400px] mx-auto">
        <p className="eyebrow mb-4 reveal">Client Diary</p>
        <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-2xl reveal">
          Worn and loved.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-background p-8 lg:p-10 reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-[color:var(--accent)] text-sm tracking-widest mb-6">★★★★★</div>
              <blockquote className="font-display text-xl lg:text-2xl leading-snug text-foreground">
                "{t.q}"
              </blockquote>
              <figcaption className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {t.n} · <span className="text-foreground">{t.c}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instagram() {
  const imgs = categories.slice(0, 6).map((c) => c.image);
  const instagramUrl = "https://instagram.com/lk_clothiers";
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-12 reveal">
        <div>
          <p className="eyebrow mb-4">Instagram</p>
          <h2 className="font-display text-4xl md:text-5xl">@lk_clothiers</h2>
        </div>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="lk-link text-xs uppercase tracking-[0.25em]"
        >
          Follow us →
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {imgs.map((img, i) => (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            key={i}
            className="product-card relative aspect-square overflow-hidden bg-[color:var(--cream)] reveal"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <img
              src={img}
              alt="Instagram post"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

function VisitStore() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="bg-[color:var(--cream)] flex items-center px-6 lg:px-20 py-24">
        <div className="max-w-md reveal">
          <p className="eyebrow mb-4">Visit Our Atelier</p>
          <h2 className="font-display text-4xl md:text-5xl mb-8">Showroom in Abuja.</h2>
          <div className="space-y-5 text-sm text-foreground/80">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                Address
              </p>
              <p>
                Wuye District,
                <br />
                Abuja FCT, Nigeria
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                Hours
              </p>
              <p>Mon — Sat · 10:00 — 19:00</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                Contact
              </p>
              <p>
                {WHATSAPP_DISPLAY}
                <br />
                hello@lkclothiers.com
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[color:var(--accent)] transition-colors"
          >
            Get directions →
          </Link>
        </div>
      </div>
      <div className="relative min-h-[60svh] bg-secondary">
        <svg
          viewBox="0 0 600 600"
          className="absolute inset-0 w-full h-full text-foreground/10"
          aria-hidden
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="600" height="600" fill="url(#grid)" />
          <path
            d="M0 380 Q150 350 300 370 T600 360"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M180 0 L210 600"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="w-4 h-4 rounded-full bg-[color:var(--accent)] mx-auto mb-3 ring-8 ring-[color:var(--accent)]/20" />
          <p className="font-display text-xl">LK Atelier</p>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
            Wuye, Abuja
          </p>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const ref = useReveal();
  return (
    <div ref={ref} className="scroll-smooth">
      <Hero />
      <Marquee />
      <Categories />
      <ProductGrid
        items={newArrivals()}
        eyebrow="New Arrivals"
        title="Fresh from the atelier."
        cta={{ label: "Shop all new", to: "/shop" }}
      />
      <section className="px-6 lg:px-12 py-24 lg:py-32 max-w-[1400px] mx-auto">
        <div className="reveal mb-14">
          <p className="eyebrow mb-4">Best Sellers</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl max-w-3xl">
            The pieces our clients return for, again and again.
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {bestSellers().map((p, i) => (
            <ProductCard key={p.id} p={p} delay={i * 100} />
          ))}
        </div>
      </section>
      <About />
      <VideoLookbook />
      <Why />
      <Testimonials />
      <Instagram />
      <VisitStore />
    </div>
  );
}
