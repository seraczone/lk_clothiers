import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productById } from "./catalog";

export type CartItem = {
  id: string;
  size: string;
  color: string;
  qty: number;
  name?: string;
  image?: string;
  price?: number;
  variantId?: string;
  variantType?: string;
  variantValue?: string;
  variantSku?: string;
  variantPrice?: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string, size: string, color: string, variantId?: string) => void;
  setQty: (id: string, size: string, color: string, qty: number, variantId?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lk_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const sameKey = (a: CartItem, b: CartItem) =>
      a.id === b.id &&
      a.size === b.size &&
      a.color === b.color &&
      (a.variantId ?? "") === (b.variantId ?? "");
    const subtotal = items.reduce((s, it) => {
      const p = productById(it.id);
      const unitPrice = it.variantPrice ?? it.price ?? p?.price ?? 0;
      return s + unitPrice * it.qty;
    }, 0);
    const count = items.reduce((s, it) => s + it.qty, 0);
    return {
      items,
      count,
      subtotal,
      add: (item) =>
        setItems((prev) => {
          const i = prev.findIndex((p) => sameKey(p, item));
          if (i >= 0) {
            const next = [...prev];
            next[i] = { ...next[i], qty: next[i].qty + item.qty };
            return next;
          }
          return [...prev, item];
        }),
      remove: (id, size, color, variantId) =>
        setItems((prev) =>
          prev.filter((p) => !sameKey(p, { id, size, color, variantId, qty: 0 })),
        ),
      setQty: (id, size, color, qty, variantId) =>
        setItems((prev) => {
          if (qty <= 0)
            return prev.filter((p) => !sameKey(p, { id, size, color, variantId, qty: 0 }));
          return prev.map((p) =>
            sameKey(p, { id, size, color, variantId, qty: 0 }) ? { ...p, qty } : p,
          );
        }),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
