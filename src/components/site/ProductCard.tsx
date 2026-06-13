import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { ngn, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { productWhatsAppUrl } from "@/lib/whatsapp";

export function ProductCard({ p, delay = 0 }: { p: Product; delay?: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({ id: p.id, size: p.sizes[0], color: p.colors[0], qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const revealMap = [
    { x: -72, y: 34, rotate: -2.5 },
    { x: 72, y: 28, rotate: 2 },
    { x: 0, y: 78, rotate: 0 },
    { x: -54, y: -36, rotate: 1.8 },
    { x: 58, y: -30, rotate: -1.8 },
    { x: 28, y: 68, rotate: 1.2 },
  ];
  const direction = revealMap[Math.floor(delay / 60) % revealMap.length];
  const imageShift = { x: Math.round(direction.x * -0.12), y: Math.round(direction.y * -0.12) };

  return (
    <div
      className="product-card group reveal flex flex-col"
      style={
        {
          transitionDelay: `${delay}ms`,
          "--reveal-x": `${direction.x}px`,
          "--reveal-y": `${direction.y}px`,
          "--reveal-rotate": `${direction.rotate}deg`,
          "--reveal-scale": "0.975",
          "--image-reveal-x": `${imageShift.x}px`,
          "--image-reveal-y": `${imageShift.y}px`,
        } as CSSProperties
      }
    >
      <Link
        to="/product/$id"
        params={{ id: p.id }}
        className="block relative aspect-[4/5] overflow-hidden bg-[color:var(--cream)] mb-3"
      >
        <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {p.tag && (
          <span className="absolute top-3 left-3 bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]">
            {p.tag}
          </span>
        )}
        <span className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 bg-background/90 px-3 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-foreground transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View finish and fit
        </span>
      </Link>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-lg">{p.name}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {ngn(p.price)} - <span className="capitalize">{p.category}</span>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={handleAdd}
          className="min-h-10 bg-[color:var(--accent)] px-2 py-2.5 text-[9px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-foreground sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
        >
          {added ? "Added" : "Add to Bag"}
        </button>
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="min-h-10 border border-foreground px-2 py-2.5 text-center text-[9px] uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
        >
          Details
        </Link>
      </div>
      <a
        href={productWhatsAppUrl(p.name, p.price, p.colors[0], p.sizes[0])}
        target="_blank"
        rel="noreferrer"
        className="mt-2 min-h-10 border border-[color:var(--accent)] px-2 py-2.5 text-center text-[9px] uppercase tracking-[0.14em] text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)] hover:text-white sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
      >
        WhatsApp Checkout
      </a>
    </div>
  );
}
