import { createFileRoute, Link } from "@tanstack/react-router";

import atelierBoardroomWeekend from "@/assets/atelier-boardroom-weekend.mp4";
import atelierGirlsEid from "@/assets/atelier-girls-eid.mp4";
import { useSiteContent } from "@/hooks/use-site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - LK Clothiers" },
      {
        name: "description",
        content:
          "The story, mission and atelier behind LK Clothiers - modest fashion crafted in Abuja, Nigeria.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const content = useSiteContent();

  return (
    <div>
      <section className="grid min-h-[60svh] lg:grid-cols-2">
        <div className="flex items-center bg-[color:var(--cream)] px-6 py-20 lg:px-20">
          <div className="max-w-lg">
            <p className="eyebrow mb-4">{content.about.eyebrow}</p>
            <h1 className="font-display text-5xl leading-[1.05] lg:text-6xl">
              {content.about.headlinePrefix}{" "}
              <em className="italic text-[color:var(--accent)]">{content.about.headlineAccent}</em>
              {content.about.headlineSuffix}
            </h1>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              {content.about.copy.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="relative min-h-[40svh]">
          <video
            src={atelierBoardroomWeekend}
            aria-label="LK Clothiers versatile collection in motion"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-24 lg:grid-cols-3 lg:px-12">
        {content.about.pillars.map((pillar) => (
          <div key={pillar.title}>
            <p className="mb-4 font-display text-2xl text-[color:var(--accent)]">
              - {pillar.title}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
          </div>
        ))}
      </section>

      <section className="grid bg-foreground text-background lg:grid-cols-2">
        <div className="relative min-h-[60svh]">
          <video
            src={atelierGirlsEid}
            aria-label="LK Clothiers Girls Eid Collection in motion"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
        </div>
        <div className="flex items-center px-6 py-20 lg:px-20">
          <div className="max-w-md">
            <p className="eyebrow mb-4 text-background/60">{content.about.whyEyebrow}</p>
            <h2 className="font-display text-4xl leading-tight lg:text-5xl">
              {content.about.whyTitle}
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-background/70">
              {content.about.whyCopy.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              to="/shop"
              className="mt-10 inline-block border border-background/40 px-7 py-4 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-background hover:text-foreground"
            >
              {content.about.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
