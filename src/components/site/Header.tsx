import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import logo from "@/assets/lk-logo.png";
import { useStoreCategories } from "@/hooks/use-store-categories";
import { childCategories, topLevelCategories } from "@/lib/category-utils";

const primaryLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "Atelier" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQs" },
] as const;

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const categories = useStoreCategories();
  const topCategories = topLevelCategories(categories);
  const dropdownItemClass =
    "rounded-[4px] px-2 py-1.5 transition-colors hover:bg-[color:var(--cream)] hover:text-[color:var(--accent)]";

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
          {primaryLinks.slice(0, 3).map((l) =>
            l.to === "/shop" ? (
              <div key={l.to} className="group relative">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1 lk-link"
                  activeProps={{
                    className: "inline-flex items-center gap-1 lk-link text-[color:var(--accent)]",
                  }}
                >
                  {l.label}
                  <ChevronDown size={13} strokeWidth={1.7} />
                </Link>
                {topCategories.length > 0 && (
                  <div className="invisible absolute left-0 top-full min-w-56 border border-border bg-background p-3 text-sm normal-case tracking-normal opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                    <div className="group/categories py-1">
                      <div className="inline-flex cursor-default items-center gap-1.5 rounded-[4px] px-2 py-1.5 font-medium transition-colors group-hover/categories:bg-[color:var(--cream)] group-hover/categories:text-[color:var(--accent)]">
                        <span>Categories</span>
                        <ChevronDown
                          size={14}
                          strokeWidth={1.7}
                          className="transition-transform group-hover/categories:rotate-180"
                        />
                      </div>
                      <div className="hidden gap-1 pt-2 pl-3 group-hover/categories:grid">
                        {topCategories.map((category) => {
                          const children = childCategories(categories, category.key);
                          return (
                            <div key={category.key} className="group/category">
                              <Link
                                to="/shop/$category"
                                params={{ category: category.key }}
                                className={`inline-flex items-center gap-1.5 font-medium ${dropdownItemClass}`}
                              >
                                <span>{category.name}</span>
                                {children.length > 0 && (
                                  <ChevronDown
                                    size={14}
                                    strokeWidth={1.7}
                                    className="transition-transform group-hover/category:rotate-180"
                                  />
                                )}
                              </Link>
                              {children.length > 0 && (
                                <div className="hidden gap-1 pt-1 pl-3 text-sm normal-case tracking-normal text-muted-foreground group-hover/category:grid">
                                  {children.map((child) => (
                                    <Link
                                      key={child.key}
                                      to="/shop/$category"
                                      params={{ category: child.key }}
                                      className={dropdownItemClass}
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                className="lk-link"
                activeOptions={"exact" in l ? { exact: l.exact } : undefined}
                activeProps={{ className: "lk-link text-[color:var(--accent)]" }}
              >
                {l.label}
              </Link>
            ),
          )}
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
            {primaryLinks.map((l) =>
              l.to === "/shop" && topCategories.length > 0 ? (
                <details key={l.to} className="group/shop">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 transition-colors hover:text-[color:var(--accent)]">
                    <span>{l.label}</span>
                    <ChevronDown
                      size={15}
                      strokeWidth={1.7}
                      className="transition-transform group-open/shop:rotate-180"
                    />
                  </summary>
                  <div className="mt-2 border-l border-border pl-3 normal-case tracking-normal">
                    <details className="group/categories-mobile">
                      <summary className="flex cursor-pointer list-none items-center gap-1.5 py-1 text-sm transition-colors hover:text-[color:var(--accent)]">
                        <span>Categories</span>
                        <ChevronDown
                          size={14}
                          strokeWidth={1.7}
                          className="transition-transform group-open/categories-mobile:rotate-180"
                        />
                      </summary>
                      <div className="mt-2 grid gap-3 border-l border-border/70 pl-3 text-sm text-muted-foreground">
                        {topCategories.map((category) => {
                          const children = childCategories(categories, category.key);
                          if (children.length === 0) {
                            return (
                              <Link
                                key={category.key}
                                to="/shop/$category"
                                params={{ category: category.key }}
                                onClick={() => setOpen(false)}
                                className={dropdownItemClass}
                              >
                                {category.name}
                              </Link>
                            );
                          }

                          return (
                            <details key={category.key} className="group/mobile">
                              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-[4px] px-2 py-1.5 transition-colors hover:bg-[color:var(--cream)] hover:text-[color:var(--accent)]">
                                <span>{category.name}</span>
                                <ChevronDown
                                  size={14}
                                  strokeWidth={1.7}
                                  className="transition-transform group-open/mobile:rotate-180"
                                />
                              </summary>
                              <div className="mt-2 grid gap-2 border-l border-border/70 pl-3 text-xs normal-case tracking-normal">
                                <Link
                                  to="/shop/$category"
                                  params={{ category: category.key }}
                                  onClick={() => setOpen(false)}
                                  className={dropdownItemClass}
                                >
                                  View All
                                </Link>
                                {children.map((child) => (
                                  <Link
                                    key={child.key}
                                    to="/shop/$category"
                                    params={{ category: child.key }}
                                    onClick={() => setOpen(false)}
                                    className={dropdownItemClass}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    </details>
                  </div>
                </details>
              ) : (
                <div key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block py-1 transition-colors hover:text-[color:var(--accent)]"
                    activeOptions={"exact" in l ? { exact: l.exact } : undefined}
                  >
                    {l.label}
                  </Link>
                </div>
              ),
            )}
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
