import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { ngn, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { getProductReviewSummary, ratingLabel } from "@/lib/reviews";
import { fallbackImageForProduct, handleImageFallback } from "@/lib/product-images";

export function ProductCard({
  p,
  delay = 0,
  showDetails = true,
  showActions = true,
}: {
  p: Product;
  delay?: number;
  showDetails?: boolean;
  showActions?: boolean;
}) {
  const { add, items, remove } = useCart();
  const [added, setAdded] = useState(false);
  const stock =
    typeof (p as Product & { stock?: number }).stock === "number"
      ? (p as Product & { stock: number }).stock
      : undefined;
  const inStock = stock === undefined || stock > 0;
  const defaultSize = p.sizes[0];
  const defaultColor = p.colors[0];
  const reviewSummary = getProductReviewSummary(p);
  const fallbackImage = fallbackImageForProduct(p);
  const variants = p.useVariants ? (p.variants ?? []) : [];
  const defaultVariant = variants.find((variant) => variant.stock > 0) ?? variants[0];
  const displayPrice = defaultVariant?.price ?? p.price;
  const isInCart = items.some(
    (item) =>
      item.id === p.id &&
      item.size === defaultSize &&
      item.color === defaultColor &&
      (item.variantId ?? "") === (defaultVariant?.id ?? ""),
  );

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;

    if (isInCart) {
      remove(p.id, defaultSize, defaultColor, defaultVariant?.id);
      setAdded(false);
      return;
    }

    add({
      id: p.id,
      size: defaultSize,
      color: defaultColor,
      qty: 1,
      name: p.name,
      image: p.image,
      price: p.price,
      variantId: defaultVariant?.id,
      variantType: defaultVariant?.variantType,
      variantValue: defaultVariant?.variantValue,
      variantSku: defaultVariant?.sku,
      variantPrice: defaultVariant?.price,
    });
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
        <img
          src={p.image || fallbackImage}
          alt={p.name}
          loading="lazy"
          onError={(event) => handleImageFallback(event, fallbackImage)}
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {p.tag && (
          <span className="absolute top-3 left-3 bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]">
            {p.tag}
          </span>
        )}
        {!inStock && (
          <span className="absolute top-3 right-3 bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--destructive)]">
            Out
          </span>
        )}
        <span className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 bg-background/90 px-3 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-foreground transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View finish and fit
        </span>
      </Link>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-lg">{p.name}</p>
      </div>
      <div
        className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground"
        aria-label={`Customer rating ${ratingLabel(reviewSummary)}`}
      >
        <span className="flex text-[color:var(--accent)]" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={12}
              strokeWidth={1.8}
              className={index < Math.round(reviewSummary.ratingValue) ? "fill-current" : ""}
            />
          ))}
        </span>
        <span>{ratingLabel(reviewSummary)}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {ngn(displayPrice)}
        {variants.length > 1 ? "+" : ""} - <span className="capitalize">{p.category}</span>
      </p>
      {showActions && (
        <div className={`mt-3 grid gap-2 ${showDetails ? "grid-cols-2" : "grid-cols-1"}`}>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className="min-h-10 rounded-[6px] bg-[color:var(--accent)] px-2 py-2.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white shadow-sm transition-colors hover:bg-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
          >
            {!inStock ? "Out of Stock" : isInCart ? "Remove" : added ? "Added" : "Add to Bag"}
          </button>
          {showDetails && (
            <Link
              to="/product/$id"
              params={{ id: p.id }}
              className="min-h-10 rounded-[6px] border border-foreground/60 bg-background/70 px-2 py-2.5 text-center text-[9px] font-medium uppercase tracking-[0.14em] transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
            >
              Details
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
