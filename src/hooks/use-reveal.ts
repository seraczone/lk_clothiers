import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement>(observeKey = "") {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal, .footer-reveal"));
    const revealVisibleElements = () => {
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
          el.classList.add("is-in");
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));
    const frame = window.requestAnimationFrame(revealVisibleElements);
    window.addEventListener("pageshow", revealVisibleElements);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", revealVisibleElements);
      io.disconnect();
    };
  }, [observeKey]);

  return ref;
}
