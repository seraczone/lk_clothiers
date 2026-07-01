import { createFileRoute } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Check,
  Copy,
  Edit3,
  Eye,
  FileText,
  ImageUp,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
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
  adminCategories,
  defaultContent,
  deleteAdminCategory,
  deleteAdminProduct,
  getSiteContent,
  listAdminCategories,
  listAdminProducts,
  saveSiteContent,
  seedProducts,
  uploadProductImage,
  upsertAdminCategory,
  upsertAdminProduct,
  type AdminCategory,
  type AdminProduct,
  type ContentState,
  type ProductStatus,
} from "@/lib/admin-data";
import { ngn, products, type CategoryKey, type ProductVariant } from "@/lib/catalog";
import { isSupabaseConfigured, supabase, supabaseConfigError } from "@/lib/supabase";
import { deliveryMethodLabels, formatOrderDate, listOrders, type SavedOrder } from "@/lib/orders";

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
  useVariants: boolean;
  variants: ProductVariant[];
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
  colorImages: {},
  description: "",
  tag: "",
  bestSeller: false,
  stock: "12",
  status: "Draft",
  useVariants: false,
  variants: [],
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

const adminEmails = [
  import.meta.env.VITE_ADMIN_EMAIL as string | undefined,
  import.meta.env.VITE_ADMIN_EMAILS as string | undefined,
]
  .flatMap((value) => value?.split(",") ?? [])
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function isAllowedAdmin(email: string | null | undefined) {
  return Boolean(email && adminEmails.includes(email.trim().toLowerCase()));
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setAuthError(error.message);
          return;
        }
        setSession(data.session);
      })
      .finally(() => {
        if (mounted) setIsAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthError("");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const userEmail = session?.user.email ?? "";
  const canAccessAdmin = isAllowedAdmin(userEmail);

  if (isAuthLoading) {
    return <AdminAuthShell message="Checking admin access..." />;
  }

  if (!supabase || !isSupabaseConfigured) {
    return <AdminLoginScreen configError={supabaseConfigError} />;
  }

  if (!canAccessAdmin) {
    return (
      <AdminLoginScreen
        authError={authError}
        signedInEmail={session ? userEmail : ""}
        onSignOut={() => supabase.auth.signOut()}
      />
    );
  }

  return <AdminConsole userEmail={userEmail} onSignOut={() => supabase.auth.signOut()} />;
}

function AdminLoginScreen({
  authError = "",
  configError = "",
  signedInEmail = "",
  onSignOut,
}: {
  authError?: string;
  configError?: string;
  signedInEmail?: string;
  onSignOut?: () => Promise<unknown>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(authError);

  useEffect(() => {
    setError(authError);
  }, [authError]);

  const isAdminConfigured = adminEmails.length > 0;
  const isLockedOut = Boolean(configError || !isAdminConfigured);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError(supabaseConfigError);
      return;
    }

    if (!isAllowedAdmin(email)) {
      setError("This email is not allowed to access the admin console.");
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
    }
  };

  if (signedInEmail) {
    return (
      <AdminAuthShell>
        <div className="mx-auto max-w-md rounded-[8px] border border-border bg-background p-6 shadow-sm">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[6px] bg-[color:var(--cream)] text-[color:var(--accent)]">
            <LockKeyhole size={20} />
          </div>
          <p className="eyebrow mb-2">Access denied</p>
          <h1 className="font-display text-4xl">Admin only</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {signedInEmail} is signed in, but that email is not on the admin allowlist.
          </p>
          <button
            onClick={onSignOut}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[color:var(--accent)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-foreground"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </AdminAuthShell>
    );
  }

  return (
    <AdminAuthShell>
      <div className="mx-auto max-w-md rounded-[8px] border border-border bg-background p-6 shadow-sm">
        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[6px] bg-[color:var(--cream)] text-[color:var(--accent)]">
          <LockKeyhole size={20} />
        </div>
        <p className="eyebrow mb-2">Owner Workspace</p>
        <h1 className="font-display text-4xl">Admin sign in</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Sign in with the Supabase account assigned to manage LK Clothiers.
        </p>

        {(configError || !isAdminConfigured || error) && (
          <div className="mt-5 rounded-[6px] border border-[color:var(--destructive)] bg-[color:var(--destructive)]/8 px-4 py-3 text-sm text-[color:var(--destructive)]">
            {configError ||
              (!isAdminConfigured
                ? "Admin email is not configured. Add VITE_ADMIN_EMAIL or VITE_ADMIN_EMAILS to the environment."
                : error)}
          </div>
        )}

        <form onSubmit={submitLogin} className="mt-6 space-y-4">
          <Field
            label="Admin Email"
            type="email"
            value={email}
            onChange={setEmail}
            disabled={isLockedOut || isSubmitting}
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            disabled={isLockedOut || isSubmitting}
          />
          <button
            disabled={isLockedOut || isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[color:var(--accent)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <LockKeyhole size={15} />
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </AdminAuthShell>
  );
}

function AdminAuthShell({ message, children }: { message?: string; children?: ReactNode }) {
  return (
    <div className="-mt-16 flex min-h-screen items-center justify-center bg-[color:var(--cream)] px-4 py-20 text-foreground">
      {children ?? (
        <div className="rounded-[8px] border border-border bg-background px-5 py-4 text-sm text-muted-foreground shadow-sm">
          {message}
        </div>
      )}
    </div>
  );
}

function AdminConsole({
  userEmail,
  onSignOut,
}: {
  userEmail: string;
  onSignOut: () => Promise<unknown>;
}) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>(seedProducts);
  const [categories, setCategories] = useState<AdminCategory[]>(adminCategories);
  const [content, setContent] = useState<ContentState>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([listAdminProducts(), listAdminCategories(), getSiteContent()])
      .then(([loadedProducts, loadedCategories, loadedContent]) => {
        if (!mounted) return;
        setAdminProducts(loadedProducts.length > 0 ? loadedProducts : seedProducts);
        setCategories(loadedCategories.length > 0 ? loadedCategories : adminCategories);
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
              <p className="mt-1 normal-case tracking-normal text-background/70">{userEmail}</p>
              <button
                onClick={onSignOut}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-background/20 px-3 py-2.5 text-[10px] uppercase tracking-[0.18em] text-background/70 transition-colors hover:border-background/50 hover:text-background"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
          {dataError && (
            <div className="mb-5 rounded-[6px] border border-[color:var(--destructive)] bg-[color:var(--destructive)]/8 px-4 py-3 text-sm text-[color:var(--destructive)]">
              {dataError}
            </div>
          )}
          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-[6px] border border-[color:var(--destructive)] bg-[color:var(--destructive)]/8 px-4 py-3 text-sm text-[color:var(--destructive)]">
              {supabaseConfigError}
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
            <Dashboard
              products={adminProducts}
              categories={categories}
              content={content}
              lowStockCount={lowStockCount}
            />
          )}
          {tab === "products" && (
            <ProductsTab
              products={adminProducts}
              categories={categories}
              onProductsChange={setAdminProducts}
              onCategoriesChange={setCategories}
            />
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
  categories,
  content,
  lowStockCount,
}: {
  products: AdminProduct[];
  categories: AdminCategory[];
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
            <Task done={isSupabaseConfigured} label="Product CRUD is connected to Supabase" />
            <Task done={lowStockCount === 0} label="Review low-stock products" />
            <Task done={isSupabaseConfigured} label="Supabase tables and storage are configured" />
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
  categories,
  onProductsChange,
  onCategoriesChange,
}: {
  products: AdminProduct[];
  categories: AdminCategory[];
  onProductsChange: (products: AdminProduct[]) => void;
  onCategoriesChange: (categories: AdminCategory[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CategoryKey>("all");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState<AdminCategory>({
    key: "",
    name: "",
    image: "",
    tagline: "",
  });
  const [isCategoryUploading, setIsCategoryUploading] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [mutationSuccess, setMutationSuccess] = useState("");

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
      setMutationSuccess(`${savedProduct.name} was saved to Supabase.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save product.";
      setMutationError(message);
      setMutationSuccess("");
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
      setMutationSuccess(`${savedProduct.name} was duplicated in Supabase.`);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to duplicate product.");
      setMutationSuccess("");
    }
  };

  const deleteProduct = async (id: string) => {
    const product = adminProducts.find((item) => item.id === id);
    if (!product) return;
    if (window.confirm(`Delete ${product.name}? This removes it from Supabase products.`)) {
      try {
        await deleteAdminProduct(id);
        onProductsChange(adminProducts.filter((item) => item.id !== id));
        setMutationError("");
        setMutationSuccess(`${product.name} was deleted from Supabase.`);
      } catch (error) {
        setMutationError(error instanceof Error ? error.message : "Unable to delete product.");
        setMutationSuccess("");
      }
    }
  };

  const saveCategory = async (event: FormEvent) => {
    event.preventDefault();
    const key = slugify(categoryDraft.key || categoryDraft.name);
    if (!key || !categoryDraft.name.trim()) {
      setMutationError("Category name is required.");
      setMutationSuccess("");
      return;
    }

    try {
      const savedCategory = await upsertAdminCategory({
        key,
        name: categoryDraft.name.trim(),
        image: categoryDraft.image.trim() || products[0]?.image || "",
        tagline: categoryDraft.tagline.trim() || "LK collection",
      });
      const exists = categories.some((item) => item.key === savedCategory.key);
      onCategoriesChange(
        exists
          ? categories.map((item) => (item.key === savedCategory.key ? savedCategory : item))
          : [...categories, savedCategory],
      );
      setCategoryDraft({ key: "", name: "", image: "", tagline: "" });
      setMutationError("");
      setMutationSuccess(`${savedCategory.name} category was saved.`);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to save category.");
      setMutationSuccess("");
    }
  };

  const uploadCategoryImage = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMutationError("Choose a valid category image file.");
      setMutationSuccess("");
      return;
    }

    setIsCategoryUploading(true);
    setMutationError("");
    setMutationSuccess("");
    try {
      const folder = slugify(categoryDraft.key || categoryDraft.name) || "category";
      const uploadedUrl = await uploadProductImage(file, `category-${folder}`);
      setCategoryDraft((current) => ({ ...current, image: uploadedUrl }));
      setMutationSuccess("Category image uploaded. Save category to persist it.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to upload category image.");
      setMutationSuccess("");
    } finally {
      setIsCategoryUploading(false);
    }
  };

  const removeCategory = async (key: string) => {
    const categoryToDelete = categories.find((item) => item.key === key);
    if (!categoryToDelete) return;
    const hasProducts = adminProducts.some((product) => product.category === key);
    if (hasProducts) {
      setMutationError("Move products out of this category before deleting it.");
      setMutationSuccess("");
      return;
    }
    if (!window.confirm(`Delete ${categoryToDelete.name}?`)) return;

    try {
      await deleteAdminCategory(key);
      onCategoriesChange(categories.filter((item) => item.key !== key));
      setMutationError("");
      setMutationSuccess(`${categoryToDelete.name} category was deleted.`);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to delete category.");
      setMutationSuccess("");
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
        {mutationSuccess && (
          <div className="mb-4 rounded-[6px] border border-[color:var(--accent)] bg-[color:var(--accent)]/10 px-4 py-3 text-sm text-[color:var(--accent)]">
            {mutationSuccess}
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

      <Panel title="Create Product Categories">
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Add a new category here, then select it when creating or editing products.
        </p>
        <form onSubmit={saveCategory} className="grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr_1fr_auto]">
          <Field
            label="Name"
            value={categoryDraft.name}
            onChange={(value) =>
              setCategoryDraft((current) => ({
                ...current,
                name: value,
                key: current.key || slugify(value),
              }))
            }
          />
          <Field
            label="Slug"
            value={categoryDraft.key}
            onChange={(value) => setCategoryDraft((current) => ({ ...current, key: slugify(value) }))}
          />
          <Field
            label="Image URL"
            value={categoryDraft.image}
            placeholder="Optional"
            onChange={(value) => setCategoryDraft((current) => ({ ...current, image: value }))}
          />
          <Field
            label="Tagline"
            value={categoryDraft.tagline}
            onChange={(value) => setCategoryDraft((current) => ({ ...current, tagline: value }))}
          />
          <button
            type="submit"
            disabled={isCategoryUploading}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-[6px] bg-foreground px-4 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save Category
          </button>
        </form>
        <div className="mt-4 grid gap-3 rounded-[8px] border border-border bg-[color:var(--cream)] p-4 md:grid-cols-[120px_1fr]">
          {categoryDraft.image.trim() ? (
            <img
              src={categoryDraft.image}
              alt={categoryDraft.name ? `${categoryDraft.name} category preview` : "Category preview"}
              loading="lazy"
              className="h-28 w-full rounded-[6px] border border-border bg-background object-contain"
            />
          ) : (
            <div className="flex h-28 w-full items-center justify-center rounded-[6px] border border-dashed border-border bg-background text-xs uppercase tracking-[0.16em] text-muted-foreground">
              No image
            </div>
          )}
          <div className="flex flex-col justify-center gap-3">
            <label className="inline-flex h-11 w-fit cursor-pointer items-center gap-2 rounded-[6px] border border-border bg-background px-4 text-xs uppercase tracking-[0.18em] transition-colors hover:border-foreground has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
              <ImageUp size={15} />
              {isCategoryUploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                disabled={isCategoryUploading}
                className="sr-only"
                onChange={(event) => uploadCategoryImage(event.target.files?.[0])}
              />
            </label>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Upload fills the Image URL field. Save the category after upload so it persists in Supabase.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center gap-2 rounded-[6px] border border-border bg-[color:var(--cream)] px-3 py-2 text-xs"
            >
              {item.name}
              <button
                type="button"
                onClick={() => {
                  setCategoryDraft(item);
                }}
                className="uppercase tracking-[0.16em] text-[color:var(--accent)]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeCategory(item.key)}
                className="uppercase tracking-[0.16em] text-[color:var(--destructive)]"
              >
                Delete
              </button>
            </span>
          ))}
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
                        loading="lazy"
                        className="h-14 w-11 rounded-[4px] object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{product.category}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {product.useVariants && product.variants?.length
                      ? `${ngn(Math.min(...product.variants.map((variant) => variant.price)))}+`
                      : ngn(product.price)}
                  </td>
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
          categories={categories}
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
  categories,
  onClose,
  onSave,
}: {
  product: AdminProduct | null;
  products: AdminProduct[];
  categories: AdminCategory[];
  onClose: () => void;
  onSave: (product: AdminProduct) => Promise<void>;
}) {
  const [draft, setDraft] = useState<ProductDraft>(() => productToDraft(product));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const colorOptions = splitList(draft.colors);
  const sizeOptions = splitList(draft.sizes);
  const galleryOptions = normalizeGallery(draft.image, draft.gallery);

  useEffect(() => {
    if (categories.length === 0) return;
    if (categories.some((category) => category.key === draft.category)) return;
    updateDraft("category", categories[0].key);
  }, [categories, draft.category]);

  const updateDraft = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateColorImage = (color: string, imageUrl: string) => {
    setDraft((current) => {
      const nextColorImages = { ...(current.colorImages ?? {}) };
      const cleanUrl = imageUrl.trim();
      if (cleanUrl) {
        nextColorImages[color] = cleanUrl;
      } else {
        delete nextColorImages[color];
      }
      return { ...current, colorImages: nextColorImages };
    });
  };

  const updateVariantOption = (index: number, optionName: string, optionValue: string) => {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) => {
        if (variantIndex !== index) return variant;
        const options = { ...(variant.options ?? {}) };
        const cleanValue = optionValue.trim();
        if (cleanValue) {
          options[optionName] = cleanValue;
        } else {
          delete options[optionName];
        }
        return { ...variant, options };
      }),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedId = product?.id ?? slugify(draft.id || draft.name);
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
    if (categories.length === 0) {
      setError("Create a product category before saving products.");
      return;
    }
    if (!categories.some((category) => category.key === draft.category)) {
      setError("Choose an existing product category before saving.");
      return;
    }
    const parsedPrice = Number(draft.price);
    const parsedStock = Number(draft.stock);
    if (!draft.useVariants && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
      setError("Enter a valid product price.");
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }
    const imageUrl = draft.image.trim();
    if (!imageUrl) {
      setError("Upload a product image or paste a valid image URL before saving.");
      return;
    }
    if (isUploading) {
      setError("Wait for the image upload to finish before saving.");
      return;
    }
    const variants = draft.useVariants
      ? draft.variants.map((variant, index) => ({
          ...variant,
          id: variant.id || `${normalizedId}-${Date.now()}-${index}`,
          productId: normalizedId,
          options: normalizeVariantOptions(variant.options),
          variantType: variant.variantType.trim(),
          variantValue: variant.variantValue.trim(),
          sku: variant.sku?.trim() || undefined,
          price: Number(variant.price),
          stock: Math.round(Number(variant.stock)),
          position: index,
        }))
        .map((variant) => {
          if (variant.variantType && variant.variantValue) return variant;
          const optionLabel = formatVariantOptions(variant.options);
          return {
            ...variant,
            variantType: variant.variantType || (optionLabel ? "Options" : ""),
            variantValue: variant.variantValue || optionLabel,
          };
        })
      : [];
    if (
      draft.useVariants &&
      (variants.length === 0 ||
        variants.some(
          (variant) =>
            !variant.variantType ||
            !variant.variantValue ||
            !Number.isFinite(variant.price) ||
            variant.price < 0 ||
            !Number.isFinite(variant.stock) ||
            variant.stock < 0,
        ))
    ) {
      setError("Each variant needs a type, value, valid price, and valid stock.");
      return;
    }
    setIsSaving(true);
    try {
      const colorImages = normalizeProductColorImages(colorOptions, draft.colorImages);
      const gallery = normalizeGallery(imageUrl, [
        ...(draft.gallery ?? []),
        ...Object.values(colorImages),
      ]);
      await onSave({
        id: normalizedId,
        name: draft.name.trim(),
        price: draft.useVariants ? variants[0]?.price ?? 0 : parsedPrice,
        useVariants: draft.useVariants,
        variants,
        category: draft.category,
        image: imageUrl,
        gallery,
        colorImages,
        sizes: splitList(draft.sizes),
        colors: colorOptions,
        description: draft.description.trim(),
        tag: (draft.tag ?? "").trim() || undefined,
        bestSeller: draft.bestSeller,
        stock: draft.useVariants
          ? variants.reduce((total, variant) => total + variant.stock, 0)
          : Math.round(parsedStock),
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
      updateDraft("gallery", normalizeGallery(uploadedUrl, draft.gallery));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    const imageFiles = Array.from(files ?? []);
    if (imageFiles.length === 0) return;
    const invalidFile = imageFiles.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      setError("Choose only valid image files.");
      return;
    }

    setIsUploading(true);
    setError("");
    try {
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        uploadedUrls.push(await uploadProductImage(file, slugify(draft.id || draft.name)));
      }
      const primaryImage = draft.image.trim() || uploadedUrls[0] || "";
      setDraft((current) => ({
        ...current,
        image: current.image.trim() || primaryImage,
        gallery: normalizeGallery(primaryImage, [...(current.gallery ?? []), ...uploadedUrls]),
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload images.");
    } finally {
      setIsUploading(false);
    }
  };

  const addGalleryUrl = () => {
    const url = galleryUrlInput.trim();
    if (!url) return;
    setDraft((current) => {
      const primaryImage = current.image.trim() || url;
      return {
        ...current,
        image: primaryImage,
        gallery: normalizeGallery(primaryImage, [...(current.gallery ?? []), url]),
      };
    });
    setGalleryUrlInput("");
  };

  const setPrimaryImage = (url: string) => {
    setDraft((current) => ({
      ...current,
      image: url,
      gallery: normalizeGallery(url, current.gallery),
    }));
  };

  const removeGalleryImage = (url: string) => {
    setDraft((current) => {
      const gallery = (current.gallery ?? []).filter((item) => item !== url);
      const image = current.image === url ? (gallery[0] ?? "") : current.image;
      return {
        ...current,
        image,
        gallery: image ? normalizeGallery(image, gallery) : gallery,
      };
    });
  };

  const addVariant = () => {
    const productId = product?.id ?? (slugify(draft.id || draft.name) || "product");
    setDraft((current) => ({
      ...current,
      variants: [
        ...(current.variants ?? []),
        {
          id: `${productId}-variant-${Date.now()}`,
          productId,
          variantType: colorOptions.length || sizeOptions.length ? "Options" : "Age",
          variantValue: "",
          options: {
            ...(colorOptions[0] ? { Color: colorOptions[0] } : {}),
            ...(sizeOptions[0] ? { Size: sizeOptions[0] } : {}),
          },
          price: Number(current.price) || 0,
          stock: 0,
          sku: "",
          position: current.variants?.length ?? 0,
        },
      ],
    }));
  };

  const updateVariant = <K extends keyof ProductVariant>(
    index: number,
    key: K,
    value: ProductVariant[K],
  ) => {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [key]: value } : variant,
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setDraft((current) => ({
      ...current,
      variants: current.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  };

  const moveVariant = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.variants.length) return current;
      const variants = [...current.variants];
      [variants[index], variants[target]] = [variants[target], variants[index]];
      return { ...current, variants };
    });
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
              label={product ? "SKU / slug (locked)" : "SKU / slug"}
              value={draft.id}
              onChange={(value) => updateDraft("id", slugify(value))}
              placeholder="auto-generated-from-name"
              disabled={Boolean(product)}
            />
            <Field
              label="Price"
              type="number"
              value={draft.price}
              onChange={(value) => updateDraft("price", value)}
              disabled={draft.useVariants}
            />
            <Field
              label="Stock"
              type="number"
              value={draft.stock}
              onChange={(value) => updateDraft("stock", value)}
              disabled={draft.useVariants}
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
            <label className="mt-7 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.useVariants}
                onChange={(event) => updateDraft("useVariants", event.target.checked)}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
              Use Product Variants
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
                  loading="lazy"
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
            <div className="md:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Gallery images
              </span>
              <div className="rounded-[8px] border border-border bg-background p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-medium">Detail page gallery</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Upload multiple color variants. Select one image as Primary for product cards.
                    </p>
                  </div>
                  <label className="inline-flex w-fit cursor-pointer items-center justify-center rounded-[6px] bg-foreground px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-[color:var(--accent)]">
                    {isUploading ? "Uploading..." : "Upload gallery"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      disabled={isUploading}
                      onChange={(event) => handleGalleryUpload(event.target.files)}
                    />
                  </label>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    value={galleryUrlInput}
                    onChange={(event) => setGalleryUrlInput(event.target.value)}
                    placeholder="Paste an additional image URL"
                    className="h-10 min-w-0 flex-1 rounded-[6px] border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-foreground"
                  />
                  <button
                    type="button"
                    onClick={addGalleryUrl}
                    className="rounded-[6px] border border-border px-3 text-xs uppercase tracking-[0.16em] hover:border-foreground"
                  >
                    Add
                  </button>
                </div>
                {(draft.gallery?.length ?? 0) > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {draft.gallery?.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className={`overflow-hidden rounded-[8px] border bg-[color:var(--cream)] ${
                          draft.image === url ? "border-[color:var(--accent)]" : "border-border"
                        }`}
                      >
                        <img src={url} alt="" loading="lazy" className="h-32 w-full object-cover" />
                        <div className="grid grid-cols-2 border-t border-border text-[10px] uppercase tracking-[0.14em]">
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(url)}
                            className={`px-2 py-2 ${
                              draft.image === url
                                ? "bg-[color:var(--accent)] text-white"
                                : "hover:bg-background"
                            }`}
                          >
                            {draft.image === url ? "Primary" : "Use"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(url)}
                            className="border-l border-border px-2 py-2 text-[color:var(--destructive)] hover:bg-background"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-[6px] bg-[color:var(--cream)] px-3 py-3 text-xs text-muted-foreground">
                    No gallery images yet. The primary product image will be used by default.
                  </p>
                )}
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
            {colorOptions.length > 0 && (
              <div className="md:col-span-2">
                <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Color images
                </span>
                <div className="rounded-[8px] border border-border bg-background p-4">
                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                    These rows are created from the Colors field. Assign the correct gallery image
                    to each color so the storefront changes image when a customer selects a color.
                  </p>
                  <div className="space-y-3">
                    {colorOptions.map((color) => {
                      const selectedImage = draft.colorImages?.[color] ?? "";
                      return (
                        <div
                          key={color}
                          className="grid gap-3 rounded-[8px] border border-border bg-[color:var(--cream)] p-3 md:grid-cols-[120px_1fr]"
                        >
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              {color}
                            </p>
                            <div className="mt-2 aspect-[4/5] overflow-hidden rounded-[6px] bg-background">
                              {selectedImage ? (
                                <img
                                  src={selectedImage}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center px-3 text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="block">
                              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                Choose from gallery
                              </span>
                              <select
                                value={selectedImage}
                                onChange={(event) => updateColorImage(color, event.target.value)}
                                className="h-10 w-full rounded-[6px] border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-foreground"
                              >
                                <option value="">No color image</option>
                                {galleryOptions.map((url, index) => (
                                  <option key={`${url}-${index}`} value={url}>
                                    Image {index + 1}
                                    {draft.image === url ? " - Primary" : ""}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <input
                              value={selectedImage}
                              onChange={(event) => updateColorImage(color, event.target.value)}
                              placeholder="Or paste an exact image URL for this color"
                              className="h-10 w-full rounded-[6px] border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-foreground"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
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

          {draft.useVariants && (
            <div className="mt-6 rounded-[8px] border border-border bg-background p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-2xl">Product Variants</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add price and stock options such as age, size, color, material, or any future
                    variant type.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-2 rounded-[6px] bg-foreground px-3 py-2 text-xs uppercase tracking-[0.18em] text-background hover:bg-[color:var(--accent)]"
                >
                  <Plus size={14} />
                  Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {draft.variants.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    className="grid gap-3 rounded-[8px] border border-border bg-[color:var(--cream)] p-3 lg:grid-cols-[1fr_1fr_1fr_1fr_120px_100px_1fr_auto]"
                  >
                    {colorOptions.length > 0 && (
                      <label className="block">
                        <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          Color
                        </span>
                        <select
                          value={variant.options?.Color ?? ""}
                          onChange={(event) =>
                            updateVariantOption(index, "Color", event.target.value)
                          }
                          className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground"
                        >
                          <option value="">Any color</option>
                          {colorOptions.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    {sizeOptions.length > 0 && (
                      <label className="block">
                        <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          Size
                        </span>
                        <select
                          value={variant.options?.Size ?? ""}
                          onChange={(event) => updateVariantOption(index, "Size", event.target.value)}
                          className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground"
                        >
                          <option value="">Any size</option>
                          {sizeOptions.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <Field
                      label="Variant Type"
                      value={variant.variantType}
                      onChange={(value) => updateVariant(index, "variantType", value)}
                      placeholder="Age, Size, Color"
                    />
                    <Field
                      label="Value"
                      value={variant.variantValue}
                      onChange={(value) => updateVariant(index, "variantValue", value)}
                      placeholder="2-3 Years, Medium"
                    />
                    <Field
                      label="Price"
                      type="number"
                      value={String(variant.price)}
                      onChange={(value) => updateVariant(index, "price", Number(value))}
                    />
                    <Field
                      label="Stock"
                      type="number"
                      value={String(variant.stock)}
                      onChange={(value) => updateVariant(index, "stock", Number(value))}
                    />
                    <Field
                      label="SKU"
                      value={variant.sku ?? ""}
                      onChange={(value) => updateVariant(index, "sku", value)}
                      placeholder="Optional"
                    />
                    <div className="mt-5 flex items-center gap-1">
                      <IconButton label="Move variant up" onClick={() => moveVariant(index, -1)}>
                        <ArrowUp size={14} />
                      </IconButton>
                      <IconButton label="Move variant down" onClick={() => moveVariant(index, 1)}>
                        <ArrowDown size={14} />
                      </IconButton>
                      <IconButton
                        label="Delete variant"
                        onClick={() => removeVariant(index)}
                        danger
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </div>
                  </div>
                ))}
                {draft.variants.length === 0 && (
                  <p className="rounded-[6px] bg-[color:var(--cream)] px-3 py-3 text-xs text-muted-foreground">
                    No variants yet. Add at least one variant before saving with variants enabled.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-[8px] border border-border bg-[color:var(--cream)] p-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Preview
            </p>
            <div className="flex gap-4">
              <img
                src={draft.image || products[0]?.image}
                alt=""
                loading="lazy"
                className="h-24 w-20 rounded-[6px] object-cover"
              />
              <div>
                <p className="font-display text-2xl">{draft.name || "Product name"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{draft.category}</p>
                <p className="mt-2 text-sm tabular-nums">
                  {draft.useVariants && draft.variants.length > 0
                    ? `${ngn(Math.min(...draft.variants.map((variant) => Number(variant.price) || 0)))}+`
                    : draft.price
                      ? ngn(Number(draft.price))
                      : "NGN 0"}
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
            disabled={isSaving || isUploading}
            className="inline-flex items-center gap-2 rounded-[6px] bg-[color:var(--accent)] px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-white hover:bg-foreground"
          >
            <Save size={15} />
            {isSaving
              ? "Saving"
              : isUploading
                ? "Uploading"
                : product
                  ? "Update Product"
                  : "Save Product"}
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
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
  const rows: Array<{
    id: string;
    customer: string;
    total: number;
    status: string;
    delivery?: string;
    date?: string;
    order?: SavedOrder;
  }> = [
    ...orders.map((order) => ({
      id: order.id,
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      total: order.total,
      status: order.status,
      delivery: deliveryMethodLabels[order.deliveryMethod],
      date: formatOrderDate(order.createdAt),
      order,
    })),
    { id: "LK-10456", customer: "Aisha A.", total: 145000, status: "Processing" },
    { id: "LK-10455", customer: "Halima O.", total: 185000, status: "Pending" },
    { id: "LK-10454", customer: "Fatima B.", total: 220000, status: "Delivered" },
    { id: "LK-10453", customer: "Zainab K.", total: 78000, status: "Cancelled" },
  ];

  useEffect(() => {
    let mounted = true;
    listOrders().then((loadedOrders) => {
      if (mounted) setOrders(loadedOrders);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Panel title="Orders MVP">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="py-3 font-medium">Order</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Customer</th>
              <th className="py-3 font-medium">Delivery</th>
              <th className="py-3 font-medium">Total</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="py-4 font-display text-base">{row.id}</td>
                <td className="py-4">{row.date ?? "Stored order"}</td>
                <td className="py-4">{row.customer}</td>
                <td className="py-4">{row.delivery ?? "Not captured"}</td>
                <td className="py-4 tabular-nums">{ngn(row.total)}</td>
                <td className="py-4">{row.status}</td>
                <td className="py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(row.order ?? null)}
                    disabled={!row.order}
                    className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] disabled:cursor-not-allowed disabled:text-muted-foreground"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="mt-6 grid gap-4 rounded-[8px] border border-border bg-[color:var(--cream)] p-5 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">Order Details</p>
            <h3 className="font-display text-2xl">{selectedOrder.id}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Delivery method</dt>
                <dd>{deliveryMethodLabels[selectedOrder.deliveryMethod]}</dd>
              </div>
              {selectedOrder.deliveryAddress && (
                <div>
                  <dt className="text-muted-foreground">Delivery address</dt>
                  <dd>{selectedOrder.deliveryAddress}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Customer email</dt>
                <dd>{selectedOrder.customer.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{selectedOrder.customer.phone}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <p className="eyebrow mb-2">Items</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}-${item.variantId ?? ""}`}
                    className="rounded-[6px] border border-border bg-background px-3 py-2 text-sm"
                  >
                    <p className="font-medium">{item.name ?? item.id}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[item.color, item.size, formatCartVariant(item), `Qty: ${item.qty}`]
                        .filter(Boolean)
                        .join(" - ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-2">Order Notification</p>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-[6px] border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
              {selectedOrder.adminNotificationBody}
            </pre>
          </div>
        </div>
      )}
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
            value={content.home.announcement}
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
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
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
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
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
    gallery: normalizeGallery(product.image, product.gallery),
    price: String(product.price),
    stock: String(product.stock),
    sizes: product.sizes.join(", "),
    colors: product.colors.join(", "),
    tag: product.tag ?? "",
    bestSeller: Boolean(product.bestSeller),
  };
}

function normalizeGallery(primaryImage: string, gallery: string[] | undefined) {
  const ordered = [primaryImage, ...(gallery ?? [])].map((item) => item.trim()).filter(Boolean);
  return Array.from(new Set(ordered));
}

function normalizeProductColorImages(
  colors: string[],
  colorImages: Record<string, string> | undefined,
) {
  return colors.reduce<Record<string, string>>((nextColorImages, color) => {
    const image = colorImages?.[color]?.trim();
    if (image) nextColorImages[color] = image;
    return nextColorImages;
  }, {});
}

function normalizeVariantOptions(options: Record<string, string> | undefined) {
  if (!options) return undefined;
  const entries = Object.entries(options)
    .map(([key, value]) => [key.trim(), value.trim()] as const)
    .filter(([key, value]) => key && value);
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function formatVariantOptions(options: Record<string, string> | undefined) {
  return Object.entries(options ?? {})
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join(" / ");
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

function formatCartVariant(item: {
  variantType?: string;
  variantValue?: string;
  variantOptions?: Record<string, string>;
}) {
  const optionLabel = formatVariantOptions(item.variantOptions);
  if (optionLabel) return optionLabel;
  if (!item.variantType || !item.variantValue) return "";
  return `${item.variantType}: ${item.variantValue}`;
}
