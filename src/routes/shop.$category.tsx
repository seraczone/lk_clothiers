import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { categories, productsByCategory, type CategoryKey } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/shop/$category")({
  head: ({ params }) => {
    const cat = categories.find((c) => c.key === params.category);
    const name = cat?.name ?? "Collection";
    return {
      meta: [
        { title: `${name} - LK Clothiers` },
        { name: "description", content: `Shop the ${name} collection from LK Clothiers.` },
      ],
    };
  },
  loader: ({ params }) => {
    const cat = categories.find((c) => c.key === params.category);
    if (!cat) throw notFound();
    return cat;
  },
  component: CategoryPage,
});

function CategoryPage() {
  const ref = useReveal<HTMLDivElement>();
  const cat = Route.useLoaderData();
  const items = productsByCategory(cat.key as CategoryKey);

  return (
    <div ref={ref}>
      <header className="relative h-[44svh] min-h-[320px] bg-[color:var(--cream)] overflow-hidden">
        <img
          src={cat.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-80"
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
            {categories.map((c) => (
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
              <ProductCard key={p.id} p={p} delay={i * 80} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
