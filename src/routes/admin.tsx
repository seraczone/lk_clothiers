import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Check,
  Copy,
  Edit3,
  Eye,
  FileText,
  LayoutDashboard,
  Megaphone,
  Package,
  Plus,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import {
  adminCategories as categories,
  defaultContent,
  deleteAdminProduct,
  getSiteContent,
  listAdminProducts,
  saveSiteContent,
  seedProducts,
  uploadProductImage,
  upsertAdminProduct,
  type AdminProduct,
  type ContentState,
  type ProductStatus,
} from "@/lib/admin-data";
import { ngn, products, type CategoryKey } from "@/lib/catalog";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin - LK Clothiers" }] }),
  component: AdminPage,
});

type Tab = "dashboard" | "products" | "orders" | "customers" | "content" | "marketing" | "settings";
type ProductDraft = Omit<AdminProduct, "price" | "stock" | "sizes" | "colors" | "bestSeller"> & {
  price: string;
  stock: string;
  sizes: string;
  colors: string;
  bestSeller: boolean;
};

const blankDraft = (): ProductDraft => ({
  id: "",
  name: "",
  price: "",
  category: "girls",
  image: "",
  gallery: [],
  sizes: "S, M, L, XL",
  colors: "Ivory",
  description: "",
  tag: "",
  bestSeller: false,
  stock: "12",
  status: "Draft",
});

const tabs: { key: Tab; label: string; icon: ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "products", label: "Products", icon: <Package size={16} /> },
  { key: "orders", label: "Orders", icon: <ShoppingBag size={16} /> },
  { key: "customers", label: "Customers", icon: <Users size={16} /> },
  { key: "content", label: "Content", icon: <FileText size={16} /> },
  { key: "marketing", label: "Marketing", icon: <Megaphone size={16} /> },
  { key: "settings", label: "Settings", icon: <Settings size={16} /> },
];

