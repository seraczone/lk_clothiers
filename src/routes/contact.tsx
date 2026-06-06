import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { genericWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LK Clothiers" },
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
  return (
    <div className="px-6 lg:px-12 py-16 lg:py-20 max-w-[1400px] mx-auto">
      <p className="eyebrow mb-3">Get in Touch</p>
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-12">Visit · Write · Chat.</h1>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-12">
        <section>
          <h2 className="font-display text-2xl mb-6">Send us a message</h2>
          {sent ? (
            <div className="border border-border p-8 bg-[color:var(--cream)]">
              <p className="font-display text-xl mb-2">Thank you.</p>
              <p className="text-sm text-muted-foreground">
                We will reply within one business day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <Field label="Name" />
              <Field label="Email" type="email" />
              <Field label="Phone (optional)" required={false} />
              <label className="block">
                <span className="eyebrow block mb-2">Message</span>
                <textarea
                  required
                  rows={5}
                  className="w-full border border-border px-3 py-3 text-sm bg-background focus:outline-none focus:border-foreground"
                />
              </label>
              <button className="bg-[color:var(--accent)] text-white px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground transition-colors">
                Send Message
              </button>
            </form>
          )}
        </section>

        <section className="space-y-10">
          <div>
            <h2 className="font-display text-2xl mb-4">Our Atelier</h2>
            <p className="text-sm text-muted-foreground">
              Wuye District
              <br />
              Abuja FCT, Nigeria
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Business Hours</p>
            <p className="text-sm">
              Monday — Saturday
              <br />
              10:00 — 19:00 WAT
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Contact</p>
            <p className="text-sm">
              {WHATSAPP_DISPLAY}
              <br />
              hello@lkclothiers.com
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Follow</p>
            <div className="flex gap-4 text-sm">
              <a
                className="lk-link"
                href="https://instagram.com/lk_clothiers"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              <a className="lk-link" href="https://tiktok.com">
                TikTok
              </a>
              <a className="lk-link" href={genericWhatsAppUrl()} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
          <div className="aspect-[4/3] bg-[color:var(--cream)] border border-border relative overflow-hidden">
            <iframe
              title="Map of LK Clothiers Wuye Abuja"
              className="absolute inset-0 w-full h-full"
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
      <span className="eyebrow block mb-2">{label}</span>
      <input
        type={type}
        required={required}
        className="w-full border border-border px-3 py-3 text-sm bg-background focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
