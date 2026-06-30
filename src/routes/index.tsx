import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, type CSSProperties } from "react";
import amaraPrintDressFront from "@/assets/amara-print-dress-front.png";
import heroImg from "@/assets/hero-collection.png";
import { ProductCard } from "@/components/site/ProductCard";
import { useSiteContent } from "@/hooks/use-site-content";
import { useStoreCategories } from "@/hooks/use-store-categories";
import { useStoreProducts } from "@/hooks/use-store-products";
import type { AdminCategory, AdminProduct, ContentState } from "@/lib/admin-data";
import { genericWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import atelierBoardroomWeekend from "@/assets/atelier-boardroom-weekend.mp4";
import atelierGirlsEid from "@/assets/atelier-girls-eid.mp4";
import silkFlareVideo from "@/assets/silk-flare-video.mp4";
import { absoluteUrl, siteDescription } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LK Clothiers — Modest Fashion, Timeless Elegance" },
      {
        name: "description",
        content: siteDescription,
      },
      { property: "og:title", content: "LK Clothiers — Modest Fashion, Timeless Elegance" },
      {
        property: "og:description",
        content: siteDescription,
      },
      { property: "og:url", content: absoluteUrl("/") },
      { name: "twitter:title", content: "LK Clothiers - Modest Fashion, Timeless Elegance" },
      { name: "twitter:description", content: siteDescription },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: Index,
});

const lookbookVideos = [
  { src: atelierBoardroomWeekend },
  { src: atelierGirlsEid },
  { src: silkFlareVideo },
];

const scatterDirections = [
  { x: -28, y: -18, rotate: -9 },
  { x: 24, y: -22, rotate: 8 },
  { x: -18, y: 24, rotate: 7 },
  { x: 30, y: 18, rotate: -8 },
  { x: 0, y: -30, rotate: 4 },
  { x: -30, y: 8, rotate: -5 },
];

