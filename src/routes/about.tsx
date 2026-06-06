import { createFileRoute, Link } from "@tanstack/react-router";
import atelierBoardroomWeekend from "@/assets/atelier-boardroom-weekend.mp4";
import atelierGirlsEid from "@/assets/atelier-girls-eid.mp4";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LK Clothiers" },
      {
        name: "description",
        content:
          "The story, mission and atelier behind LK Clothiers — modest fashion crafted in Abuja, Nigeria.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="grid lg:grid-cols-2 min-h-[60svh]">
        <div className="bg-[color:var(--cream)] flex items-center px-6 lg:px-20 py-20">
          <div className="max-w-lg">
            <p className="eyebrow mb-4">Our Story</p>
            <h1 className="font-display text-5xl lg:text-6xl leading-[1.05]">
              A quiet study in <em className="italic text-[color:var(--accent)]">modern modesty</em>
              .
            </h1>
            <p className="mt-8 text-base text-muted-foreground leading-relaxed">
              LK Clothiers was founded in Abuja in 2019 with a single belief — that modesty and
              elegance are not opposites, but partners. We design pieces that women and their
              families can wear for years, in fabrics that age beautifully and silhouettes that
              quietly turn heads.
            </p>
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
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="px-6 lg:px-12 py-24 max-w-[1400px] mx-auto grid lg:grid-cols-3 gap-12">
        {[
          {
            t: "Mission",
            d: "To make premium modest fashion accessible to the modern African woman and her family — designed, cut and finished with intention.",
          },
          {
            t: "Vision",
            d: "To become the most loved modest fashion atelier on the continent, one quietly confident piece at a time.",
          },
          {
            t: "Philosophy",
            d: "Quality over quantity. Considered fabrics. Hand-finished detail. Designs that outlive trends.",
          },
        ].map((b) => (
          <div key={b.t}>
            <p className="font-display text-[color:var(--accent)] text-2xl mb-4">— {b.t}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
          </div>
        ))}
      </section>

      <section className="grid lg:grid-cols-2 bg-foreground text-background">
        <div className="relative min-h-[60svh]">
          <video
            src={atelierGirlsEid}
            aria-label="LK Clothiers Girls Eid Collection in motion"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="flex items-center px-6 lg:px-20 py-20">
          <div className="max-w-md">
            <p className="eyebrow mb-4 text-background/60">Why LK Exists</p>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight">
              For the woman who refuses to choose between modesty and modernity.
            </h2>
            <p className="mt-6 text-background/70 leading-relaxed">
              We exist for the woman who walks into a room and is remembered for her quiet
              confidence — not for what she wore, but for how she wore it.
            </p>
            <Link
              to="/shop"
              className="mt-10 inline-block border border-background/40 px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-background hover:text-foreground transition-colors"
            >
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
