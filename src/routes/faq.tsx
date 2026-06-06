import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — LK Clothiers" },
      {
        name: "description",
        content: "Answers to common questions about delivery, returns, sizing, payment and orders.",
      },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Within Abuja: 24–48 hours. Nationwide: 2–5 business days via our courier partners.",
  },
  {
    q: "What is your returns policy?",
    a: "We accept returns within 7 days of delivery for unworn pieces with tags. Bespoke or altered pieces are final sale.",
  },
  {
    q: "How do I know my size?",
    a: "Each product page includes a size guide with garment measurements. For bespoke fitting, book an atelier appointment in Wuye.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Paystack (cards, bank transfer, USSD), Flutterwave, and direct bank transfer to our LK Clothiers account.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Once dispatched, you'll receive a tracking link by SMS and email.",
  },
  {
    q: "Do you ship internationally?",
    a: "We ship across West Africa and to select international destinations. Reach out on WhatsApp for a quote.",
  },
  {
    q: "Can I alter a piece?",
    a: "Yes — our atelier offers complimentary minor alterations on full-price ready-to-wear within 14 days of purchase.",
  },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="px-6 lg:px-12 py-16 lg:py-20 max-w-3xl mx-auto">
      <p className="eyebrow mb-3">Frequently Asked</p>
      <h1 className="font-display text-4xl md:text-5xl mb-12">Need to know.</h1>
      <div className="divide-y divide-border border-y border-border">
        {faqs.map((f, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-6 text-left"
            >
              <span className="font-display text-lg lg:text-xl pr-8">{f.q}</span>
              <span className="text-2xl text-[color:var(--accent)]">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <p className="pb-6 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-6 text-xs text-muted-foreground">
        <details className="border border-border p-6">
          <summary className="font-display text-base text-foreground cursor-pointer">
            Privacy Policy
          </summary>
          <p className="mt-4 leading-relaxed">
            We collect only the information needed to fulfil your orders. We never sell your data
            and use industry-standard encryption to keep your details safe.
          </p>
        </details>
        <details className="border border-border p-6">
          <summary className="font-display text-base text-foreground cursor-pointer">
            Terms &amp; Conditions
          </summary>
          <p className="mt-4 leading-relaxed">
            By using lkclothiers.com you agree to our terms regarding orders, returns, intellectual
            property and acceptable use. Full terms available on request.
          </p>
        </details>
      </div>
    </div>
  );
}
