"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const WORDS = ["WELCOME", "ITZFIZZ"];

// `place` puts the stats on the left or right side of the road on large screens.
const STATS = [
  { value: "58%", label: "Increase in pick up point use", place: "md:col-start-1 md:row-start-1" },
  { value: "23%", label: "Decreased in customer phone calls", place: "md:col-start-1 md:row-start-2" },
  { value: "27%", label: "Increase in pick up point use", place: "md:col-start-3 md:row-start-1 md:justify-self-end", right: true },
  { value: "40%", label: "Decreased in customer phone calls", place: "md:col-start-3 md:row-start-2 md:justify-self-end", right: true },
];

// The dashed line is 120px per dash. Moving the lane by a multiple of 120px
// makes the loop seamless.
const LANE_TRAVEL = 1200;

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // gsap.context lets us clean up every animation with one call (React Strict Mode safe)
    const ctx = gsap.context(() => {
      // ---------- 1. Intro: one orchestrated sequence on page load ----------
      if (reduceMotion) {
        gsap.set(".hl-letter, .stat, .car-wrap", { opacity: 1 });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .fromTo(
          ".car-wrap",
          { opacity: 0, y: 140, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1.6 }
        )
        .fromTo(
          ".hl-letter",
          { opacity: 0, yPercent: 70 },
          { opacity: 1, yPercent: 0, duration: 1, stagger: 0.05 },
          0.3
        )
        .fromTo(
          ".stat",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.18 },
          1.1
        );

      // ---------- 2. Scroll: everything is tied to scroll progress ----------
      // scrub: 1 means the animation takes about 1 second to catch up with the
      // scrollbar, which gives the smooth, eased feel.
      const scroll = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Car drives forward, sways a little, and grows as it comes toward the viewer.
      scroll.to(
        ".car",
        {
          duration: 1,
          keyframes: [
            { x: -28, rotation: -4, yPercent: -22, scale: 1.05, ease: "sine.inOut" },
            { x: 28, rotation: 4, yPercent: -62, scale: 1.2, ease: "sine.inOut" },
            { x: 0, rotation: 0, yPercent: -140, scale: 1.45, ease: "sine.in" },
          ],
        },
        0
      );

      // Road lines rush past the car
      scroll.to(".lane", { y: LANE_TRAVEL, duration: 1 }, 0);

      // Headline and stats drift up slightly for depth
      scroll.to(".headline", { y: -50, opacity: 0.3, duration: 1 }, 0);
      scroll.to(".stats", { y: -30, duration: 1 }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative h-screen overflow-hidden bg-page text-ink"
      aria-label="Welcome Itzfizz"
    >
      {/* Road */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-[clamp(150px,26vw,320px)] -translate-x-1/2 overflow-hidden border-x-4 border-white bg-asphalt"
      >
        <div
          className="lane absolute -top-[1200px] left-1/2 h-[calc(100%+1200px)] w-[6px] -translate-x-1/2 will-change-transform"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, #fff 0 60px, transparent 60px 120px)",
          }}
        />
      </div>

      {/* Car layer (above the text so the car drives over the headline) */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <div className="car-wrap opacity-0 will-change-transform">
          <img
            className="car h-[46vh] w-auto will-change-transform md:h-[64vh]"
            src={`${BASE_PATH}/car.svg`}
            alt="Top view of a papaya orange sports car"
            draggable="false"
          />
        </div>
      </div>

      {/* Text layer */}
      <div className="relative z-20 flex h-full flex-col px-6 pb-10 pt-20 md:px-16 md:pt-24">
        <div className="headline will-change-transform">
          <h1
            aria-label="Welcome Itzfizz"
            className="flex flex-col items-center justify-center gap-y-2 text-[clamp(1.4rem,4.2vw,3.5rem)] font-semibold tracking-[0.45em] md:flex-row md:gap-x-[1.2em]"
          >
            {WORDS.map((word) => (
              <span key={word} aria-hidden="true" className="flex pl-[0.45em]">
                {[...word].map((char, i) => (
                  <span key={i} className="hl-letter inline-block opacity-0">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <div className="stats mt-auto grid grid-cols-2 gap-x-6 gap-y-8 md:mt-0 md:flex-1 md:grid-cols-[1fr_minmax(150px,26vw)_1fr] md:content-center md:gap-y-20">
          {STATS.map((s) => (
            <div key={s.value} className={`stat opacity-0 ${s.place}`}>
              <p className="text-5xl font-light tabular-nums md:text-7xl">{s.value}</p>
              <p className={`mt-2 max-w-[18ch] text-sm text-ink/70 md:text-base${s.right ? " md:ml-auto" : ""}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
