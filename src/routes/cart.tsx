import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { useCart } from "@/lib/cart";
import { productById, ngn } from "@/lib/catalog";
import { checkoutWhatsAppUrl } from "@/lib/whatsapp";
import { useReveal } from "@/hooks/use-reveal";
import { fallbackImageForProduct, handleImageFallback } from "@/lib/product-images";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart - LK Clothiers" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQty, subtotal, count } = useCart();
  const ref = useReveal<HTMLDivElement>();
  const whatsappCheckout = checkoutWhatsAppUrl(items, subtotal);

  return (
    <div ref={ref} className="px-6 lg:px-12 py-16 lg:py-20 max-w-[1200px] mx-auto">
      <div className="reveal" style={{ "--reveal-x": "-28px" } as CSSProperties}>
        <p className="eyebrow mb-3">Your Cart</p>
        <h1 className="font-display text-4xl md:text-5xl mb-12">Cart ({count})</h1>
      </div>

      {items.length === 0 ? (
        <div className="border border-border p-12 text-center reveal">
          <p className="font-display text-2xl mb-4">Your cart is empty.</p>
          <p className="text-sm text-muted-foreground mb-8">Begin with our latest arrivals.</p>
          <Link
            to="/shop"
            className="inline-block bg-[color:var(--accent)] text-white px-7 py-4 text-xs uppercase tracking-[0.25em]"
          >
            Shop Collection
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div className="divide-y divide-border border-y border-border">
            {items.map((it, i) => {
              const p = productById(it.id);
              const name = it.name ?? p?.name;
              const image = it.image ?? p?.image;
              const unitPrice = it.variantPrice ?? it.price ?? p?.price ?? 0;
              if (!name || !image) return null;
              const fallbackImage = fallbackImageForProduct(p ?? { id: it.id, category: "" });
              const variantLabel =
                it.variantType && it.variantValue ? `${it.variantType}: ${it.variantValue}` : "";
              return (
                <div
                  key={`${it.id}-${it.size}-${it.color}-${it.variantId ?? ""}`}
                  className="py-6 grid grid-cols-[100px_1fr_auto] gap-4 lg:gap-8 items-center reveal"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <Link
                    to="/product/$id"
                    params={{ id: it.id }}
                    className="block aspect-[4/5] overflow-hidden bg-[color:var(--cream)]"
                  >
                    <img
                      src={image}
                      alt={name}
                      onError={(event) => handleImageFallback(event, fallbackImage)}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link
                      to="/product/$id"
                      params={{ id: it.id }}
                      className="font-display text-lg lk-link"
                    >
                      {name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {[it.color, it.size, variantLabel].filter(Boolean).join(" - ")}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() =>
                            setQty(it.id, it.size, it.color, it.qty - 1, it.variantId)
                          }
                          className="px-3 py-1"
                        >
                          -
                        </button>
                        <span className="px-3 tabular-nums">{it.qty}</span>
                        <button
                          onClick={() =>
                            setQty(it.id, it.size, it.color, it.qty + 1, it.variantId)
                          }
                          className="px-3 py-1"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(it.id, it.size, it.color, it.variantId)}
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground lk-link"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-lg tabular-nums">{ngn(unitPrice * it.qty)}</p>
                </div>
              );
            })}
          </div>
          <aside
            className="bg-[color:var(--cream)] p-8 h-fit reveal"
            style={{ "--reveal-x": "32px" } as CSSProperties}
          >
            <p className="font-display text-2xl mb-6">Order Summary</p>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{ngn(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="tabular-nums">NGN 0</dd>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-display text-lg">
                <dt>Total</dt>
                <dd className="tabular-nums">{ngn(subtotal)}</dd>
              </div>
            </dl>
            <a
              href={whatsappCheckout}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                event.preventDefault();
                const popup = window.open(whatsappCheckout, "_blank", "noopener,noreferrer");
                if (!popup) window.location.href = whatsappCheckout;
              }}
              className="mt-8 block text-center bg-[color:var(--accent)] text-white px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground transition-colors"
            >
              Checkout on WhatsApp
            </a>
            <Link
              to="/checkout"
              className="mt-3 block text-center border border-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
            >
              Use Checkout Form
            </Link>
            <Link
              to="/shop"
              className="mt-3 block text-center text-xs uppercase tracking-[0.25em] text-muted-foreground lk-link"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
