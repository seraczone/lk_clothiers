import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { products, ngn } from "@/lib/catalog";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { fallbackImageForProduct, handleImageFallback } from "@/lib/product-images";
import {
  deliveryMethodLabels,
  formatOrderDate,
  readLocalOrders,
  type SavedOrder,
} from "@/lib/orders";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — LK Clothiers" }] }),
  component: AccountPage,
});

const mockOrders = [
  { id: "LK-10423", date: "May 22, 2026", total: 220000, status: "Delivered" },
  { id: "LK-10398", date: "Apr 11, 2026", total: 145000, status: "Delivered" },
  { id: "LK-10377", date: "Mar 02, 2026", total: 78000, status: "Cancelled" },
];

function AccountPage() {
  const [tab, setTab] = useState<"orders" | "saved" | "profile">("orders");
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const saved = products.slice(0, 3);

  useEffect(() => {
    setOrders(readLocalOrders());
  }, []);

  return (
    <div className="px-6 lg:px-12 py-16 max-w-[1200px] mx-auto">
      <p className="eyebrow mb-3">My Account</p>
      <h1 className="font-display text-4xl md:text-5xl mb-10">Welcome back.</h1>

      <div className="grid lg:grid-cols-[200px_1fr] gap-10">
        <nav className="flex lg:flex-col gap-1 text-xs uppercase tracking-[0.2em]">
          {[
            { k: "orders", l: "Order History" },
            { k: "saved", l: "Saved Items" },
            { k: "profile", l: "Profile" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as "orders" | "saved" | "profile")}
              className={`text-left px-3 py-2 ${tab === t.k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.l}
            </button>
          ))}
          <Link to="/" className="text-left px-3 py-2 text-muted-foreground mt-4 lg:mt-8">
            Sign Out
          </Link>
        </nav>

        <section>
          {tab === "orders" && (
            <div>
              <h2 className="font-display text-2xl mb-6">Order History</h2>
              <div className="border border-border">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground bg-[color:var(--cream)] border-b border-border">
                  <span>Order</span>
                  <span>Date</span>
                  <span>Total</span>
                  <span>Status</span>
                </div>
                {[...orders, ...mockOrders].map((o) => (
                  <div
                    key={o.id}
                    className="grid gap-3 border-b border-border px-5 py-4 text-sm last:border-0 md:grid-cols-[1fr_1fr_1fr_1fr] md:items-center"
                  >
                    <span className="font-display">{o.id}</span>
                    <span>{"createdAt" in o ? formatOrderDate(o.createdAt) : o.date}</span>
                    <span className="tabular-nums">{ngn(o.total)}</span>
                    <span>
                      <span
                        className={`block text-xs uppercase tracking-[0.2em] ${o.status === "Delivered" ? "text-[color:var(--accent)]" : "text-muted-foreground"}`}
                      >
                        {o.status}
                      </span>
                      {"deliveryMethod" in o && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {deliveryMethodLabels[o.deliveryMethod]}
                        </span>
                      )}
                    </span>
                    {"deliveryAddress" in o && o.deliveryAddress && (
                      <span className="text-xs leading-relaxed text-muted-foreground md:col-span-4">
                        Delivery address: {o.deliveryAddress}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "saved" && (
            <div>
              <h2 className="font-display text-2xl mb-6">Saved Items</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {saved.map((p) => (
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    key={p.id}
                    className="product-card group"
                  >
                    <div className="relative aspect-[4/5] bg-[color:var(--cream)] mb-3 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(event) => handleImageFallback(event, fallbackImageForProduct(p))}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-display text-lg">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{ngn(p.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {tab === "profile" && (
            <div>
              <h2 className="font-display text-2xl mb-6">Profile</h2>
              <form
                className="grid sm:grid-cols-2 gap-4 max-w-xl"
                onSubmit={(e) => e.preventDefault()}
              >
                <Field label="First name" defaultValue="Aisha" />
                <Field label="Last name" defaultValue="A." />
                <Field label="Email" defaultValue="aisha@example.com" className="sm:col-span-2" />
                <Field label="Phone" defaultValue={WHATSAPP_DISPLAY} className="sm:col-span-2" />
                <button className="sm:col-span-2 bg-[color:var(--accent)] text-white px-7 py-3 text-xs uppercase tracking-[0.25em] mt-2">
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  className,
  ...rest
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="eyebrow block mb-2">{label}</span>
      <input
        {...rest}
        className="w-full border border-border px-3 py-3 text-sm bg-background focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
