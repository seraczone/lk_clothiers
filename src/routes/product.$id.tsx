import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { CSSProperties } from "react";
import { productById, ngn, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { productWhatsAppUrl } from "@/lib/whatsapp";
import { useReveal } from "@/hooks/use-reveal";
import { seedProducts } from "@/lib/admin-data";
import { useStoreProducts } from "@/hooks/use-store-products";
import {
  getSeedReviews,
  categoryName,
  productJsonLd,
  ratingLabel,
  readStoredReviews,
  reviewProductLine,
  saveStoredReview,
  summarizeReviews,
  type CustomerReview,
} from "@/lib/reviews";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  collectionUrl,
  productMetaDescription,
  productUrl,
} from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = productById(params.id);
    return {
      meta: [
        { title: p ? `${p.name} - LK Clothiers` : "LK Clothiers" },
        { name: "description", content: p ? productMetaDescription(p) : "" },
        { name: "robots", content: p ? "index,follow" : "noindex,follow" },
        { name: "googlebot", content: "index,follow,max-image-preview:large" },
        { property: "og:title", content: p ? `${p.name} - LK Clothiers` : "LK Clothiers" },
        { property: "og:description", content: p ? productMetaDescription(p) : "" },
        { property: "og:type", content: "product" },
        { property: "og:url", content: p ? productUrl(p.id) : absoluteUrl("/shop") },
        { property: "og:image", content: p?.image ?? "" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p ? `${p.name} - LK Clothiers` : "LK Clothiers" },
        { name: "twitter:description", content: p ? productMetaDescription(p) : "" },
        { name: "twitter:image", content: p?.image ?? "" },
      ],
      links: [
        {
          rel: "canonical",
          href: p ? productUrl(p.id) : absoluteUrl("/shop"),
        },
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
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [zoom, setZoom] = useState(false);
  const [added, setAdded] = useState(false);
  const [active, setActive] = useState("");
  const [storedReviews, setStoredReviews] = useState<CustomerReview[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewCity, setReviewCity] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSaved, setReviewSaved] = useState(false);
  const ref = useReveal<HTMLDivElement>();

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0] ?? "");
    setColor(product.colors[0] ?? "");
    setSelectedVariantId(
      product.useVariants
        ? (product.variants?.find((variant) => variant.stock > 0)?.id ??
            product.variants?.[0]?.id ??
            "")
        : "",
    );
    setActive((product.gallery ?? [product.image])[0] ?? "");
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const variants = product.useVariants ? (product.variants ?? []) : [];
    const selectedVariant =
      variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
    const maxStock = selectedVariant?.stock ?? product.stock;
    setQty((currentQty) => Math.min(Math.max(1, currentQty), Math.max(1, maxStock)));
  }, [product, selectedVariantId]);

  useEffect(() => {
    setStoredReviews(readStoredReviews(productId));
  }, [productId]);

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
  const variants = product.useVariants ? (product.variants ?? []) : [];
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  const selectedPrice = selectedVariant?.price ?? product.price;
  const selectedStock = selectedVariant?.stock ?? product.stock;
  const selectedVariantLabel = selectedVariant
    ? `${selectedVariant.variantType}: ${selectedVariant.variantValue}`
    : "";
  const inStock = selectedStock > 0;
  const seedReviews = getSeedReviews(product);
  const reviews = [...storedReviews, ...seedReviews];
  const reviewSummary = summarizeReviews(reviews);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    if (!inStock) return;
    add({
      id: product.id,
      size,
      color,
      qty,
      name: product.name,
      image: product.image,
      price: product.price,
      variantId: selectedVariant?.id,
      variantType: selectedVariant?.variantType,
      variantValue: selectedVariant?.variantValue,
      variantSku: selectedVariant?.sku,
      variantPrice: selectedVariant?.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const author = reviewName.trim();
    const body = reviewBody.trim();
    if (!author || !body) return;

    const review: CustomerReview = {
      id: `review-${product.id}-${Date.now()}`,
      productId: product.id,
      author,
      city: reviewCity.trim() || "Nigeria",
      rating: reviewRating,
      title: reviewTitle.trim() || "Customer review",
      body,
      datePublished: new Date().toISOString().slice(0, 10),
    };

    saveStoredReview(review);
    setStoredReviews((current) => [review, ...current]);
    setReviewName("");
    setReviewCity("");
    setReviewTitle("");
    setReviewBody("");
    setReviewRating(5);
    setReviewSaved(true);
    window.setTimeout(() => setReviewSaved(false), 2400);
  };

  return (
    <div ref={ref}>
      <JsonLd data={productJsonLd(product, reviews)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Shop", url: absoluteUrl("/shop") },
          { name: categoryName(product.category), url: collectionUrl(product.category) },
          { name: product.name, url: productUrl(product.id) },
        ])}
      />
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
            {ngn(selectedPrice)}
          </p>
          <div
            className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
            aria-label={`Customer rating ${ratingLabel(reviewSummary)}`}
          >
            <span className="flex text-[color:var(--accent)]" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={17}
                  strokeWidth={1.8}
                  className={index < Math.round(reviewSummary.ratingValue) ? "fill-current" : ""}
                />
              ))}
            </span>
            <a href="#reviews" className="lk-link">
              {ratingLabel(reviewSummary)}
            </a>
          </div>
          <p
            className={`mt-4 inline-flex border px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${
              inStock
                ? "border-[color:var(--accent)]/40 text-[color:var(--accent)]"
                : "border-[color:var(--destructive)]/40 text-[color:var(--destructive)]"
            }`}
          >
            {inStock ? `${selectedStock} In Stock` : "Out of Stock"}
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

          {variants.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-3">
                {selectedVariant?.variantType ?? "Variant"} /{" "}
                <span className="text-foreground">{selectedVariant?.variantValue}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setQty((currentQty) =>
                        Math.min(Math.max(1, currentQty), Math.max(1, variant.stock)),
                      );
                    }}
                    className={`border px-4 py-2 text-left text-xs uppercase tracking-[0.16em] ${
                      selectedVariant?.id === variant.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border"
                    }`}
                  >
                    <span className="block">{variant.variantValue}</span>
                    <span className="mt-1 block text-[10px] opacity-75">{ngn(variant.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
                onClick={() => setQty((q) => Math.min(selectedStock, q + 1))}
                disabled={!inStock || qty >= selectedStock}
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
              href={productWhatsAppUrl(
                product.name,
                selectedPrice,
                color,
                size,
                qty,
                selectedVariantLabel,
              )}
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

      <ReviewsSection
        product={product}
        reviews={reviews}
        reviewSummary={reviewSummary}
        reviewName={reviewName}
        reviewCity={reviewCity}
        reviewTitle={reviewTitle}
        reviewBody={reviewBody}
        reviewRating={reviewRating}
        reviewSaved={reviewSaved}
        onNameChange={setReviewName}
        onCityChange={setReviewCity}
        onTitleChange={setReviewTitle}
        onBodyChange={setReviewBody}
        onRatingChange={setReviewRating}
        onSubmit={handleReviewSubmit}
      />

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
                  <p className="text-xs text-muted-foreground">
                    {ngn(p.useVariants && p.variants?.[0] ? p.variants[0].price : p.price)}
                  </p>
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

function ReviewsSection({
  product,
  reviews,
  reviewSummary,
  reviewName,
  reviewCity,
  reviewTitle,
  reviewBody,
  reviewRating,
  reviewSaved,
  onNameChange,
  onCityChange,
  onTitleChange,
  onBodyChange,
  onRatingChange,
  onSubmit,
}: {
  product: Product;
  reviews: CustomerReview[];
  reviewSummary: ReturnType<typeof summarizeReviews>;
  reviewName: string;
  reviewCity: string;
  reviewTitle: string;
  reviewBody: string;
  reviewRating: number;
  reviewSaved: boolean;
  onNameChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onRatingChange: (value: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section
      id="reviews"
      className="border-y border-border bg-background px-6 py-18 lg:px-12 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="reveal">
          <p className="eyebrow mb-3">Customer Reviews</p>
          <h2 className="font-display text-3xl md:text-4xl">Rated by LK customers.</h2>
          <div className="mt-6 flex items-center gap-4">
            <div className="font-display text-5xl text-[color:var(--accent)]">
              {reviewSummary.ratingValue.toFixed(1)}
            </div>
            <div>
              <div className="flex text-[color:var(--accent)]" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    strokeWidth={1.8}
                    className={index < Math.round(reviewSummary.ratingValue) ? "fill-current" : ""}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {reviewSummary.reviewCount} verified-style reviews
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Share fit, fabric, and delivery notes for {reviewProductLine(product)}.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="border border-border bg-[color:var(--cream)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl">{review.title}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {review.author} - {review.city}
                    </p>
                  </div>
                  <div className="flex shrink-0 text-[color:var(--accent)]" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={13}
                        strokeWidth={1.8}
                        className={index < review.rating ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
              </article>
            ))}
          </div>

          <form onSubmit={onSubmit} className="border border-border p-5">
            <p className="eyebrow mb-4">Write a Review</p>
            <div className="mb-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em]">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onRatingChange(value)}
                      className="p-1 text-[color:var(--accent)]"
                      aria-label={`${value} star rating`}
                    >
                      <Star
                        size={20}
                        strokeWidth={1.8}
                        className={value <= reviewRating ? "fill-current" : ""}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <ReviewInput label="Name" value={reviewName} onChange={onNameChange} required />
            <ReviewInput label="City" value={reviewCity} onChange={onCityChange} />
            <ReviewInput label="Review title" value={reviewTitle} onChange={onTitleChange} />
            <label className="mb-4 block">
              <span className="mb-2 block text-xs uppercase tracking-[0.2em]">Review</span>
              <textarea
                value={reviewBody}
                onChange={(event) => onBodyChange(event.target.value)}
                required
                rows={5}
                className="w-full border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-foreground px-5 py-3 text-xs uppercase tracking-[0.22em] text-background transition-colors hover:bg-[color:var(--accent)]"
            >
              Submit Review
            </button>
            {reviewSaved && (
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
                Review added
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function ReviewInput({
  label,
  value,
  required,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-xs uppercase tracking-[0.2em]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground"
      />
    </label>
  );
}
