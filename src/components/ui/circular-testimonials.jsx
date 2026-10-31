// Circular testimonials, from 21st.dev, adapted for this Vite + React project:
// plain JavaScript and a CSS file instead of TypeScript and styled-jsx,
// `motion/react` (the current name of framer-motion), and lucide icons.
//
// Changes for accessibility: arrow keys work only while focus is inside the
// carousel (the original listened on the whole window), autoplay pauses on
// hover or focus and never runs when reduced motion is requested, and the
// quote is announced to screen readers when it changes by hand.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./circular-testimonials.css";

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

const quoteVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
  label = "Testimonials",
}) {
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#6b7280";
  const colorTestimony = colors.testimony ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";
  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const imageContainerRef = useRef(null);

  const count = testimonials.length;
  const active = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);
  const playing = autoplay && !reduce && !paused && !stopped && count > 1;

  useEffect(() => {
    const measure = () => {
      if (imageContainerRef.current)
        setContainerWidth(imageContainerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [playing, count]);

  // Moving by hand stops autoplay for good, as in the original.
  const handleNext = useCallback(() => {
    setStopped(true);
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);
  const handlePrev = useCallback(() => {
    setStopped(true);
    setActiveIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    }
  };

  // Three photos show at once: the active one, and one either side tipped back.
  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const transition = reduce ? "none" : "all 0.8s cubic-bezier(.4,2,.3,1)";
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + count) % count === index;
    const isRight = (activeIndex + 1) % count === index;
    if (isActive)
      return {
        zIndex: 3,
        opacity: 1,
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition,
      };
    if (isLeft)
      return {
        zIndex: 2,
        opacity: 1,
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition,
      };
    if (isRight)
      return {
        zIndex: 2,
        opacity: 1,
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition,
      };
    return { zIndex: 1, opacity: 0, transition };
  }

  const arrowStyle = (hover) => ({
    backgroundColor: hover ? colorArrowHoverBg : colorArrowBg,
    color: colorArrowFg,
  });

  return (
    <div
      className="testimonial-container"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="testimonial-grid">
        <div className="image-container" ref={imageContainerRef}>
          {testimonials.map((item, index) => (
            <img
              key={item.src + index}
              src={item.src}
              alt={index === activeIndex ? item.alt ?? "" : ""}
              aria-hidden={index === activeIndex ? undefined : "true"}
              className="testimonial-image"
              width="960"
              height="640"
              loading="eager"
              style={getImageStyle(index)}
            />
          ))}
        </div>
        <div className="testimonial-content">
          <div aria-live={playing ? "off" : "polite"} aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                variants={quoteVariants}
                initial={reduce ? false : "initial"}
                animate="animate"
                exit={reduce ? undefined : "exit"}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h3 className="name" style={{ color: colorName, fontSize: fontSizeName }}>
                  {active.name}
                </h3>
                <p
                  className="designation"
                  style={{ color: colorDesignation, fontSize: fontSizeDesignation }}
                >
                  {active.designation}
                </p>
                <p className="quote" style={{ color: colorTestimony, fontSize: fontSizeQuote }}>
                  {active.quote.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={reduce ? false : { filter: "blur(10px)", opacity: 0, y: 5 }}
                      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut", delay: 0.025 * i }}
                      style={{ display: "inline-block" }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="arrow-buttons">
            <ArrowButton label="Previous review" onClick={handlePrev} style={arrowStyle}>
              <ArrowLeft size={22} aria-hidden="true" />
            </ArrowButton>
            <ArrowButton label="Next review" onClick={handleNext} style={arrowStyle}>
              <ArrowRight size={22} aria-hidden="true" />
            </ArrowButton>
            <span className="testimonial-count" aria-hidden="true">
              {activeIndex + 1} / {count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({ label, onClick, style, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      className="arrow-button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={style(hover)}
    >
      {children}
    </button>
  );
}

export default CircularTestimonials;
