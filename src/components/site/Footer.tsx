import { Link } from "@tanstack/react-router";
import logo from "@/assets/lk-logo.png";
import { useSiteContent } from "@/hooks/use-site-content";
import { categories } from "@/lib/catalog";
import { genericWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const content = useSiteContent();

  return (
    <footer className="bg-foreground text-background pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16 reveal is-in">
          <div className="md:col-span-2">
            <Link to="/" aria-label="LK Clothiers home" className="inline-flex">
              <img
                src={logo}
                alt="LK Clothiers"
                className="h-32 w-72 object-contain brightness-125 contrast-125"
              />
            </Link>
            <p className="mt-4 text-background/60 max-w-sm text-sm leading-relaxed">
              {content.general.footerCopy}
            </p>
            <form className="mt-8 flex gap-3 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                className="flex-1 bg-transparent border border-background/30 px-4 py-3 text-sm placeholder:text-background/40 focus:outline-none focus:border-[color:var(--accent)] transition-colors"
                placeholder={content.general.newsletterPlaceholder}
              />
              <button className="bg-[color:var(--accent)] text-background px-5 text-xs uppercase tracking-[0.25em] hover:bg-background hover:text-foreground transition-colors">
                {content.general.newsletterButton}
              </button>
            </form>
          </div>
          <div>
            <p className="eyebrow mb-5 text-background/50">Shop</p>
            <ul className="space-y-3 text-sm">
              {categories.map((category) => (
                <li key={category.key}>
                  <Link
                    to="/shop/$category"
                    params={{ category: category.key }}
                    className="lk-link"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-background/50">Help</p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link className="lk-link" to="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="lk-link" to="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="lk-link" to="/faq">
                  FAQs
                </Link>
              </li>
              <li>
                <Link className="lk-link" to="/account">
                  My Account
                </Link>
              </li>
              <li>
                <a className="lk-link" href={genericWhatsAppUrl()} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="hairline opacity-30 mb-6" />
        <div className="flex flex-wrap gap-4 justify-between text-[11px] uppercase tracking-[0.25em] text-background/50">
          <span>{content.general.copyright}</span>
          <span>{content.general.credit}</span>
        </div>
      </div>
    </footer>
  );
}