function ScatterText({
  text,
  className = "",
  delayStep = 45,
}: {
  text: string;
  className?: string;
  delayStep?: number;
}) {
  return (
    <span className={`scatter-text ${className}`}>
      {text.split(" ").map((word, index) => {
        const direction = scatterDirections[index % scatterDirections.length];
        return (
          <span
            key={`${word}-${index}`}
            className="scatter-word"
            style={
              {
                "--scatter-x": `${direction.x}px`,
                "--scatter-y": `${direction.y}px`,
                "--scatter-rotate": `${direction.rotate}deg`,
                "--scatter-delay": `${index * delayStep}ms`,
              } as CSSProperties
            }
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}

function VideoLookbook({ content }: { content: ContentState }) {
  return (
    <section className="bg-foreground px-6 py-18 text-background lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex items-end justify-between reveal">
          <div>
            <p className="eyebrow mb-4 text-background/60">{content.home.lookbookEyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl">
              {content.home.lookbookTitle}
              <br />
              <em className="italic text-[color:var(--accent)]">{content.home.lookbookAccent}</em>.
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-block lk-link text-xs uppercase tracking-[0.25em] text-background/80"
          >
            {content.home.lookbookCta} →
          </Link>
        </div>
        <div className="lookbook-scroll">
          {lookbookVideos.map((v, i) => {
            const copy = content.home.lookbookVideos[i];
            return (
              <figure
                key={i}
                className="relative aspect-[9/14] overflow-hidden bg-background/10 reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <video
                  src={v.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-foreground/80 to-transparent text-background">
                  <p className="font-display text-xl">{copy?.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] opacity-80 mt-1">
                    {copy?.caption}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function useReveal(observeKey = "") {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = Array.from(ref.current?.querySelectorAll<HTMLElement>(".reveal") ?? []);
    const revealVisibleElements = () => {
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
          el.classList.add("is-in");
        }
      });
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    const frame = window.requestAnimationFrame(revealVisibleElements);
    window.addEventListener("pageshow", revealVisibleElements);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", revealVisibleElements);
      io.disconnect();
    };
  }, [observeKey]);
  return ref;
}

function Hero({ content }: { content: ContentState }) {
  return (
    <section className="hero-sticky relative min-h-[90svh]">
      <div className="absolute inset-0 overflow-hidden bg-foreground">
        <img
          src={heroImg}
          alt="LK Clothiers dresses on display"
          className="hero-zoom-image absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-foreground/10" />
      <div className="relative z-10 flex items-end lg:items-center min-h-[90svh] px-6 lg:px-12 pb-16 lg:pb-0">
        <div className="hero-fade-text max-w-xl">
          <p className="eyebrow mb-6 text-white/80">{content.home.heroEyebrow}</p>
          <h1 className="hero-headline text-3xl leading-[1.16] text-white sm:text-4xl md:text-[2.8rem] lg:text-5xl">
            {content.home.heroLineOne}
            <br />
            <em className="italic text-[color:var(--accent)]">{content.home.heroAccent}</em>{" "}
            {content.home.heroLineTwo}
          </h1>
          <p className="hero-made mt-3 text-xl italic leading-none text-white md:text-2xl">
            <span className="text-[color:var(--accent)]">Made</span>{" "}
            <span className="text-white">for you.</span>
          </p>
          <p className="mt-6 text-base text-white/80 leading-relaxed max-w-sm">
            {content.home.heroCopy}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-[color:var(--accent)] text-white px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-foreground transition-colors"
            >
              {content.home.primaryCta}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={genericWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-white/60 px-7 py-4 text-xs uppercase tracking-[0.25em] text-white hover:bg-white hover:text-foreground transition-colors"
            >
              {content.home.secondaryCta}
            </a>
          </div>
          <div className="mt-12 flex items-center gap-8 text-xs text-white/70">
            <span>{content.home.heroMetaLeft}</span>
            <span className="w-8 h-px bg-white/30" />
            <span>{content.home.heroMetaRight}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee({ content }: { content: ContentState }) {
  const row = [
    ...content.home.marqueeItems,
    ...content.home.marqueeItems,
    ...content.home.marqueeItems,
  ];
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

function Categories({
  content,
  categories,
}: {
  content: ContentState;
  categories: AdminCategory[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-18 lg:px-12 lg:py-24">
      <div className="mb-10 flex items-end justify-between reveal">
        <div>
          <p className="eyebrow mb-4">{content.home.collectionsEyebrow}</p>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.05] md:text-5xl">
            {content.home.collectionsTitle}
          </h2>
        </div>
        <Link
          to="/shop"
          className="hidden md:inline-block lk-link text-xs uppercase tracking-[0.25em]"
        >
          {content.home.collectionsCta} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {categories.map((c, i) => (
          <Link
            to="/shop/$category"
            params={{ category: c.key }}
            key={c.key}
            className="product-card collection-tile group relative aspect-[4/5] overflow-hidden bg-[color:var(--cream)] reveal"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <img
              src={c.image}
              alt={`${c.name} collection`}
              loading="lazy"
              className={`w-full h-full ${
                c.key === "adire" || c.key === "silk" ? "object-contain" : "object-cover"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-background">
              <p className="font-display text-xl md:text-2xl">{c.name}</p>
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
  columns = 4,
  cta,
}: {
  items: AdminProduct[];
  title: string;
  eyebrow: string;
  columns?: 4 | 5;
  cta?: { label: string; to: string };
}) {
  const gridClass =
    columns === 5
      ? "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5 lg:gap-5"
      : "grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-6";

  return (
    <section className="featured-product px-6 lg:px-12 py-24 lg:py-32 bg-[color:var(--cream)]">
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
        <div className={gridClass}>
          {items.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={i * 80} showDetails={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

function About({ content }: { content: ContentState }) {
  return (
    <section className="relative z-10 grid lg:grid-cols-2 bg-foreground text-background">
      <div
        className="relative min-h-[60svh] overflow-hidden bg-[#ed6a12] lg:min-h-[80svh] reveal"
        style={{ "--reveal-y": "34px" } as CSSProperties}
      >
        <img
          src={amaraPrintDressFront}
          alt="LK atelier"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain object-center"
        />
      </div>
      <div className="flex items-center px-6 lg:px-20 py-24 lg:py-0">
        <div className="max-w-lg reveal">
          <p className="eyebrow mb-6 text-background/60">{content.home.aboutEyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            {content.home.aboutHeadline}
          </h2>
          <p className="mt-8 text-background/70 leading-relaxed">{content.home.aboutCopy}</p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-background/80">
            {content.home.stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl text-[color:var(--accent)]">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 border border-background/40 px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-background hover:text-foreground transition-colors"
          >
            {content.home.aboutCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Why({ content }: { content: ContentState }) {
  return (
    <section className="why-motion px-6 lg:px-12 py-24 lg:py-32 max-w-[1400px] mx-auto">
      <p
        className="eyebrow mb-4 reveal"
        style={
          {
            "--reveal-x": "-26px",
            "--reveal-y": "-18px",
            "--reveal-rotate": "-5deg",
          } as CSSProperties
        }
      >
        <ScatterText text={content.home.whyEyebrow} />
      </p>
      <h2
        className="font-display text-4xl md:text-5xl mb-16 max-w-2xl reveal"
        style={
          {
            "--reveal-x": "32px",
            "--reveal-y": "-22px",
            "--reveal-rotate": "4deg",
          } as CSSProperties
        }
      >
        <ScatterText text={content.home.whyTitle} delayStep={38} />
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {content.home.reasons.map((r, i) => (
          <div
            key={r.title}
            className="bg-background p-8 lg:p-10 reveal"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <p className="font-display text-[color:var(--accent)] text-2xl mb-6">0{i + 1}</p>
            <h3 className="font-display text-2xl mb-3">
              <ScatterText text={r.title} delayStep={55} />
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <ScatterText text={r.description} delayStep={28} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ content }: { content: ContentState }) {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 bg-[color:var(--cream)]">
      <div className="max-w-[1400px] mx-auto">
        <p className="eyebrow mb-4 reveal">{content.home.testimonialsEyebrow}</p>
        <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-2xl reveal">
          {content.home.testimonialsTitle}
        </h2>
      </div>
      <div className="testimonial-slider reveal overflow-hidden">
        <div className="testimonial-track flex w-max">
          {[0, 1].map((group) => (
            <div
              key={group}
              aria-hidden={group === 1}
              className="testimonial-group flex gap-6 pr-6 lg:gap-8 lg:pr-8"
            >
              {content.home.testimonials.map((t, i) => (
                <figure
                  key={`${group}-${i}`}
                  className="testimonial-card w-[min(82vw,380px)] flex-none bg-background p-8 lg:w-[420px] lg:p-10"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="text-[color:var(--accent)] text-sm tracking-widest mb-6">
                    ★★★★★
                  </div>
                  <blockquote className="font-display text-xl lg:text-2xl leading-snug text-foreground">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {t.name} · <span className="text-foreground">{t.city}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instagram({
  content,
  categories,
}: {
  content: ContentState;
  categories: AdminCategory[];
}) {
  if (categories.length === 0) return null;

  const imgs = categories.slice(0, 6).map((c) => c.image);
  const instagramUrl = "https://instagram.com/lk_clothiers";
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-12 reveal">
        <div>
          <p className="eyebrow mb-4">{content.home.instagramEyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl">{content.home.instagramHandle}</h2>
        </div>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="lk-link text-xs uppercase tracking-[0.25em]"
        >
          {content.home.instagramCta} →
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
              className="w-full h-full object-contain"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

function VisitStore({ content }: { content: ContentState }) {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="bg-[color:var(--cream)] flex items-center px-6 lg:px-20 py-24">
        <div className="max-w-md reveal">
          <p className="eyebrow mb-4">{content.home.visitEyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl mb-8">{content.home.visitTitle}</h2>
          <div className="space-y-5 text-sm text-foreground/80">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                {content.home.addressLabel}
              </p>
              <p>{content.general.address}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                {content.home.hoursLabel}
              </p>
              <p>{content.general.hours}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                {content.home.contactLabel}
              </p>
              <p>
                {content.general.phoneDisplay || WHATSAPP_DISPLAY}
                <br />
                {content.general.email}
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[color:var(--accent)] transition-colors"
          >
            {content.home.directionsCta} →
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
          <p className="font-display text-xl">{content.home.mapTitle}</p>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
            {content.home.mapLocation}
          </p>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const content = useSiteContent();
  const categories = useStoreCategories();
  const { products } = useStoreProducts();
  const revealKey = products.map((product) => product.id).join("|");
  const ref = useReveal(revealKey);
  const taggedArrivals = products.filter(
    (product) => product.tag === "New" || product.tag === "Signature",
  );
  const arrivalProducts = taggedArrivals.length > 0 ? taggedArrivals : products.slice(0, 5);
  const bestSellerProducts = products.filter((product) => product.bestSeller).slice(0, 4);

  return (
    <div ref={ref} className="scroll-smooth">
      <Hero content={content} />
      <Marquee content={content} />
      <Categories content={content} categories={categories} />
      <ProductGrid
        items={arrivalProducts}
        eyebrow={content.home.newArrivalsEyebrow}
        title={content.home.newArrivalsTitle}
        columns={5}
        cta={{ label: content.home.newArrivalsCta, to: "/shop" }}
      />
      <section className="relative z-10 px-6 lg:px-12 py-24 lg:py-32 max-w-[1400px] mx-auto bg-background">
        <div className="reveal mb-14">
          <p className="eyebrow mb-4">{content.home.bestSellersEyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl max-w-3xl">
            {content.home.bestSellersTitle}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {bestSellerProducts.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={i * 100} showDetails={false} />
          ))}
        </div>
      </section>
      <About content={content} />
      <VideoLookbook content={content} />
      <Why content={content} />
      <Testimonials content={content} />
      <Instagram content={content} categories={categories} />
      <VisitStore content={content} />
    </div>
  );
}
