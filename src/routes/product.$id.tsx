import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { productById, ngn } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { productWhatsAppUrl } from "@/lib/whatsapp";
import { useReveal } from "@/hooks/use-reveal";
import { seedProducts } from "@/lib/admin-data";
import { useStoreProducts } from "@/hooks/use-store-products";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = productById(params.id);
    return {
      meta: [
        { title: p ? `${p.name} - LK Clothiers` : "LK Clothiers" },
        { name: "description", content: p?.description ?? "" },
        { property: "og:image", content: p?.image ?? "" },
      ],
    };
  },
  loader: ({ params }) => params.id,
  component: ProductPage,
});

function ProductPage() {
  const productId = Route.useLoaderData();
  const { products, isLoading } = useStoreProducts();
  const product = useMemo(
    () =>
      products.find((item) => item.id === productId) ??
      (isLoading ? seedProducts.find((item) => item.id === productId) : undefined),
    [isLoading, productId, products],
  );
  const { add } = useCart();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [added, setAdded] = useState(false);
  const [active, setActive] = useState("");
  const ref = useReveal<HTMLDivElement>();

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0] ?? "");
    setColor(product.colors[0] ?? "");
    setActive((product.gallery ?? [product.image])[0] ?? "");
    setQty((currentQty) => Math.min(Math.max(1, currentQty), Math.max(1, product.stock)));
  }, [product]);

  if (!product) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="eyebrow mb-3">Product</p>
        <h1 className="font-display text-4xl">This product is not available.</h1>
        <Link
          to="/shop"
          className="mt-6 inline-flex bg-foreground px-5 py-3 text-xs uppercase tracking-[0.2em] text-background"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const gallery = product.gallery ?? [product.image];
  const inStock = product.stock > 0;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    if (!inStock) return;
    add({ id: product.id, size, color, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div ref={ref}>
      <div className="px-6 lg:px-12 py-6 max-w-[1400px] mx-auto text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Link to="/shop" className="lk-link">
          Shop
        </Link>{" "}
        /{" "}
        <Link
          to="/shop/$category"
          params={{ category: product.category }}
          className="lk-link capitalize"
        >
          {product.category}
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </div>

      <section className="px-6 lg:px-12 pb-20 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="reveal" style={{ "--reveal-x": "-36px" } as CSSProperties}>
          <div
            className="relative aspect-[4/5] bg-[color:var(--cream)] overflow-hidden cursor-zoom-in"
            onClick={() => setZoom(true)}
          >
            <img src={active} alt={product.name} className="w-full h-full object-contain" />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]">
                {product.tag}
              </span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 mt-4">
              {gallery.map((g: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActive(g)}
                  className={`w-20 h-24 overflow-hidden border ${active === g ? "border-foreground" : "border-border"}`}
                >
                  <img src={g} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="reveal" style={{ "--reveal-x": "36px" } as CSSProperties}>
          <p className="eyebrow mb-4 capitalize">{product.category}</p>
          <h1 className="font-display text-4xl lg:text-5xl leading-tight">{product.name}</h1>
          <p className="mt-4 font-display text-2xl text-[color:var(--accent)]">
            {ngn(product.price)}
          </p>
          <p
            className={`mt-4 inline-flex border px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${
              inStock
                ? "border-[color:var(--accent)]/40 text-[color:var(--accent)]"
                : "border-[color:var(--destructive)]/40 text-[color:var(--destructive)]"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </p>
          <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="mt-10">
            <p className="eyebrow mb-3">
              Color / <span className="text-foreground">{color}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border ${color === c ? "border-foreground bg-foreground text-background" : "border-border"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="eyebrow mb-3">
              Size / <span className="text-foreground">{size}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border ${size === s ? "border-foreground bg-foreground text-background" : "border-border"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={!inStock}
                className="px-4 py-3 disabled:cursor-not-allowed disabled:opacity-40"
              >
                -
              </button>
              <span className="px-4 tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={!inStock || qty >= product.stock}
                className="px-4 py-3 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="flex-1 bg-[color:var(--accent)] text-white px-7 py-4 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!inStock ? "Out of Stock" : added ? "Added to bag" : "Add to Bag"}
            </button>
          </div>

          {inStock ? (
            <a
              href={productWhatsAppUrl(product.name, product.price, color, size, qty)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-center border border-[color:var(--accent)] text-[color:var(--accent)] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[color:var(--accent)] hover:text-white transition-colors"
            >
              Checkout on WhatsApp
            </a>
          ) : (
            <span className="mt-3 block cursor-not-allowed border border-border px-7 py-4 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Checkout Unavailable
            </span>
          )}

          <ul className="mt-10 space-y-3 text-xs text-muted-foreground border-t border-border pt-6">
            <li>- Free delivery in Abuja over NGN 100,000</li>
            <li>- Nationwide shipping 2-5 days</li>
            <li>- Bespoke alterations available. Chat to our atelier.</li>
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 lg:px-12 py-20 bg-[color:var(--cream)]">
          <div className="max-w-[1400px] mx-auto">
            <div className="reveal">
              <p className="eyebrow mb-3">You may also like</p>
              <h2 className="font-display text-3xl md:text-4xl mb-10">From the same collection.</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => (
                <Link
                  to="/product/$id"
                  params={{ id: p.id }}
                  key={p.id}
                  className="product-card group reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-background mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <p className="font-display text-lg">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{ngn(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {zoom && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/90 backdrop-blur p-4 flex items-center justify-center cursor-zoom-out"
          onClick={() => setZoom(false)}
        >
          <img src={active} alt={product.name} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
