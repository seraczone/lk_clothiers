import { useEffect, useState } from "react";

import { adminCategories, listAdminCategories, type AdminCategory } from "@/lib/admin-data";

export function useStoreCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>(adminCategories);

  useEffect(() => {
    let mounted = true;
    listAdminCategories()
      .then((loadedCategories) => {
        if (mounted) setCategories(loadedCategories.length > 0 ? loadedCategories : adminCategories);
      })
      .catch(() => {
        if (mounted) setCategories(adminCategories);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return categories;
}
