"use client";

import { useEffect, useState } from "react";


const TAGLINE = ["BE A PART OF THE", "GERMAN AUTO EXPERIENCE"];
const FULL = TAGLINE.join("\n");

const Hero = () => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(FULL.slice(0, i));
        if (i >= FULL.length) clearInterval(interval);
      }, 55);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(startTimeout);
  }, []);

  const [line1, line2] = displayed.split("\n");

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>

      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpg')" }}
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-black/55" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-between px-6 sm:px-12 md:px-20 lg:px-28"
        style={{ minHeight: "92vh", paddingTop: "5rem", paddingBottom: "4rem" }}
      >
        <div />

        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-8 bg-white/40" />
            <span
              className="text-white/50 font-sans uppercase tracking-[0.3em]"
              style={{ fontSize: "0.7rem" }}
            >
              BRATS AND BAVARIA 2026
            </span>
          </div>

          {/* Title */}
          <div className="select-none mb-10">
            <span
              className="fade-in-up font-BebasNeue block text-white"
              style={{ fontSize: "clamp(4rem, 14vw, 14rem)", lineHeight: 0.88, letterSpacing: "-0.01em", animationDelay: "0.2s" }}
            >
              GERMAN
            </span>
            <span
              className="fade-in-up font-BebasNeue block text-white"
              style={{ fontSize: "clamp(2.7rem, 9.5vw, 9.5rem)", lineHeight: 0.88, letterSpacing: "-0.01em", marginTop: "-0.08em", animationDelay: "0.7s" }}
            >
              AUTO FESTIVAL
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 w-full mb-8" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">

            {/* Left: date + description */}
            <div className="text-white space-y-3 max-w-sm">
              <p
                className="font-sans font-semibold tracking-widest text-white/90 uppercase"
                style={{ fontSize: "1rem", letterSpacing: "0.2em" }}
              >
                Aug 9, 2026
              </p>
              <p
                className="font-sans font-semibold tracking-widest text-white/50 uppercase"
                style={{ fontSize: "0.85rem", letterSpacing: "0.2em" }}
              >
                10AM – 2PM
              </p>
              <p className="text-white/55 font-sans leading-relaxed" style={{ fontSize: "0.85rem" }}>
                Category awards, Bratwurst &amp; German food,
                sponsor booths, live DJ and more.
              </p>
            </div>

            {/* Right: tagline + CTA */}
            <div className="flex flex-col items-start sm:items-end gap-5">
              <p
                className="text-white/80 text-right leading-snug"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(1rem, 1.8vw, 1.6rem)",
                  letterSpacing: "0.06em",
                  minHeight: "2.8em",
                }}
              >
                {line1 ?? ""}
                {line2 !== undefined && <><br />{line2}</>}
              </p>
              <button
                className="btn-shine group flex items-center gap-3 border border-white/40 text-white text-xs font-sans font-semibold tracking-widest uppercase px-6 py-3 hover:bg-white hover:text-black transition-all duration-800 cursor-pointer"
                onClick={() => (window.location.href = "/submit")}
              >
                Apply Now
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
