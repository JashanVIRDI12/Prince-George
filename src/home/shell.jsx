// Page plumbing shared by the home page and the service pages: the phone call
// bar, a watcher for whether any dispatch number is on screen, and alignment
// for links that arrive with a #hash.
import React, { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "../icons";
import { business } from "../data";

// Reports whether any element matching `selector` is on screen.
export function useAnyVisible(selector) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const seen = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => seen.set(entry.target, entry.isIntersecting));
      setVisible([...seen.values()].some(Boolean));
    });
    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
  return visible;
}

// A link with a #hash arrives before React has drawn the target, so the
// browser's own jump misses. Align once fonts settle and pinned sections have
// measured themselves. Fonts also change every scroll position, so refresh
// ScrollTrigger when they are ready.
export function useHashAlign() {
  useEffect(() => {
    let frame;
    const align = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      document.fonts.ready.then(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
        });
      });
    };
    align();
    window.addEventListener("load", align);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", align);
    };
  }, []);
}

// On phones, a call bar slides up whenever no dispatch number is on screen.
export function CallBar({ watch }) {
  const numberInView = useAnyVisible(watch);
  return (
    <AnimatePresence>
      {!numberInView && (
        <motion.div
          className="call-bar"
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <a className="button button-signal" href={business.phoneHref}>
            <Icon name="phone" />
            Call dispatch, {business.phone}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
