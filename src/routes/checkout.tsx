import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties, FormEvent, InputHTMLAttributes } from "react";
import { useCart } from "@/lib/cart";
import { productById, ngn } from "@/lib/catalog";
import { decrementProductStock } from "@/lib/admin-data";
import { checkoutWhatsAppUrl } from "@/lib/whatsapp";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout - LK Clothiers" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<"paystack" | "flutterwave" | "transfer">("paystack");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const shipping = subtotal > 100000 ? 0 : 5000;
  const whatsappCheckout = checkoutWhatsAppUrl(items, subtotal, shipping);
  const ref = useReveal<HTMLFormElement>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await decrementProductStock(items);
      setDone(true);
      clear();
      setTimeout(() => navigate({ to: "/account" }), 2500);
    } catch {
      setError("We could not update inventory for this order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="px-6 lg:px-12 py-32 max-w-xl mx-auto text-center lk-fade-up">
        <p className="eyebrow mb-4">Order Confirmed</p>
        <h1 className="font-display text-4xl mb-6">Thank you.</h1>
        <p className="text-sm text-muted-foreground">
          Your order is being prepared by the atelier. You will receive an email confirmation
          shortly.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-6 lg:px-12 py-32 max-w-xl mx-auto text-center lk-fade-up">
        <p className="font-display text-2xl">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <form
      ref={ref}
      onSubmit={submit}
      className="px-6 lg:px-12 py-16 max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_400px] gap-12"
    >
      <div className="space-y-10">
        <div className="reveal" style={{ "--reveal-x": "-30px" } as CSSProperties}>
          <p className="eyebrow mb-3">Step 01</p>
          <h2 className="font-display text-3xl mb-6">Delivery Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First name" />
            <Input label="Last name" />
            <Input label="Email" type="email" />
            <Input label="Phone" type="tel" />
            <Input label="Address" className="sm:col-span-2" />
            <Input label="City" />
            <Input label="State" defaultValue="FCT - Abuja" />
          </div>
        </div>

        <div className="reveal" style={{ "--reveal-x": "-18px" } as CSSProperties}>
          <p className="eyebrow mb-3">Step 02</p>
          <h2 className="font-display text-3xl mb-6">Payment Method</h2>
          <div className="space-y-3">
            {[
              { key: "paystack", label: "Paystack", desc: "Cards, bank transfer, USSD." },
              {
                key: "flutterwave",
                label: "Flutterwave",
                desc: "Cards and mobile money across Africa.",
              },
              {
                key: "transfer",
                label: "Bank Transfer",
                desc: "Direct transfer to our LK account.",
              },
            ].map((opt) => (
              <label
                key={opt.key}
                className={`flex items-start gap-4 border p-5 cursor-pointer transition-colors ${payment === opt.key ? "border-foreground" : "border-border"}`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={payment === opt.key}
                  onChange={() => setPayment(opt.key as "paystack" | "flutterwave" | "transfer")}
                  className="mt-1 accent-[color:var(--accent)]"
                />
                <div>
                  <p className="font-display text-lg">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside
        className="bg-[color:var(--cream)] p-8 h-fit reveal"
        style={{ "--reveal-x": "34px" } as CSSProperties}
      >
        <p className="font-display text-2xl mb-6">Order Summary</p>
        <ul className="space-y-3 mb-6">
          {items.map((it) => {
            const p = productById(it.id);
            if (!p) return null;
            return (
              <li key={`${it.id}-${it.size}-${it.color}`} className="flex gap-3 text-sm">
                <img src={p.image} alt="" className="w-14 h-16 object-cover" />
                <div className="flex-1">
                  <p className="font-display">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {it.color} - {it.size} - x{it.qty}
                  </p>
                </div>
                <p className="tabular-nums">{ngn(p.price * it.qty)}</p>
              </li>
            );
          })}
        </ul>
        <dl className="space-y-2 text-sm border-t border-border pt-4">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{ngn(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>{shipping === 0 ? "Free" : ngn(shipping)}</dd>
          </div>
          <div className="flex justify-between font-display text-lg border-t border-border pt-3">
            <dt>Total</dt>
            <dd>{ngn(subtotal + shipping)}</dd>
          </div>
        </dl>
        <a
          href={whatsappCheckout}
          target="_blank"
          rel="noreferrer"
          className="mt-8 block w-full text-center bg-[color:var(--accent)] text-white px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground transition-colors"
        >
          Checkout on WhatsApp
        </a>
        {error && <p className="mt-3 text-xs text-[color:var(--destructive)]">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 w-full border border-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Placing Order" : "Place Order"}
        </button>
      </aside>
    </form>
  );
}

function Input({
  label,
  className,
  ...rest
}: { label: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="eyebrow block mb-2">{label}</span>
      <input
        required
        {...rest}
        className="w-full border border-border px-3 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition-colors"
      />
    </label>
  );
}
