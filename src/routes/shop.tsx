import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { categories, ngn } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { useReveal } from "@/hooks/use-reveal";
import { useSiteContent } from "@/hooks/use-site-content";
import { useStoreProducts } from "@/hooks/use-store-products";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop - LK Clothiers" },
      {
        name: "description",
        content:
          "Shop premium modest fashion: luxury kaftans, linen, adire, silk, boubou pieces, girls and boys collections.",
      },
      { name: "robots", content: "index,follow" },
      { name: "googlebot", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: "Shop - LK Clothiers" },
      {
        property: "og:description",
        content:
          "Shop premium modest fashion: luxury kaftans, linen, adire, silk, boubou pieces, girls and boys collections.",
      },
      { property: "og:url", content: absoluteUrl("/shop") },
      { name: "twitter:title", content: "Shop - LK Clothiers" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/shop") }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const categoryMatch = useMatch({ from: "/shop/$category", shouldThrow: false });
  const content = useSiteContent();
  const { products: shopProducts } = useStoreProducts();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "low" | "high">("new");
  const [max, setMax] = useState(300000);

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    let list = shopProducts.filter(
      (p) => p.price <= max && (p.name.toLowerCase().includes(term) || p.category.includes(term)),
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, sort, max, shopProducts]);
  const revealKey = filtered.map((product) => product.id).join("|");
  const ref = useReveal<HTMLDivElement>(revealKey);

  if (categoryMatch) {
    return <Outlet />;
  }

  return (
    <div ref={ref} className="px-6 lg:px-12 py-16 lg:py-20 max-w-[1400px] mx-auto">
      <header className="mb-12 reveal" style={{ "--reveal-x": "-28px" } as CSSProperties}>
        <p className="eyebrow mb-3">{content.shop.eyebrow}</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl">{content.shop.title}</h1>
        <p className="text-sm text-muted-foreground mt-4 max-w-xl leading-relaxed">
          {content.shop.copy}
        </p>
      </header>

      <section className="mb-12 reveal" style={{ "--reveal-x": "28px" } as CSSProperties}>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-2">{content.shop.browseEyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl">{content.shop.browseTitle}</h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-block lk-link text-xs uppercase tracking-[0.25em]"
          >
            {content.shop.viewAll}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
          {categories.map((c, i) => (
            <Link
              key={c.key}
              to="/shop/$category"
              params={{ category: c.key }}
              className="collection-tile reveal group relative aspect-[4/5] overflow-hidden border border-border bg-[color:var(--cream)]"
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
                className={`absolute inset-0 h-full w-full ${
                  c.key === "adire" ||
                  c.key === "boubou" ||
                  c.key === "shirt-dress" ||
                  c.key === "silk"
                    ? "object-contain"
                    : "object-cover"
                }`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-background">
                <p className="font-display text-lg leading-none">{c.name}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-background/75">
                  {c.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
        <aside className="reveal lg:sticky lg:top-28">
          <div className="space-y-7 border border-border bg-[color:var(--cream)] p-4">
            <div>
              <p className="eyebrow block mb-3">{content.shop.collectionsLabel}</p>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <Link
                  to="/shop"
                  className="px-3 py-2 border border-foreground bg-foreground text-background text-[10px] uppercase tracking-[0.2em] text-center transition-colors"
                >
                  {content.shop.allPieces}
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
              <label className="eyebrow block mb-3">{content.shop.searchLabel}</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={content.shop.searchPlaceholder}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div>
              <label className="eyebrow block mb-3">{content.shop.sortLabel}</label>
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
              <label className="eyebrow block mb-3">
                {content.shop.maxPriceLabel} - {ngn(max)}
              </label>
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
          </div>
        </aside>

        <section>
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4 reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {filtered.length} pieces
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {content.shop.resultsHelper} {ngn(max)}
            </p>
          </div>
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
