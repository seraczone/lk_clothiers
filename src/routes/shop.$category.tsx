import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { categories as seedCategories, type CategoryKey } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { useReveal } from "@/hooks/use-reveal";
import { useStoreProducts } from "@/hooks/use-store-products";
import { useStoreCategories } from "@/hooks/use-store-categories";
import { childCategories, productsForCategory, topLevelCategories } from "@/lib/category-utils";
import { collectionUrl } from "@/lib/seo";

export const Route = createFileRoute("/shop/$category")({
  head: ({ params }) => {
    const cat = seedCategories.find((c) => c.key === params.category);
    const name = cat?.name ?? "Collection";
    return {
      meta: [
        { title: `${name} - LK Clothiers` },
        { name: "description", content: `Shop the ${name} collection from LK Clothiers.` },
        { name: "robots", content: "index,follow" },
        { name: "googlebot", content: "index,follow,max-image-preview:large" },
        { property: "og:title", content: `${name} - LK Clothiers` },
        { property: "og:description", content: `Shop the ${name} collection from LK Clothiers.` },
        { property: "og:url", content: collectionUrl(params.category) },
        { name: "twitter:title", content: `${name} - LK Clothiers` },
        { name: "twitter:description", content: `Shop the ${name} collection from LK Clothiers.` },
      ],
      links: [{ rel: "canonical", href: collectionUrl(params.category) }],
    };
  },
  loader: ({ params }) => params.category,
  component: CategoryPage,
});

function CategoryPage() {
  const category = Route.useLoaderData();
  const categories = useStoreCategories();
  const cat = categories.find((item) => item.key === category);
  const { products } = useStoreProducts();
  const items = cat ? productsForCategory(products, categories, cat.key as CategoryKey) : [];
  const topCategories = topLevelCategories(categories);
  const childFilters = cat ? childCategories(categories, cat.key as CategoryKey) : [];
  const revealKey = items.map((product) => product.id).join("|");
  const ref = useReveal<HTMLDivElement>(`${category}:${revealKey}`);

  if (!cat) return null;
  const heroImage = cat.image;

  return (
    <div ref={ref}>
      <header className="relative h-[44svh] min-h-[320px] overflow-hidden bg-[color:var(--cream)]">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/20 to-transparent" />
        <div
          className="relative max-w-[1400px] mx-auto h-full px-6 lg:px-12 flex flex-col justify-end pb-10 reveal"
          style={{ "--reveal-x": "-32px" } as CSSProperties}
        >
          <p className="eyebrow mb-3 text-foreground/70">{cat.tagline}</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl">{cat.name}</h1>
          <p className="mt-4 max-w-xl text-sm text-foreground/70 leading-relaxed">
            A focused edit of LK pieces selected for fit, finish, and everyday confidence.
          </p>
        </div>
      </header>

      <nav className="border-b border-border bg-background/95">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4">
          <p className="eyebrow mb-3">Shop collections</p>
          <div className="flex gap-2 flex-wrap text-xs uppercase tracking-[0.2em]">
            <Link
              to="/shop"
              className="px-3 py-1.5 border border-border hover:border-foreground transition-colors"
            >
              All
            </Link>
            {topCategories.map((c) => (
              <Link
                key={c.key}
                to="/shop/$category"
                params={{ category: c.key }}
                className="px-3 py-1.5 border border-border hover:border-foreground transition-colors"
                activeProps={{
                  className: "px-3 py-1.5 border border-foreground bg-foreground text-background",
                }}
              >
                {c.name}
              </Link>
            ))}
          </div>
          {childFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em]">
              {childFilters.map((child) => (
                <Link
                  key={child.key}
                  to="/shop/$category"
                  params={{ category: child.key }}
                  className="px-3 py-1.5 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <section className="px-6 lg:px-12 py-16 lg:py-20 max-w-[1400px] mx-auto">
        <p className="text-xs text-muted-foreground mb-8 reveal">
          {items.length} pieces in {cat.name}
        </p>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground reveal">New pieces dropping soon.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((p, i) => (
              <ProductCard key={p.id} p={p} delay={i * 80} showActions={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
