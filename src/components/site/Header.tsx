import { Link } from "@tanstack/react-router";
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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
        <button
          className="md:hidden text-xs uppercase tracking-[0.25em]"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? "Close" : "Menu"}
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
            className="h-16 w-40 object-contain mix-blend-multiply transition-transform duration-500 hover:scale-[1.03]"
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
          <Link to="/cart" className="lk-link">
            Bag ({count})
          </Link>
        </nav>
        <Link to="/cart" className="md:hidden text-[11px] uppercase tracking-[0.25em]">
          Bag ({count})
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
            <Link to="/cart" onClick={() => setOpen(false)} className="py-1 text-muted-foreground">
              Bag ({count})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
