import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties, FormEvent, InputHTMLAttributes } from "react";
import { useCart } from "@/lib/cart";
import { productById, ngn } from "@/lib/catalog";
import { decrementProductStock } from "@/lib/admin-data";
import { checkoutWhatsAppUrl } from "@/lib/whatsapp";
import { useReveal } from "@/hooks/use-reveal";
import { fallbackImageForProduct, handleImageFallback } from "@/lib/product-images";
import {
  buildAdminNotificationBody,
  buildCustomerEmailBody,
  createOrderId,
  deliveryMethodLabels,
  saveOrder,
  type CheckoutCustomer,
  type DeliveryMethod,
  type SavedOrder,
} from "@/lib/orders";

type CheckoutMethod = "whatsapp" | "online";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout - LK Clothiers" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const method: CheckoutMethod =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("method") === "online"
      ? "online"
      : "whatsapp";
  const isWhatsAppCheckout = method === "whatsapp";
  const [payment, setPayment] = useState<"paystack" | "flutterwave" | "transfer">("paystack");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [whatsappCustomer, setWhatsappCustomer] = useState({
    fullName: "",
    phone: "",
  });
  const [customer, setCustomer] = useState<CheckoutCustomer>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Abuja",
    state: "FCT - Abuja",
  });
  const [confirmedOrder, setConfirmedOrder] = useState<SavedOrder | null>(null);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const discount = 0;
  const total = subtotal - discount;
  const whatsappCheckout = checkoutWhatsAppUrl(
    items,
    subtotal,
    deliveryMethod,
    deliveryMethod === "home" ? deliveryAddress : undefined,
    discount,
    {
      fullName: whatsappCustomer.fullName.trim(),
      phone: whatsappCustomer.phone.trim(),
    },
  );
  const ref = useReveal<HTMLFormElement>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (deliveryMethod === "home" && !deliveryAddress.trim()) {
      setError("Please enter a delivery address for home delivery.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderBase: Omit<SavedOrder, "customerEmailBody" | "adminNotificationBody"> = {
        id: createOrderId(),
        createdAt: new Date().toISOString(),
        customer,
        items,
        subtotal,
        discount,
        total,
        paymentMethod: payment,
        deliveryMethod,
        deliveryAddress: deliveryMethod === "home" ? deliveryAddress.trim() : undefined,
        status: "Processing",
      };
      const order: SavedOrder = {
        ...orderBase,
        customerEmailBody: "",
        adminNotificationBody: "",
      };
      order.customerEmailBody = buildCustomerEmailBody(order);
      order.adminNotificationBody = buildAdminNotificationBody(order);

      await saveOrder(order);
      await decrementProductStock(items);
      setConfirmedOrder(order);
      setDone(true);
      clear();
      setTimeout(() => navigate({ to: "/account" }), 2500);
    } catch {
      setError("We could not update inventory for this order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsAppCheckout = () => {
    setError("");
    if (!whatsappCustomer.fullName.trim() || !whatsappCustomer.phone.trim()) {
      setError("Please enter your full name and phone number before checking out on WhatsApp.");
      return;
    }
    if (deliveryMethod === "home" && !deliveryAddress.trim()) {
      setError("Please enter a delivery address before checking out on WhatsApp.");
      return;
    }

    const popup = window.open(whatsappCheckout, "_blank", "noopener,noreferrer");
    if (!popup) window.location.href = whatsappCheckout;
  };

  if (done) {
    const pickup = confirmedOrder?.deliveryMethod === "pickup";
    return (
      <div className="px-6 lg:px-12 py-32 max-w-xl mx-auto text-center lk-fade-up">
        <p className="eyebrow mb-4">Order Confirmed</p>
        <h1 className="font-display text-4xl mb-6">Thank you.</h1>
        <p className="text-sm text-muted-foreground">
          {pickup
            ? "Thank you for your order. We will notify you when your items are ready for collection."
            : "Thank you for your order. Our team will contact you shortly to confirm delivery arrangements."}
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
      onSubmit={(event) => {
        if (isWhatsAppCheckout) {
          event.preventDefault();
          openWhatsAppCheckout();
          return;
        }
        submit(event);
      }}
      className="px-6 lg:px-12 py-16 max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_400px] gap-12"
    >
      <div className="space-y-10">
        <div className="reveal" style={{ "--reveal-x": "-30px" } as CSSProperties}>
          <p className="eyebrow mb-3">Checkout Method</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/checkout?method=whatsapp"
              className={`border px-5 py-4 text-xs uppercase tracking-[0.2em] transition-colors ${
                isWhatsAppCheckout
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              Checkout with WhatsApp
            </Link>
            <Link
              to="/checkout?method=online"
              className={`border px-5 py-4 text-xs uppercase tracking-[0.2em] transition-colors ${
                !isWhatsAppCheckout
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              Pay Online
            </Link>
          </div>
        </div>

        <div className="reveal" style={{ "--reveal-x": "-30px" } as CSSProperties}>
          <p className="eyebrow mb-3">Step 01</p>
          <h2 className="font-display text-3xl mb-6">
            {isWhatsAppCheckout ? "WhatsApp Contact" : "Delivery Information"}
          </h2>
          {isWhatsAppCheckout ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full name"
                value={whatsappCustomer.fullName}
                onChange={(event) =>
                  setWhatsappCustomer({ ...whatsappCustomer, fullName: event.target.value })
                }
              />
              <Input
                label="Phone"
                type="tel"
                value={whatsappCustomer.phone}
                onChange={(event) =>
                  setWhatsappCustomer({ ...whatsappCustomer, phone: event.target.value })
                }
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="First name"
                value={customer.firstName}
                onChange={(event) => setCustomer({ ...customer, firstName: event.target.value })}
              />
              <Input
                label="Last name"
                value={customer.lastName}
                onChange={(event) => setCustomer({ ...customer, lastName: event.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={customer.email}
                onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                value={customer.phone}
                onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
              />
              <Input
                label="State"
                value={customer.state}
                onChange={(event) => setCustomer({ ...customer, state: event.target.value })}
              />
            </div>
          )}
        </div>

        <div className="reveal" style={{ "--reveal-x": "-18px" } as CSSProperties}>
          <p className="eyebrow mb-3">Step 02</p>
          <h2 className="font-display text-3xl mb-6">Delivery Method</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                key: "pickup",
                label: "Pick Up at Store",
                desc: "Collect from LK Clothiers once your pieces are prepared.",
              },
              {
                key: "home",
                label: "Home Delivery",
                desc: "Our team will arrange delivery after order confirmation.",
              },
            ].map((opt) => (
              <label
                key={opt.key}
                className={`cursor-pointer border p-5 transition-colors ${
                  deliveryMethod === opt.key
                    ? "border-foreground bg-[color:var(--cream)]"
                    : "border-border bg-background"
                }`}
              >
                <span className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === opt.key}
                    onChange={() => setDeliveryMethod(opt.key as DeliveryMethod)}
                    className="mt-1 accent-[color:var(--accent)]"
                  />
                  <span>
                    <span className="block font-display text-xl">{opt.label}</span>
                    <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                      {opt.desc}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-5 border border-border bg-background p-5 text-sm leading-relaxed text-muted-foreground">
            {deliveryMethod === "pickup" ? (
              <p>
                Your order will be prepared for collection at our store. We will notify you once it
                is ready for pickup.
              </p>
            ) : (
              <div className="space-y-4">
                <label className="block">
                  <span className="eyebrow mb-2 block">Delivery Address</span>
                  <textarea
                    required={deliveryMethod === "home"}
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    rows={4}
                    className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
                  />
                </label>
                <p>
                  Delivery charges are determined by location and will be communicated after your
                  order is confirmed. Our team will contact you to arrange delivery.
                </p>
              </div>
            )}
          </div>
        </div>

        {!isWhatsAppCheckout && (
          <div className="reveal" style={{ "--reveal-x": "-18px" } as CSSProperties}>
            <p className="eyebrow mb-3">Step 03</p>
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
                    onChange={() =>
                      setPayment(opt.key as "paystack" | "flutterwave" | "transfer")
                    }
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
        )}
      </div>

      <aside
        className="bg-[color:var(--cream)] p-8 h-fit reveal"
        style={{ "--reveal-x": "34px" } as CSSProperties}
      >
        <p className="font-display text-2xl mb-6">Order Summary</p>
        <ul className="space-y-3 mb-6">
          {items.map((it) => {
            const p = productById(it.id);
            const name = it.name ?? p?.name;
            const image = it.image ?? p?.image;
            const unitPrice = it.variantPrice ?? it.price ?? p?.price ?? 0;
            if (!name || !image) return null;
            const fallbackImage = fallbackImageForProduct(p ?? { id: it.id, category: "" });
            const variantLabel =
              it.variantType && it.variantValue ? `${it.variantType}: ${it.variantValue}` : "";
            return (
              <li
                key={`${it.id}-${it.size}-${it.color}-${it.variantId ?? ""}`}
                className="flex gap-3 text-sm"
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  onError={(event) => handleImageFallback(event, fallbackImage)}
                  className="w-14 h-16 object-cover"
                />
                <div className="flex-1">
                  <p className="font-display">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[it.color, it.size, variantLabel, `x${it.qty}`].filter(Boolean).join(" - ")}
                  </p>
                </div>
                <p className="tabular-nums">{ngn(unitPrice * it.qty)}</p>
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
            <dt className="text-muted-foreground">Discount</dt>
            <dd>{discount > 0 ? `-${ngn(discount)}` : "NGN 0"}</dd>
          </div>
          <div className="flex justify-between font-display text-lg border-t border-border pt-3">
            <dt>Total</dt>
            <dd>{ngn(total)}</dd>
          </div>
        </dl>
        <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          <p className="uppercase tracking-[0.2em] text-foreground">Delivery</p>
          <p className="mt-2">{deliveryMethodLabels[deliveryMethod]}</p>
          {deliveryMethod === "home" && deliveryAddress.trim() && (
            <p className="mt-1 leading-relaxed">{deliveryAddress}</p>
          )}
        </div>
        <div className="mt-8 border-t border-border pt-5">
          {isWhatsAppCheckout ? (
            <a
              href={whatsappCheckout}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                event.preventDefault();
                openWhatsAppCheckout();
              }}
              className="mt-3 block w-full text-center bg-[color:var(--accent)] px-7 py-4 text-xs uppercase tracking-[0.25em] text-white transition-colors hover:bg-foreground"
            >
              Checkout on WhatsApp
            </a>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border border-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Preparing Payment" : "Pay Online"}
            </button>
          )}
        </div>
        {error && <p className="mt-3 text-xs text-[color:var(--destructive)]">{error}</p>}
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
