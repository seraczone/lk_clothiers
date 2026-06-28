import { useEffect, useState } from "react";

import { listAdminProducts, seedProducts, type AdminProduct } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase";

const liveSeedProducts = seedProducts.filter((product) => product.status === "Live");

export function useStoreProducts() {
  const [products, setProducts] = useState<AdminProduct[]>(liveSeedProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listAdminProducts()
      .then((loadedProducts) => {
        if (!mounted) return;
        const liveProducts = loadedProducts.filter((product) => product.status === "Live");
        setProducts(
          isSupabaseConfigured
            ? liveProducts
            : liveProducts.length > 0
              ? liveProducts
              : liveSeedProducts,
        );
      })
      .catch(() => {
        if (mounted) setProducts(liveSeedProducts);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { products, isLoading };
}
