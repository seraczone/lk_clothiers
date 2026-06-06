import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { products, categories, ngn } from "@/lib/catalog";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — LK Clothiers" }] }),
  component: AdminPage,
});

type Tab = "dashboard" | "products" | "orders" | "customers" | "content" | "marketing" | "settings";

function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="-mt-16 min-h-screen bg-[color:var(--cream)]/40 grid grid-cols-1 lg:grid-cols-[240px_1fr]">
      <aside className="bg-[color:var(--coffee-deep,#3a2a20)] text-white lg:min-h-screen p-6 lg:fixed lg:w-[240px] lg:top-0 lg:bottom-0">
        <p className="font-display text-2xl tracking-[0.3em] mb-1">LK</p>
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 mb-10">Admin Panel</p>
        <nav className="space-y-1 text-xs uppercase tracking-[0.2em]">
          {(
            [
              ["dashboard", "Dashboard"],
              ["products", "Products"],
              ["orders", "Orders"],
              ["customers", "Customers"],
              ["content", "Content"],
              ["marketing", "Marketing"],
              ["settings", "Settings"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`block w-full text-left px-3 py-2.5 rounded-sm transition-colors ${tab === k ? "bg-[color:var(--accent)] text-white" : "text-white/70 hover:bg-white/5"}`}
            >
              {l}
            </button>
          ))}
        </nav>
        <div className="mt-12 pt-6 border-t border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/40">
          <p>Signed in as Owner</p>
          <p className="mt-1">lk@clothiers.com</p>
        </div>
      </aside>

      <main className="lg:ml-[240px] p-6 lg:p-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="eyebrow mb-2">Admin</p>
            <h1 className="font-display text-3xl capitalize">{tab}</h1>
          </div>
          <button className="bg-[color:var(--accent)] text-white px-5 py-2.5 text-xs uppercase tracking-[0.2em]">
            + Quick Add
          </button>
        </header>

        {tab === "dashboard" && <Dashboard />}
        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "customers" && <CustomersTab />}
        {tab === "content" && <ContentTab />}
        {tab === "marketing" && <MarketingTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

function Stat({ l, v, change }: { l: string; v: string; change?: string }) {
  return (
    <div className="bg-background border border-border p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</p>
      <p className="font-display text-3xl mt-2">{v}</p>
      {change && <p className="text-xs text-[color:var(--accent)] mt-1">{change}</p>}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat l="Total Revenue" v="₦ 4.2M" change="+12% vs last month" />
        <Stat l="Orders" v="312" change="+24 this week" />
        <Stat l="Products" v={String(products.length)} change={`${categories.length} categories`} />
        <Stat l="Customers" v="1,284" change="+38 new" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-background border border-border p-6">
          <p className="font-display text-lg mb-4">Recent Orders</p>
          {[
            { id: "LK-10456", n: "Aisha A.", t: "Layla Coffee Kaftan", v: 145000, s: "Processing" },
            { id: "LK-10455", n: "Halima O.", t: "Camel Tailored Suit", v: 185000, s: "Pending" },
            { id: "LK-10454", n: "Fatima B.", t: "Sade Ivory Boubou", v: 220000, s: "Delivered" },
          ].map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center py-3 border-b border-border last:border-0 text-sm"
            >
              <span className="font-display text-xs text-muted-foreground">{o.id}</span>
              <div>
                <p>{o.n}</p>
                <p className="text-xs text-muted-foreground">{o.t}</p>
              </div>
              <span className="tabular-nums">{ngn(o.v)}</span>
              <span
                className={`text-[10px] uppercase tracking-[0.2em] ${o.s === "Delivered" ? "text-[color:var(--accent)]" : "text-foreground"}`}
              >
                {o.s}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-background border border-border p-6">
          <p className="font-display text-lg mb-4">Top Categories</p>
          {categories.map((c) => {
            const pct = 40 + Math.round(Math.random() * 50);
            return (
              <div key={c.key} className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-1.5 bg-[color:var(--cream)]">
                  <div className="h-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="bg-background border border-border">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex gap-2">
          <input
            placeholder="Search products"
            className="border border-border px-3 py-2 text-sm w-64"
          />
          <select className="border border-border px-3 py-2 text-sm">
            <option>All categories</option>
            {categories.map((c) => (
              <option key={c.key}>{c.name}</option>
            ))}
          </select>
        </div>
        <button className="bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.2em]">
          + New Product
        </button>
      </div>
      <div className="grid grid-cols-[1fr_120px_120px_120px_120px_80px] gap-3 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground bg-[color:var(--cream)] border-b border-border">
        <span>Product</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Status</span>
        <span></span>
      </div>
      {products.map((p, i) => (
        <div
          key={p.id}
          className="grid grid-cols-[1fr_120px_120px_120px_120px_80px] gap-3 items-center px-5 py-3 border-b border-border last:border-0 text-sm"
        >
          <span className="flex items-center gap-3">
            <img src={p.image} alt="" className="w-10 h-12 object-cover" />
            {p.name}
          </span>
          <span className="capitalize">{p.category}</span>
          <span className="tabular-nums">{ngn(p.price)}</span>
          <span className="tabular-nums">{20 - (i % 8)}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)]">
            Live
          </span>
          <span className="text-xs text-muted-foreground">
            <button className="lk-link">Edit</button>
          </span>
        </div>
      ))}
    </div>
  );
}

function OrdersTab() {
  const rows = [
    { id: "LK-10456", n: "Aisha A.", t: 145000, s: "Processing" },
    { id: "LK-10455", n: "Halima O.", t: 185000, s: "Pending" },
    { id: "LK-10454", n: "Fatima B.", t: 220000, s: "Delivered" },
    { id: "LK-10453", n: "Zainab K.", t: 78000, s: "Cancelled" },
    { id: "LK-10452", n: "Maryam L.", t: 320000, s: "Delivered" },
  ];
  return (
    <div className="bg-background border border-border">
      <div className="grid grid-cols-[120px_1fr_120px_140px_100px] gap-3 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground bg-[color:var(--cream)] border-b border-border">
        <span>Order</span>
        <span>Customer</span>
        <span>Total</span>
        <span>Status</span>
        <span></span>
      </div>
      {rows.map((r) => (
        <div
          key={r.id}
          className="grid grid-cols-[120px_1fr_120px_140px_100px] gap-3 items-center px-5 py-4 border-b border-border last:border-0 text-sm"
        >
          <span className="font-display text-xs">{r.id}</span>
          <span>{r.n}</span>
          <span className="tabular-nums">{ngn(r.t)}</span>
          <select defaultValue={r.s} className="border border-border px-2 py-1.5 text-xs">
            <option>Pending</option>
            <option>Processing</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <button className="text-xs uppercase tracking-[0.2em] lk-link">View</button>
        </div>
      ))}
    </div>
  );
}

function CustomersTab() {
  const rows = [
    { n: "Aisha A.", e: "aisha@example.com", o: 6, s: 1240000 },
    { n: "Halima O.", e: "halima@example.com", o: 4, s: 820000 },
    { n: "Fatima B.", e: "fatima@example.com", o: 9, s: 1860000 },
    { n: "Zainab K.", e: "zainab@example.com", o: 2, s: 320000 },
  ];
  return (
    <div className="bg-background border border-border">
      <div className="p-5 border-b border-border">
        <input
          placeholder="Search customers"
          className="border border-border px-3 py-2 text-sm w-72"
        />
      </div>
      <div className="grid grid-cols-[1fr_1fr_100px_140px] gap-3 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground bg-[color:var(--cream)] border-b border-border">
        <span>Name</span>
        <span>Email</span>
        <span>Orders</span>
        <span>Lifetime Spend</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.e}
          className="grid grid-cols-[1fr_1fr_100px_140px] gap-3 px-5 py-4 border-b border-border last:border-0 text-sm"
        >
          <span>{r.n}</span>
          <span className="text-muted-foreground">{r.e}</span>
          <span className="tabular-nums">{r.o}</span>
          <span className="tabular-nums">{ngn(r.s)}</span>
        </div>
      ))}
    </div>
  );
}

function ContentTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card title="Homepage Banner">
        <Field label="Headline" defaultValue="Modest fashion, timeless elegance." />
        <Field
          label="Sub-headline"
          defaultValue="Premium ready-to-wear for women, girls and boys."
        />
        <Field label="CTA Label" defaultValue="Shop Collection" />
        <FileField label="Hero Image" />
      </Card>
      <Card title="Testimonials">
        {["Aisha A.", "Halima O.", "Fatima B."].map((n) => (
          <div
            key={n}
            className="flex items-center justify-between border-b border-border py-3 last:border-0 text-sm"
          >
            <span>{n}</span>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <button className="lk-link">Edit</button>
              <button className="lk-link">Remove</button>
            </div>
          </div>
        ))}
        <button className="mt-3 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
          + Add Testimonial
        </button>
      </Card>
      <Card title="FAQs">
        <p className="text-xs text-muted-foreground mb-3">7 published questions</p>
        <button className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
          + Add Question
        </button>
      </Card>
      <Card title="Website Content">
        <Field label="About Page Headline" defaultValue="A quiet study in modern modesty." />
        <Field label="Contact Email" defaultValue="hello@lkclothiers.com" />
      </Card>
    </div>
  );
}

function MarketingTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card title="Newsletter Subscribers">
        <p className="font-display text-3xl mb-1">1,842</p>
        <p className="text-xs text-muted-foreground">+ 38 this week</p>
        <button className="mt-4 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
          Export CSV
        </button>
      </Card>
      <Card title="Promotional Campaign">
        <Field label="Campaign name" defaultValue="Eid Collection 2026" />
        <Field label="Discount %" defaultValue="15" />
        <Field label="Promo code" defaultValue="LKEID15" />
        <button className="mt-3 bg-[color:var(--accent)] text-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
          Launch
        </button>
      </Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card title="Store Information">
        <Field label="Store Name" defaultValue="LK Clothiers" />
        <Field label="Address" defaultValue="Wuye District, Abuja FCT" />
        <Field label="Phone" defaultValue="+234 817 195 0268" />
      </Card>
      <Card title="Social Links">
        <Field label="Instagram" defaultValue="@lk_clothiers" />
        <Field label="TikTok" defaultValue="@lkclothiers" />
        <Field label="WhatsApp" defaultValue="+234 817 195 0268" />
      </Card>
      <Card title="Payment Settings">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" defaultChecked className="accent-[color:var(--accent)]" /> Paystack
        </label>
        <label className="flex items-center gap-3 text-sm mt-2">
          <input type="checkbox" defaultChecked className="accent-[color:var(--accent)]" />{" "}
          Flutterwave
        </label>
        <label className="flex items-center gap-3 text-sm mt-2">
          <input type="checkbox" className="accent-[color:var(--accent)]" /> Bank Transfer
        </label>
      </Card>
      <Card title="Shipping Settings">
        <Field label="Free shipping threshold" defaultValue="100000" />
        <Field label="Flat rate (Nigeria)" defaultValue="5000" />
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-background border border-border p-6">
      <p className="font-display text-lg mb-4">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1.5">
        {label}
      </span>
      <input
        {...rest}
        className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}

function FileField({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1.5">
        {label}
      </span>
      <div className="border border-dashed border-border p-6 text-center text-xs text-muted-foreground cursor-pointer hover:border-foreground">
        Drag image or <span className="text-[color:var(--accent)]">browse</span>
      </div>
    </label>
  );
}
