"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { WorkProject } from "@/lib/content";
import styles from "./work.module.css";

const PALETTES: Record<string, { from: string; to: string; accent: string }> = {
  forest: { from: "#16382d", to: "#3d6b56", accent: "#c4a574" },
  oak: { from: "#4a3c2a", to: "#8a7355", accent: "#e8d5b5" },
  slate: { from: "#2c3338", to: "#5c6b73", accent: "#a8c5c0" },
  clay: { from: "#5c3a32", to: "#a06b5a", accent: "#f0d4c0" },
  ink: { from: "#1d1d1f", to: "#3a3a3c", accent: "#9aa89c" },
  moss: { from: "#2d4a3e", to: "#6b8f72", accent: "#efe6d2" },
  wine: { from: "#3d2a32", to: "#7a4a52", accent: "#e8c4b8" },
  mist: { from: "#3e4a48", to: "#7a8f88", accent: "#d4e0d8" },
};

type WorkRailProps = {
  projects: WorkProject[];
};

export function WorkRail({ projects }: WorkRailProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const nextProgress = max <= 0 ? 0 : el.scrollLeft / max;
    setProgress(nextProgress);
    setCanNext(el.scrollLeft < max - 8);

    const pad =
      Number.parseFloat(getComputedStyle(el).scrollPaddingInlineStart) ||
      Number.parseFloat(getComputedStyle(el).paddingLeft) ||
      0;
    const target = el.getBoundingClientRect().left + pad;
    const cards = el.querySelectorAll<HTMLElement>("[data-work-card]");
    let closest = 0;
    let closestDist = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const dist = Math.abs(cards[i].getBoundingClientRect().left - target);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }
    setIndex(closest);
    setCanPrev(el.scrollLeft > 8 || closest > 0);
  }, []);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const el = railRef.current;
      if (!el) return false;

      const cards = el.querySelectorAll<HTMLElement>("[data-work-card]");
      if (!cards.length) return false;

      const pad =
        Number.parseFloat(getComputedStyle(el).scrollPaddingInlineStart) ||
        Number.parseFloat(getComputedStyle(el).paddingLeft) ||
        0;
      const origin = el.getBoundingClientRect().left + pad;

      let closest = 0;
      let closestDist = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const dist = Math.abs(cards[i].getBoundingClientRect().left - origin);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      }

      const next = closest + direction;
      if (next < 0 || next >= cards.length) return false;

      const delta = cards[next].getBoundingClientRect().left - origin;
      if (Math.abs(delta) < 1) return false;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({
        left: el.scrollLeft + delta,
        behavior: reduce ? "auto" : "smooth",
      });
      return true;
    },
    [],
  );

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync, projects.length]);

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === "touch") return;
    const el = railRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startLeft: el.scrollLeft,
    };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (!drag.current.active) return;
    const el = railRef.current;
    if (!el) return;
    const dx = event.clientX - drag.current.startX;
    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = (event: PointerEvent<HTMLUListElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const el = railRef.current;
    if (el) {
      el.style.scrollSnapType = "";
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
    }
  };

  const onScrub = (event: ChangeEvent<HTMLInputElement>) => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollLeft = max * Number(event.target.value);
  };

  if (!projects.length) return null;

  return (
    <div>
      <ul
        ref={railRef}
        className={styles.rail}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        tabIndex={0}
        aria-label="Selected work, horizontal gallery"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollByCard(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollByCard(-1);
          }
        }}
      >
        {projects.map((project) => (
          <li key={project.id} className={styles.card} data-work-card>
            <WorkCard project={project} />
          </li>
        ))}
      </ul>

      <div className="container-wide mt-8 flex items-center gap-5 md:mt-10 md:gap-8">
        <div className="flex items-center gap-2">
          <RailButton
            label="Previous project"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
          >
            ←
          </RailButton>
          <RailButton
            label="Next project"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
          >
            →
          </RailButton>
        </div>

        <label className="flex min-w-0 flex-1 items-center">
          <span className="sr-only">Scrub through projects</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={onScrub}
            className={styles.scrub}
          />
        </label>

        <p className="shrink-0 font-medium tabular-nums tracking-tight text-muted-foreground">
          <span className="text-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mx-1.5 text-border">/</span>
          {String(projects.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

function WorkCard({ project }: { project: WorkProject }) {
  const palette = PALETTES[project.palette] ?? PALETTES.forest;
  const initial = project.client.trim().charAt(0);

  return (
    <article>
      <div
        className={styles.visual}
        style={{
          background: `linear-gradient(155deg, ${palette.from} 0%, ${palette.to} 100%)`,
        }}
      >
        <div className={styles.grid} aria-hidden="true" />
        <div
          className="absolute -left-10 top-8 size-40 rounded-full opacity-40 blur-3xl"
          style={{ background: palette.accent }}
          aria-hidden="true"
        />
        <div
          className="absolute right-8 top-10 size-24 rounded-full opacity-30 blur-2xl"
          style={{ background: "#fff" }}
          aria-hidden="true"
        />
        <span className={styles.initial} aria-hidden="true">
          {initial}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          {project.result ? (
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-medium tracking-tight sm:text-xs"
              style={{
                background: "rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
              }}
            >
              {project.result}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
        <p className="text-[12px] text-muted-foreground sm:text-[13px]">
          {project.industry}
          <span className="mx-2 text-border">·</span>
          {project.year}
          <span className="mx-2 text-border">·</span>
          {project.tags.join(" · ")}
        </p>
        <h3 className="title-md mt-2 text-[1.35rem] sm:mt-2.5 sm:text-[1.6rem]">
          {project.client}
        </h3>
        <p className="body mt-2 max-w-md text-[0.975rem] sm:mt-3">
          {project.summary}
        </p>
      </div>
    </article>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full border border-border bg-white text-[15px] text-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
