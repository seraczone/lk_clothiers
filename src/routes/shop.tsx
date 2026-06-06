import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { categories, products, ngn } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop - LK Clothiers" },
      {
        name: "description",
        content:
          "Shop premium modest fashion: kaftans, two-piece sets, workwear and glam pieces for women, girls and boys.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const ref = useReveal<HTMLDivElement>();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "low" | "high">("new");
  const [max, setMax] = useState(300000);

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    let list = products.filter(
      (p) => p.price <= max && (p.name.toLowerCase().includes(term) || p.category.includes(term)),
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, sort, max]);

  return (
    <div ref={ref} className="px-6 lg:px-12 py-16 lg:py-20 max-w-[1400px] mx-auto">
      <header className="mb-12 reveal" style={{ "--reveal-x": "-28px" } as CSSProperties}>
        <p className="eyebrow mb-3">Shop LK Clothiers</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl">
          Collections made to be lived in.
        </h1>
        <p className="text-sm text-muted-foreground mt-4 max-w-xl leading-relaxed">
          Explore refined modest pieces by collection, occasion, and family fit. Every path to
          checkout keeps WhatsApp close for quick confirmation.
        </p>
      </header>

      <section className="mb-14 reveal" style={{ "--reveal-x": "28px" } as CSSProperties}>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="eyebrow mb-2">Browse by Collection</p>
            <h2 className="font-display text-3xl md:text-4xl">
              Choose the edit that fits the moment.
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-block lk-link text-xs uppercase tracking-[0.25em]"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((c, i) => (
            <Link
              key={c.key}
              to="/shop/$category"
              params={{ category: c.key }}
              className="collection-tile reveal group relative aspect-[4/5] overflow-hidden bg-[color:var(--cream)]"
              style={
                {
                  transitionDelay: `${i * 60}ms`,
                  "--reveal-x": `${i % 2 === 0 ? -34 : 34}px`,
                  "--reveal-y": `${i % 3 === 0 ? 26 : 10}px`,
                } as CSSProperties
              }
            >
              <img
                src={c.image}
                alt={`${c.name} collection`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-background">
                <p className="font-display text-xl">{c.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-background/75">
                  {c.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-8 reveal">
          <div>
            <p className="eyebrow block mb-3">Collections</p>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <Link
                to="/shop"
                className="px-3 py-2 border border-foreground bg-foreground text-background text-[10px] uppercase tracking-[0.2em] text-center transition-colors"
              >
                All pieces
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.key}
                  to="/shop/$category"
                  params={{ category: category.key }}
                  className="px-3 py-2 border border-border text-[10px] uppercase tracking-[0.2em] text-center hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <label className="eyebrow block mb-3">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pieces or collection"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label className="eyebrow block mb-3">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "new" | "low" | "high")}
              className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:border-foreground transition-colors"
            >
              <option value="new">Newest</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
          <div>
            <label className="eyebrow block mb-3">Max Price - {ngn(max)}</label>
            <input
              type="range"
              min={40000}
              max={300000}
              step={5000}
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-full accent-[color:var(--accent)]"
            />
          </div>
        </aside>

        <section>
          <p className="text-xs text-muted-foreground mb-6 reveal">{filtered.length} pieces</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} p={p} delay={i * 70} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
