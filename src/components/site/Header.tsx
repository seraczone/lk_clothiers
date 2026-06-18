import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import logo from "@/assets/lk-logo.png";

const primaryLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "Atelier" },
  { to: "/contact", label: "Visit" },
  { to: "/faq", label: "FAQs" },
] as const;

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/85 border-b border-border/60 transition-colors">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between gap-4">
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-border text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={20} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
        </button>
        <nav className="hidden md:flex gap-6 text-[11px] uppercase tracking-[0.2em] text-foreground/80">
          {primaryLinks.slice(0, 3).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="lk-link"
              activeOptions={"exact" in l ? { exact: l.exact } : undefined}
              activeProps={{ className: "lk-link text-[color:var(--accent)]" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link to="/" className="flex items-center justify-center" aria-label="LK Clothiers home">
          <img
            src={logo}
            alt="LK Clothiers"
            className="h-20 w-52 object-contain mix-blend-multiply transition-transform duration-500 hover:scale-[1.03] md:h-24 md:w-60"
          />
        </Link>
        <nav className="hidden md:flex gap-6 text-[11px] uppercase tracking-[0.2em] text-foreground/80 items-center">
          {primaryLinks.slice(3).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="lk-link"
              activeOptions={"exact" in l ? { exact: l.exact } : undefined}
              activeProps={{ className: "lk-link text-[color:var(--accent)]" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 lk-link"
            aria-label={`Cart (${count})`}
          >
            <ShoppingCart size={16} strokeWidth={1.7} />
            <span>({count})</span>
          </Link>
        </nav>
        <Link
          to="/cart"
          className="md:hidden relative inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-border text-foreground"
          aria-label={`Cart (${count})`}
        >
          <ShoppingCart size={19} strokeWidth={1.8} />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--accent)] px-1 text-[10px] font-medium text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 flex flex-col gap-3 text-sm uppercase tracking-[0.2em]">
            {primaryLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-1"
                activeOptions={"exact" in l ? { exact: l.exact } : undefined}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 py-1 text-muted-foreground"
            >
              <ShoppingCart size={16} strokeWidth={1.8} />
              <span>Cart ({count})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
