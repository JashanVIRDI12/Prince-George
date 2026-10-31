// Motion shared by the home page. Every effect leaves the page complete and
// usable when motion is reduced: the stylesheet describes the finished state,
// and GSAP only animates toward it.
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

// Smooth wheel scrolling on the GSAP ticker, so ScrollTrigger stays in step.
// Touch scrolling stays native, and it is off when motion is reduced.
export function useSmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    // Anchor targets clear the header through scroll-padding-top, which
    // Lenis reads as well.
    const lenis = new Lenis({ lerp: 0.11, anchors: true });
    const tick = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

// Section headings rise line by line behind a mask the first time they come
// into view. SplitText re-splits on resize and once the fonts have loaded.
export function useRevealLines(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const splits = gsap.utils
            .toArray(scope.current.querySelectorAll("[data-reveal]"))
            .map((el) =>
              SplitText.create(el, {
                type: "lines",
                mask: "lines",
                linesClass: "reveal-line",
                autoSplit: true,
                onSplit: (self) =>
                  gsap.from(self.lines, {
                    yPercent: 110,
                    duration: 1.1,
                    ease: "expo.out",
                    stagger: 0.08,
                    scrollTrigger: { trigger: el, start: "top 86%", once: true },
                  }),
              }),
            );
          return () => splits.forEach((split) => split.revert());
        },
        scope.current,
      );
      return () => mm.revert();
    },
    { scope },
  );
}

// The header slides away while the visitor scrolls down and returns as soon
// as they scroll up. It turns solid once the page has moved. This reads the
// real scroll position on each frame: ScrollTrigger briefly jumps to the top
// while it re-measures the page, and its callbacks would see that jump.
export function useHeaderOnScroll(header) {
  useEffect(() => {
    const el = header.current;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      el.toggleAttribute("data-scrolled", y > 8);
      if (Math.abs(y - last) < 4) return;
      el.toggleAttribute(
        "data-away",
        y > last && y > 240 && !el.contains(document.activeElement),
      );
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [header]);
}

// A gentle pull toward the pointer, after React Bits' Magnet. Only with a
// precise pointer, and never when motion is reduced.
export function Magnet({ children, strength = 0.22, className = "" }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });
  const fine = useRef(false);
  useEffect(() => {
    fine.current = window.matchMedia(FINE_POINTER).matches;
  }, []);
  const move = (event) => {
    if (reduce || !fine.current || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.span
      className={`magnet ${className}`}
      style={{ x: springX, y: springY }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </motion.span>
  );
}
