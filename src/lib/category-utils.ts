import type { CategoryKey, Product } from "@/lib/catalog";
import type { AdminCategory } from "@/lib/admin-data";

export function categorySortValue(category: AdminCategory) {
  return typeof category.sortOrder === "number" ? category.sortOrder : Number.MAX_SAFE_INTEGER;
}

export function sortCategories(categories: AdminCategory[]) {
  return [...categories].sort((a, b) => {
    const order = categorySortValue(a) - categorySortValue(b);
    if (order !== 0) return order;
    return a.name.localeCompare(b.name);
  });
}

export function topLevelCategories(categories: AdminCategory[]) {
  return sortCategories(categories).filter((category) => !category.parentKey);
}

export function childCategories(categories: AdminCategory[], parentKey: CategoryKey) {
  return sortCategories(categories).filter((category) => category.parentKey === parentKey);
}

export function categoryByKey(categories: AdminCategory[], key: CategoryKey) {
  return categories.find((category) => category.key === key);
}

export function descendantCategoryKeys(categories: AdminCategory[], parentKey: CategoryKey) {
  const keys = new Set<CategoryKey>();
  const queue = childCategories(categories, parentKey).map((category) => category.key);

  while (queue.length > 0) {
    const key = queue.shift();
    if (!key || keys.has(key)) continue;
    keys.add(key);
    queue.push(...childCategories(categories, key).map((category) => category.key));
  }

  return keys;
}

export function productCategoryKeysForFilter(categories: AdminCategory[], key: CategoryKey) {
  const descendants = descendantCategoryKeys(categories, key);
  return descendants.size > 0 ? descendants : new Set<CategoryKey>([key]);
}

export function productsForCategory<T extends Pick<Product, "category">>(
  products: T[],
  categories: AdminCategory[],
  key: CategoryKey,
) {
  const keys = productCategoryKeysForFilter(categories, key);
  return products.filter((product) => keys.has(product.category));
}

export function assignableProductCategories(categories: AdminCategory[]) {
  return sortCategories(categories).filter(
    (category) => childCategories(categories, category.key).length === 0,
  );
}

export function categoryName(categories: AdminCategory[], key: CategoryKey) {
  return categoryByKey(categories, key)?.name ?? key.replace(/-/g, " ");
}

export function categoryPath(categories: AdminCategory[], key: CategoryKey) {
  const path: AdminCategory[] = [];
  const seen = new Set<CategoryKey>();
  let current = categoryByKey(categories, key);

  while (current && !seen.has(current.key)) {
    path.unshift(current);
    seen.add(current.key);
    current = current.parentKey ? categoryByKey(categories, current.parentKey) : undefined;
  }

  return path;
}
