"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import styles from "./hero-graph.module.css";

const LINE =
  "M8 132 L52 114 L92 122 L136 96 L176 104 L220 72 L262 80 L318 38 L372 28 L420 20";
const AREA = `${LINE} V158 H8 Z`;

const MAX_TILT = 7;
const EASE = 0.14;

/**
 * Decorative glassy traffic chart for the hero.
 * Light pointer tilt, smoothed on the compositor via transform.
 */
export function HeroGraph() {
  const { graph } = site.hero;
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tilt = tiltRef.current;
    const hero = tilt?.closest("section");
    if (!tilt || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const tick = () => {
      currentX += (targetX - currentX) * EASE;
      currentY += (targetY - currentY) * EASE;
      tilt.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;

      if (
        Math.abs(targetX - currentX) > 0.02 ||
        Math.abs(targetY - currentY) > 0.02
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        currentX = targetX;
        currentY = targetY;
        tilt.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;
        raf = 0;
      }
    };

    const start = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = nx * MAX_TILT;
      targetY = -ny * MAX_TILT;
      start();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="relative w-full [perspective:900px]">
      <div
        ref={tiltRef}
        className="relative w-full select-none pt-5 pb-3 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="pointer-events-none absolute -inset-8 -z-10 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(22,76,56,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,76,56,0.14) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 55% 50%, black 18%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 55% 50%, black 18%, transparent 72%)",
          }}
        />

        <div className="animate-fade-up pointer-events-none absolute top-0 left-3 z-20 sm:left-6">
          <GlassChip>
            <span className="size-1.5 rounded-full bg-[#164C38] shadow-[0_0_0_3px_rgba(22,76,56,0.18)]" />
            {graph.ranking}
          </GlassChip>
        </div>

        <div
          className="animate-fade-up pointer-events-none relative overflow-hidden rounded-[1.6rem] border border-white/50 px-5 pb-3 pt-8 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_18px_40px_rgba(22,76,56,0.08)] sm:rounded-[1.85rem] sm:px-6 sm:pt-9"
          style={{
            animationDelay: "80ms",
            background:
              "linear-gradient(165deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 100%)",
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
          }}
        >
          <div className="mb-2 flex justify-end">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-tight sm:px-2.5 sm:text-[11px]"
              style={{ background: "rgba(22,76,56,0.12)", color: "#164C38" }}
            >
              ↑ {graph.trend}
            </span>
          </div>

          <svg viewBox="0 0 428 158" className="block h-auto w-full">
            <defs>
              <linearGradient id="hero-graph-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#164C38" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#164C38" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className={styles.area} d={AREA} fill="url(#hero-graph-fill)" />
            <path
              className={styles.line}
              pathLength={1}
              d={LINE}
              fill="none"
              stroke="#164C38"
              strokeOpacity="0.55"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          className="animate-fade-up pointer-events-none absolute -bottom-2 right-2 z-20 sm:right-5"
          style={{ animationDelay: "220ms" }}
        >
          <GlassChip>
            <span className="size-1.5 rounded-full bg-[#c4a574] shadow-[0_0_0_3px_rgba(196,165,116,0.22)]" />
            {graph.leads}
          </GlassChip>
        </div>
      </div>
    </div>
  );
}

function GlassChip({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-white/50 px-2.5 py-1 text-[11px] font-medium tracking-tight text-foreground/80 shadow-[0_8px_20px_rgba(29,29,31,0.04)] sm:px-3 sm:py-1.5 sm:text-[12px]"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
      }}
    >
      {children}
    </div>
  );
}
