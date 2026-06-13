import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useSiteContent } from "@/hooks/use-site-content";
import { genericWhatsAppUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - LK Clothiers" },
      {
        name: "description",
        content:
          "Visit our Abuja atelier or send us a message. We respond within one business day.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const content = useSiteContent();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
      <p className="eyebrow mb-3">{content.contact.eyebrow}</p>
      <h1 className="mb-12 font-display text-4xl md:text-5xl lg:text-6xl">
        {content.contact.title}
      </h1>

      <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="mb-6 font-display text-2xl">{content.contact.formTitle}</h2>
          {sent ? (
            <div className="border border-border bg-[color:var(--cream)] p-8">
              <p className="mb-2 font-display text-xl">{content.contact.successTitle}</p>
              <p className="text-sm text-muted-foreground">{content.contact.successCopy}</p>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <Field label={content.contact.nameLabel} />
              <Field label={content.contact.emailLabel} type="email" />
              <Field label={content.contact.phoneLabel} required={false} />
              <label className="block">
                <span className="eyebrow mb-2 block">{content.contact.messageLabel}</span>
                <textarea
                  required
                  rows={5}
                  className="w-full border border-border bg-background px-3 py-3 text-sm focus:border-foreground focus:outline-none"
                />
              </label>
              <button className="bg-[color:var(--accent)] px-7 py-4 text-xs uppercase tracking-[0.25em] text-white transition-colors hover:bg-foreground">
                {content.contact.button}
              </button>
            </form>
          )}
        </section>

        <section className="space-y-10">
          <div>
            <h2 className="mb-4 font-display text-2xl">{content.contact.atelierTitle}</h2>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {content.general.address}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">{content.contact.hoursLabel}</p>
            <p className="whitespace-pre-line text-sm">{content.general.hours}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">{content.contact.contactLabel}</p>
            <p className="text-sm">
              {content.general.phoneDisplay}
              <br />
              {content.general.email}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">{content.contact.followLabel}</p>
            <div className="flex gap-4 text-sm">
              <a
                className="lk-link"
                href="https://instagram.com/lk_clothiers"
                target="_blank"
                rel="noreferrer"
              >
                {content.contact.instagramLabel}
              </a>
              <a className="lk-link" href="https://tiktok.com">
                {content.contact.tiktokLabel}
              </a>
              <a className="lk-link" href={genericWhatsAppUrl()} target="_blank" rel="noreferrer">
                {content.contact.whatsappLabel}
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border border-border bg-[color:var(--cream)]">
            <iframe
              title="Map of LK Clothiers Wuye Abuja"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=7.4310%2C9.0490%2C7.4910%2C9.0890&layer=mapnik&marker=9.0690%2C7.4610"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  required = true,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      <input
        type={type}
        required={required}
        className="w-full border border-border bg-background px-3 py-3 text-sm focus:border-foreground focus:outline-none"
      />
    </label>
  );
}