function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>(seedProducts);
  const [content, setContent] = useState<ContentState>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([listAdminProducts(), getSiteContent()])
      .then(([loadedProducts, loadedContent]) => {
        if (!mounted) return;
        setAdminProducts(loadedProducts.length > 0 ? loadedProducts : seedProducts);
        setContent(loadedContent);
        setDataError("");
      })
      .catch((error) => {
        if (!mounted) return;
        setDataError(error instanceof Error ? error.message : "Unable to load Supabase data.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const lowStockCount = adminProducts.filter((product) => product.stock <= 5).length;

  return (
    <div className="-mt-16 min-h-screen bg-[color:var(--cream)] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[272px_1fr]">
        <aside className="border-r border-border bg-[color:var(--coffee-deep)] text-background">
          <div className="sticky top-0 flex min-h-screen flex-col px-5 py-6">
            <div className="mb-8 border-b border-background/10 pb-6">
              <p className="font-display text-3xl leading-none">LK</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-background/55">
                Commerce Admin
              </p>
            </div>
            <nav className="space-y-1">
              {tabs.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`flex w-full items-center gap-3 rounded-[6px] px-3 py-3 text-left text-xs uppercase tracking-[0.18em] transition-colors ${
                    tab === item.key
                      ? "bg-[color:var(--accent)] text-white"
                      : "text-background/70 hover:bg-background/8 hover:text-background"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto border-t border-background/10 pt-5 text-[10px] uppercase tracking-[0.2em] text-background/45">
              <p>Owner Workspace</p>
              <p className="mt-1 normal-case tracking-normal text-background/70">
                lk@clothiers.com
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
          {dataError && (
            <div className="mb-5 rounded-[6px] border border-[color:var(--destructive)] bg-[color:var(--destructive)]/8 px-4 py-3 text-sm text-[color:var(--destructive)]">
              {dataError}
            </div>
          )}
          {isLoading && (
            <div className="mb-5 rounded-[6px] border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              Loading Supabase data...
            </div>
          )}
          <header className="mb-6 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow mb-2">Admin Console</p>
              <h1 className="font-display text-4xl capitalize md:text-5xl">
                {tabs.find((item) => item.key === tab)?.label}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTab("content")}
                className="inline-flex items-center gap-2 rounded-[6px] border border-border bg-background px-4 py-2.5 text-xs uppercase tracking-[0.18em] transition-colors hover:border-foreground"
              >
                <Eye size={15} />
                Content
              </button>
              <button
                onClick={() => setTab("products")}
                className="inline-flex items-center gap-2 rounded-[6px] bg-[color:var(--accent)] px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-foreground"
              >
                <Plus size={15} />
                Product
              </button>
            </div>
          </header>

          {tab === "dashboard" && (
            <Dashboard products={adminProducts} content={content} lowStockCount={lowStockCount} />
          )}
          {tab === "products" && (
            <ProductsTab products={adminProducts} onProductsChange={setAdminProducts} />
          )}
          {tab === "orders" && <OrdersTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "content" && <ContentTab content={content} onContentChange={setContent} />}
          {tab === "marketing" && <MarketingTab content={content} />}
          {tab === "settings" && <SettingsTab content={content} onContentChange={setContent} />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({
  products: adminProducts,
  content,
  lowStockCount,
}: {
  products: AdminProduct[];
  content: ContentState;
  lowStockCount: number;
}) {
  const liveProducts = adminProducts.filter((product) => product.status === "Live").length;
  const inventoryValue = adminProducts.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  );
  const bestSellerCount = adminProducts.filter((product) => product.bestSeller).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Inventory Value" value={ngn(inventoryValue)} helper="Based on current stock" />
        <Stat
          label="Live Products"
          value={String(liveProducts)}
          helper={`${adminProducts.length} total SKUs`}
        />
        <Stat
          label="Low Stock"
          value={String(lowStockCount)}
          helper="Five units or less"
          tone={lowStockCount > 0 ? "warn" : "good"}
        />
        <Stat
          label="Best Sellers"
          value={String(bestSellerCount)}
          helper="Featured across storefront"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Storefront Snapshot" action={<BarChart3 size={18} />}>
          <div className="rounded-[8px] border border-border bg-[color:var(--cream)] p-5">
            <p className="eyebrow mb-3">{content.home.heroEyebrow}</p>
            <h2 className="font-display text-4xl leading-tight">
              {content.home.heroLineOne} {content.home.heroAccent} {content.home.heroLineTwo}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {content.home.heroCopy}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-[6px] bg-[color:var(--accent)] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white">
                {content.home.primaryCta}
              </span>
              <span className="rounded-[6px] border border-border bg-background px-3 py-2 text-[10px] uppercase tracking-[0.18em]">
                {content.home.secondaryCta}
              </span>
            </div>
          </div>
        </Panel>

        <Panel title="Operational Notes">
          <div className="space-y-3">
            <Task done label="Public site content is editable" />
            <Task done label="Product CRUD persists locally" />
            <Task done={lowStockCount === 0} label="Review low-stock products" />
            <Task label="Connect Supabase tables and storage" />
          </div>
        </Panel>
      </div>

      <Panel title="Category Performance">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => {
            const count = adminProducts.filter(
              (product) => product.category === category.key,
            ).length;
            const pct = Math.min(100, 35 + count * 9 + index * 4);
            return (
              <div
                key={category.key}
                className="rounded-[8px] border border-border bg-background p-4"
              >
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">{count} products</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[color:var(--cream)]">
                  <div
                    className="h-full rounded-full bg-[color:var(--accent)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function ProductsTab({
  products: adminProducts,
  onProductsChange,
}: {
  products: AdminProduct[];
  onProductsChange: (products: AdminProduct[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CategoryKey>("all");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [mutationError, setMutationError] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return adminProducts.filter((product) => {
      const matchesQuery =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      const matchesCategory = category === "all" || product.category === category;
      const matchesStatus = status === "all" || product.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [adminProducts, category, query, status]);

  const saveProduct = async (product: AdminProduct) => {
    try {
      const savedProduct = await upsertAdminProduct(product);
      const exists = adminProducts.some((item) => item.id === savedProduct.id);
      onProductsChange(
        exists
          ? adminProducts.map((item) => (item.id === savedProduct.id ? savedProduct : item))
          : [savedProduct, ...adminProducts],
      );
      setEditing(null);
      setIsCreating(false);
      setMutationError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save product.";
      setMutationError(message);
      throw new Error(message);
    }
  };

  const duplicateProduct = async (product: AdminProduct) => {
    const copy: AdminProduct = {
      ...product,
      id: `${product.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${product.name} Copy`,
      status: "Draft",
    };
    try {
      const savedProduct = await upsertAdminProduct(copy);
      onProductsChange([savedProduct, ...adminProducts]);
      setMutationError("");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to duplicate product.");
    }
  };

  const deleteProduct = async (id: string) => {
    const product = adminProducts.find((item) => item.id === id);
    if (!product) return;
    if (window.confirm(`Delete ${product.name}? This only removes it from the admin MVP data.`)) {
      try {
        await deleteAdminProduct(id);
        onProductsChange(adminProducts.filter((item) => item.id !== id));
        setMutationError("");
      } catch (error) {
        setMutationError(error instanceof Error ? error.message : "Unable to delete product.");
      }
    }
  };

  return (
    <div className="space-y-5">
      <Panel
        title="Product Admin"
        action={
          <button
            onClick={() => {
              setIsCreating(true);
              setEditing(null);
            }}
            className="inline-flex items-center gap-2 rounded-[6px] bg-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-[color:var(--accent)]"
          >
            <Plus size={15} />
            New Product
          </button>
        }
      >
        {mutationError && (
          <div className="mb-4 rounded-[6px] border border-[color:var(--destructive)] bg-[color:var(--destructive)]/8 px-4 py-3 text-sm text-[color:var(--destructive)]">
            {mutationError}
          </div>
        )}
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_150px]">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, SKU, or description"
              className="h-11 w-full rounded-[6px] border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-foreground"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as "all" | CategoryKey)}
            className="h-11 rounded-[6px] border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.key} value={item.key}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "all" | ProductStatus)}
            className="h-11 rounded-[6px] border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
          >
            <option value="all">All statuses</option>
            <option value="Live">Live</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </Panel>

      <div className="overflow-hidden rounded-[8px] border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-[color:var(--cream)] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt=""
                        className="h-14 w-11 rounded-[4px] object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{product.category}</td>
                  <td className="px-4 py-3 tabular-nums">{ngn(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock <= 5 ? "text-[color:var(--destructive)]" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={product.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconButton label="Edit product" onClick={() => setEditing(product)}>
                        <Edit3 size={15} />
                      </IconButton>
                      <IconButton
                        label="Duplicate product"
                        onClick={() => duplicateProduct(product)}
                      >
                        <Copy size={15} />
                      </IconButton>
                      <IconButton
                        label="Delete product"
                        onClick={() => deleteProduct(product.id)}
                        danger
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No products match this filter.
          </div>
        )}
      </div>

      {(isCreating || editing) && (
        <ProductEditor
          product={editing}
          products={adminProducts}
          onClose={() => {
            setEditing(null);
            setIsCreating(false);
          }}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}

function ProductEditor({
  product,
  products: adminProducts,
  onClose,
  onSave,
}: {
  product: AdminProduct | null;
  products: AdminProduct[];
  onClose: () => void;
  onSave: (product: AdminProduct) => Promise<void>;
}) {
  const [draft, setDraft] = useState<ProductDraft>(() => productToDraft(product));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const updateDraft = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedId = slugify(draft.id || draft.name);
    if (!normalizedId || !draft.name.trim()) {
      setError("Product name and SKU are required.");
      return;
    }
    const duplicate = adminProducts.some(
      (item) => item.id === normalizedId && item.id !== product?.id,
    );
    if (duplicate) {
      setError("A product with this SKU already exists.");
      return;
    }
    const parsedPrice = Number(draft.price);
    const parsedStock = Number(draft.stock);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError("Enter a valid product price.");
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        id: normalizedId,
        name: draft.name.trim(),
        price: parsedPrice,
        category: draft.category,
        image: draft.image.trim() || products[0]?.image || "",
        sizes: splitList(draft.sizes),
        colors: splitList(draft.colors),
        description: draft.description.trim(),
        tag: draft.tag.trim() || undefined,
        bestSeller: draft.bestSeller,
        stock: Math.round(parsedStock),
        status: draft.status,
      });
      setError("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a valid image file.");
      return;
    }

    setIsUploading(true);
    setError("");
    try {
      const uploadedUrl = await uploadProductImage(file, slugify(draft.id || draft.name));
      updateDraft("image", uploadedUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-foreground/45 p-4 backdrop-blur-sm">
      <div className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[8px] border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="eyebrow mb-1">{product ? "Edit Product" : "New Product"}</p>
            <h2 className="font-display text-3xl">{draft.name || "Untitled product"}</h2>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-border hover:border-foreground"
            aria-label="Close product editor"
          >
            <X size={18} />
          </button>
        </div>

        <form
          id="product-editor-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-5"
        >
          {error && (
            <div className="mb-4 rounded-[6px] border border-[color:var(--destructive)] bg-[color:var(--destructive)]/8 px-4 py-3 text-sm text-[color:var(--destructive)]">
              {error}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Product name"
              value={draft.name}
              onChange={(value) => updateDraft("name", value)}
            />
            <Field
              label="SKU / slug"
              value={draft.id}
              onChange={(value) => updateDraft("id", slugify(value))}
              placeholder="auto-generated-from-name"
            />
            <Field
              label="Price"
              type="number"
              value={draft.price}
              onChange={(value) => updateDraft("price", value)}
            />
            <Field
              label="Stock"
              type="number"
              value={draft.stock}
              onChange={(value) => updateDraft("stock", value)}
            />
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Category
              </span>
              <select
                value={draft.category}
                onChange={(event) => updateDraft("category", event.target.value as CategoryKey)}
                className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
              >
                {categories.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Status
              </span>
              <select
                value={draft.status}
                onChange={(event) => updateDraft("status", event.target.value as ProductStatus)}
                className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
              >
                <option>Live</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </label>
            <div className="md:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Product image
              </span>
              <div className="grid gap-3 rounded-[8px] border border-dashed border-border bg-[color:var(--cream)] p-4 md:grid-cols-[120px_1fr]">
                <img
                  src={draft.image || products[0]?.image}
                  alt=""
                  className="h-32 w-full rounded-[6px] object-cover md:w-28"
                />
                <div className="flex flex-col justify-center gap-3">
                  <label className="inline-flex w-fit cursor-pointer items-center justify-center rounded-[6px] bg-foreground px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-[color:var(--accent)]">
                    {isUploading ? "Uploading..." : "Upload from device"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={isUploading}
                      onChange={(event) => handleImageUpload(event.target.files?.[0])}
                    />
                  </label>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    JPG, PNG, or WebP. The image is uploaded to Supabase Storage and linked to this
                    product automatically.
                  </p>
                  <input
                    value={draft.image}
                    onChange={(event) => updateDraft("image", event.target.value)}
                    placeholder="Or paste an image URL"
                    className="h-10 w-full rounded-[6px] border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-foreground"
                  />
                </div>
              </div>
            </div>
            <Field
              label="Sizes"
              value={draft.sizes}
              onChange={(value) => updateDraft("sizes", value)}
            />
            <Field
              label="Colors"
              value={draft.colors}
              onChange={(value) => updateDraft("colors", value)}
            />
            <Field
              label="Merchandising tag"
              value={draft.tag ?? ""}
              onChange={(value) => updateDraft("tag", value)}
              placeholder="New, Signature, Limited"
            />
            <label className="mt-7 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.bestSeller}
                onChange={(event) => updateDraft("bestSeller", event.target.checked)}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
              Feature as best seller
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Description
              </span>
              <textarea
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
                rows={4}
                className="w-full rounded-[6px] border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </label>
          </div>

          <div className="mt-6 rounded-[8px] border border-border bg-[color:var(--cream)] p-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Preview
            </p>
            <div className="flex gap-4">
              <img
                src={draft.image || products[0]?.image}
                alt=""
                className="h-24 w-20 rounded-[6px] object-cover"
              />
              <div>
                <p className="font-display text-2xl">{draft.name || "Product name"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{draft.category}</p>
                <p className="mt-2 text-sm tabular-nums">
                  {draft.price ? ngn(Number(draft.price)) : "NGN 0"}
                </p>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-border px-4 py-2.5 text-xs uppercase tracking-[0.18em] hover:border-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-editor-form"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-[6px] bg-[color:var(--accent)] px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-white hover:bg-foreground"
          >
            <Save size={15} />
            {isSaving ? "Saving" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentTab({
  content,
  onContentChange,
}: {
  content: ContentState;
  onContentChange: (content: ContentState) => void;
}) {
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const updateDraft = (path: Array<string | number>, value: unknown) => {
    setDraft((current) => setValueAtPath(current, path, value) as ContentState);
    setSaved(false);
  };

  const saveContent = async () => {
    try {
      const savedContent = await saveSiteContent(draft);
      onContentChange(savedContent);
      setDraft(savedContent);
      setSaved(true);
      setError("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save content.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Panel
        title="Full Website Content"
        action={
          <button
            onClick={saveContent}
            className="inline-flex items-center gap-2 rounded-[6px] bg-[color:var(--accent)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white hover:bg-foreground"
          >
            {saved ? <Check size={15} /> : <Save size={15} />}
            {saved ? "Saved" : "Save"}
          </button>
        }
      >
        {error && (
          <div className="mb-4 rounded-[6px] border border-[color:var(--destructive)] bg-[color:var(--destructive)]/8 px-4 py-3 text-sm text-[color:var(--destructive)]">
            {error}
          </div>
        )}
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Edit storefront copy here. Products, prices, stock, and product images stay in the
            Products tab.
          </p>
          {Object.entries(draft).map(([section, value]) => (
            <EditableNode
              key={section}
              label={humanize(section)}
              value={value}
              path={[section]}
              onChange={updateDraft}
            />
          ))}
        </div>
      </Panel>

      <Panel title="Live Preview">
        <div className="rounded-[8px] bg-[color:var(--coffee-deep)] p-5 text-background">
          <p className="mb-5 rounded-[6px] bg-background/10 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-background/75">
            {draft.home.announcement}
          </p>
          <p className="eyebrow mb-3 text-background/60">{draft.home.heroEyebrow}</p>
          <h2 className="font-display text-5xl leading-[1.02]">
            {draft.home.heroLineOne} {draft.home.heroAccent} {draft.home.heroLineTwo}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-background/70">{draft.home.heroCopy}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-[6px] bg-[color:var(--accent)] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white">
              {draft.home.primaryCta}
            </span>
            <span className="rounded-[6px] border border-background/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em]">
              {draft.home.secondaryCta}
            </span>
          </div>
        </div>
        <div className="mt-4 rounded-[8px] border border-border bg-[color:var(--cream)] p-4 text-sm">
          <p className="eyebrow mb-2">Editable Sections</p>
          <p className="text-muted-foreground">
            General, Homepage, Shop, About, Contact, FAQ, footer contact details, testimonials,
            reasons, legal copy, and repeated text blocks.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function EditableNode({
  label,
  value,
  path,
  onChange,
}: {
  label: string;
  value: unknown;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: unknown) => void;
}) {
  if (typeof value === "string") {
    const isLong = value.length > 70 || value.includes("\n");
    return (
      <label className="block">
        <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        {isLong ? (
          <textarea
            value={value}
            rows={Math.min(6, Math.max(3, value.split("\n").length + 1))}
            onChange={(event) => onChange(path, event.target.value)}
            className="w-full rounded-[6px] border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        ) : (
          <input
            value={value}
            onChange={(event) => onChange(path, event.target.value)}
            className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground"
          />
        )}
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="rounded-[8px] border border-border bg-[color:var(--cream)] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <button
            type="button"
            onClick={() => onChange(path, [...value, cloneEditableValue(value[0])])}
            className="rounded-[6px] border border-border bg-background px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] hover:border-foreground"
          >
            Add
          </button>
        </div>
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="rounded-[6px] border border-border bg-background p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {label} {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      path,
                      value.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--destructive)]"
                >
                  Remove
                </button>
              </div>
              <EditableNode
                label={`${label} ${index + 1}`}
                value={item}
                path={[...path, index]}
                onChange={onChange}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <details open className="rounded-[8px] border border-border bg-background p-4">
        <summary className="cursor-pointer font-display text-xl">{label}</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.entries(value as Record<string, unknown>).map(([key, childValue]) => (
            <div
              key={key}
              className={
                typeof childValue === "object" && childValue !== null ? "md:col-span-2" : ""
              }
            >
              <EditableNode
                label={humanize(key)}
                value={childValue}
                path={[...path, key]}
                onChange={onChange}
              />
            </div>
          ))}
        </div>
      </details>
    );
  }

  return null;
}

function OrdersTab() {
  const rows = [
    { id: "LK-10456", customer: "Aisha A.", total: 145000, status: "Processing" },
    { id: "LK-10455", customer: "Halima O.", total: 185000, status: "Pending" },
    { id: "LK-10454", customer: "Fatima B.", total: 220000, status: "Delivered" },
    { id: "LK-10453", customer: "Zainab K.", total: 78000, status: "Cancelled" },
  ];
  return (
    <Panel title="Orders MVP">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="py-3 font-medium">Order</th>
              <th className="py-3 font-medium">Customer</th>
              <th className="py-3 font-medium">Total</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="py-4 font-display text-base">{row.id}</td>
                <td className="py-4">{row.customer}</td>
                <td className="py-4 tabular-nums">{ngn(row.total)}</td>
                <td className="py-4">{row.status}</td>
                <td className="py-4">
                  <button className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function CustomersTab() {
  const rows = [
    { name: "Aisha A.", email: "aisha@example.com", orders: 6, spend: 1240000 },
    { name: "Halima O.", email: "halima@example.com", orders: 4, spend: 820000 },
    { name: "Fatima B.", email: "fatima@example.com", orders: 9, spend: 1860000 },
    { name: "Zainab K.", email: "zainab@example.com", orders: 2, spend: 320000 },
  ];
  return (
    <Panel title="Customers MVP">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <div
            key={row.email}
            className="rounded-[8px] border border-border bg-[color:var(--cream)] p-4"
          >
            <p className="font-display text-2xl">{row.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{row.email}</p>
            <div className="mt-4 flex justify-between text-xs">
              <span>{row.orders} orders</span>
              <span className="tabular-nums">{ngn(row.spend)}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MarketingTab({ content }: { content: ContentState }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Campaign Builder">
        <div className="grid gap-4">
          <Field label="Campaign name" value="Eid Collection 2026" onChange={() => undefined} />
          <Field label="Promo code" value="LKEID15" onChange={() => undefined} />
          <Field
            label="Homepage announcement"
            value={content.announcement}
            onChange={() => undefined}
          />
          <button className="inline-flex w-fit items-center gap-2 rounded-[6px] bg-[color:var(--accent)] px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-white hover:bg-foreground">
            <Megaphone size={15} />
            Prepare Campaign
          </button>
        </div>
      </Panel>
      <Panel title="Audience">
        <p className="font-display text-5xl">1,842</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Newsletter subscribers ready for export.
        </p>
        <button className="mt-5 rounded-[6px] border border-border px-4 py-2.5 text-xs uppercase tracking-[0.18em] hover:border-foreground">
          Export CSV
        </button>
      </Panel>
    </div>
  );
}

function SettingsTab({
  content,
  onContentChange,
}: {
  content: ContentState;
  onContentChange: (content: ContentState) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Store Information">
        <div className="grid gap-4">
          <Field
            label="Store email"
            value={content.general.email}
            onChange={(value) =>
              onContentChange({ ...content, general: { ...content.general, email: value } })
            }
          />
          <Field
            label="Store address"
            value={content.general.address}
            onChange={(value) =>
              onContentChange({ ...content, general: { ...content.general, address: value } })
            }
          />
          <Field
            label="Instagram"
            value={content.general.instagram}
            onChange={(value) =>
              onContentChange({ ...content, general: { ...content.general, instagram: value } })
            }
          />
        </div>
      </Panel>
      <Panel title="Commerce Settings">
        <div className="space-y-3 text-sm">
          <Toggle label="Paystack checkout" checked />
          <Toggle label="WhatsApp checkout" checked />
          <Toggle label="Bank transfer" />
          <Toggle label="Automatic low-stock alerts" checked />
        </div>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-border bg-background p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl">{title}</h2>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  helper,
  tone = "default",
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "default" | "good" | "warn";
}) {
  const toneClass =
    tone === "warn"
      ? "text-[color:var(--destructive)]"
      : tone === "good"
        ? "text-[color:var(--accent)]"
        : "text-muted-foreground";
  return (
    <div className="rounded-[8px] border border-border bg-background p-5 shadow-sm">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl leading-none">{value}</p>
      <p className={`mt-3 text-xs ${toneClass}`}>{helper}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground"
      />
    </label>
  );
}

function IconButton({
  label,
  children,
  onClick,
  danger = false,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-border transition-colors hover:border-foreground ${
        danger
          ? "hover:bg-[color:var(--destructive)] hover:text-white"
          : "hover:bg-[color:var(--cream)]"
      }`}
    >
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: ProductStatus }) {
  const classes =
    status === "Live"
      ? "bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
      : status === "Draft"
        ? "bg-[color:var(--cream)] text-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${classes}`}>
      {status}
    </span>
  );
}

function Task({ label, done = false }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-[6px] border border-border bg-[color:var(--cream)] px-3 py-3 text-sm">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
          done ? "bg-[color:var(--accent)] text-white" : "border border-border bg-background"
        }`}
      >
        {done && <Check size={14} />}
      </span>
      {label}
    </div>
  );
}

function Toggle({ label, checked = false }: { label: string; checked?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-[6px] border border-border px-3 py-3">
      <span>{label}</span>
      <input
        type="checkbox"
        defaultChecked={checked}
        className="h-4 w-4 accent-[color:var(--accent)]"
      />
    </label>
  );
}

function productToDraft(product: AdminProduct | null): ProductDraft {
  if (!product) return blankDraft();
  return {
    ...product,
    price: String(product.price),
    stock: String(product.stock),
    sizes: product.sizes.join(", "),
    colors: product.colors.join(", "),
    tag: product.tag ?? "",
    bestSeller: Boolean(product.bestSeller),
  };
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function setValueAtPath(source: unknown, path: Array<string | number>, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;

  if (Array.isArray(source)) {
    return source.map((item, index) => (index === head ? setValueAtPath(item, rest, value) : item));
  }

  if (source && typeof source === "object") {
    return {
      ...(source as Record<string, unknown>),
      [head]: setValueAtPath((source as Record<string, unknown>)[head], rest, value),
    };
  }

  return source;
}

function cloneEditableValue(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [
        key,
        cloneEditableValue(child),
      ]),
    );
  }
  return "";
}

function humanize(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
