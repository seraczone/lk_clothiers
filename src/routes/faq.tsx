import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useSiteContent } from "@/hooks/use-site-content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs - LK Clothiers" },
      {
        name: "description",
        content: "Answers to common questions about delivery, returns, sizing, payment and orders.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  const content = useSiteContent();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-20">
      <p className="eyebrow mb-3">{content.faq.eyebrow}</p>
      <h1 className="mb-12 font-display text-4xl md:text-5xl">{content.faq.title}</h1>
      <div className="divide-y divide-border border-y border-border">
        {content.faq.items.map((item, index) => (
          <div key={`${item.question}-${index}`}>
            <button
              onClick={() => setOpen(open === index ? null : index)}
              className="flex w-full items-center justify-between py-6 text-left"
            >
              <span className="pr-8 font-display text-lg lg:text-xl">{item.question}</span>
              <span className="text-2xl text-[color:var(--accent)]">
                {open === index ? "-" : "+"}
              </span>
            </button>
            {open === index && (
              <p className="whitespace-pre-line pb-6 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-6 text-xs text-muted-foreground">
        <details className="border border-border p-6">
          <summary className="cursor-pointer font-display text-base text-foreground">
            {content.faq.privacyTitle}
          </summary>
          <p className="mt-4 leading-relaxed">{content.faq.privacyCopy}</p>
        </details>
        <details className="border border-border p-6">
          <summary className="cursor-pointer font-display text-base text-foreground">
            {content.faq.termsTitle}
          </summary>
          <p className="mt-4 whitespace-pre-line leading-relaxed">{content.faq.termsCopy}</p>
        </details>
      </div>
    </div>
  );
}
