import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { WhatsAppFab } from "../components/site/WhatsAppFab";
import preloaderImage from "../assets/lk-preloader.png";
import {
  absoluteUrl,
  organizationJsonLd,
  siteDescription,
  siteName,
  websiteJsonLd,
} from "../lib/seo";
import { JsonLd } from "../components/site/JsonLd";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LK Clothiers" },
      {
        name: "description",
        content: siteDescription,
      },
      { name: "author", content: "LK Clothiers" },
      { name: "robots", content: "index,follow" },
      { name: "googlebot", content: "index,follow,max-image-preview:large" },
      { name: "theme-color", content: "#b66a24" },
      { property: "og:site_name", content: siteName },
      { property: "og:title", content: "LK Clothiers" },
      { property: "og:description", content: siteDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@lkclothiers" },
      { name: "twitter:title", content: "LK Clothiers" },
      { name: "twitter:description", content: siteDescription },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Poppins:wght@400;500;600&family=Montserrat:wght@500;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&family=Dancing+Script:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    const storageKey = window.location.pathname.startsWith("/admin")
      ? "lk_admin_preloader_seen"
      : "lk_site_preloader_seen";
    if (window.sessionStorage.getItem(storageKey) === "true") return;

    window.sessionStorage.setItem(storageKey, "true");
    setShowPreloader(true);
    document.body.classList.add("lk-preloader-active");
    const timer = window.setTimeout(() => {
      setShowPreloader(false);
      document.body.classList.remove("lk-preloader-active");
    }, 3200);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("lk-preloader-active");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {showPreloader && <SitePreloader />}
        <div className="bg-background text-foreground overflow-x-hidden">
          <Header />
          <main className="pt-16">
            <JsonLd data={organizationJsonLd} />
            <JsonLd data={websiteJsonLd} />
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          <Footer />
          <WhatsAppFab />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}

function SitePreloader() {
  return (
    <div className="lk-site-preloader" role="status" aria-label="Loading LK Clothiers">
      <div className="lk-site-preloader__glow" />
      <img
        src={preloaderImage}
        alt="LK Clothiers tailoring scissors and measuring tape"
        className="lk-site-preloader__image"
      />
    </div>
  );
}
