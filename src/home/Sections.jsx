import React, { useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";
import { Icon } from "../icons";
import { areas, business, faqs, heavyChecklist, steps } from "./content";
import { MOTION_OK, Magnet } from "./motion";
import { reviews } from "./reviews";
import { homePhotography } from "./photography";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin, SplitText);

const EASE = [0.2, 0.8, 0.2, 1];

/* ---------------------------------------------------------------- Heavy */

// A sticky portrait based on the company's own wrecker beside the checklist for
// heavy jobs. Each item lights up as it reaches the middle of the screen.
export function HeavyDuty() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const section = root.current;
          gsap.fromTo(
            section.querySelector(".heavy-photo img"),
            { scale: 1.25 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom bottom", scrub: true },
            },
          );
          section.querySelectorAll(".heavy-list li").forEach((item) => {
            const scroll = { trigger: item, start: "top 78%", end: "top 52%", scrub: true };
            gsap.fromTo(item, { opacity: 0.22 }, { opacity: 1, ease: "none", scrollTrigger: scroll });
            gsap.fromTo(
              item.querySelector(".heavy-rule"),
              { scaleX: 0 },
              { scaleX: 1, ease: "none", scrollTrigger: { ...scroll } },
            );
          });
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="heavy" id="heavy-duty" ref={root} aria-labelledby="heavy-heading">
      <div className="heavy-media">
        <figure className="heavy-photo">
          <img
            {...homePhotography.wrecker}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt="Prince George Towing’s white and burgundy Kenworth heavy wrecker at a forest edge"
            loading="eager"
          />
          <figcaption>Our wrecker</figcaption>
        </figure>
      </div>
      <div className="heavy-copy">
        <h2 id="heavy-heading" data-reveal>
          When it’s a bus, a semi, or a machine
        </h2>
        <p className="heavy-lead">
          Heavy jobs are planned before the truck leaves the yard. We look at
          the weight, the load, how the vehicle is sitting and how we can reach
          it, then bring the setup that fits.
        </p>
        <h3>Have these ready when you call</h3>
        <ul className="heavy-list">
          {heavyChecklist.map((item) => (
            <li key={item}>
              <Icon name="check" />
              <span>{item}</span>
              <span className="heavy-rule" aria-hidden="true" />
            </li>
          ))}
        </ul>
        <a className="text-link" href="/services/heavy/">
          Heavy-duty towing in detail
        </a>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Drive */

// A side-on tow truck in the company's colours.
function TruckIcon() {
  return (
    <svg className="truck" viewBox="0 0 120 58" aria-hidden="true">
      <path d="M30 26 L8 9" stroke="#7a1c2c" strokeWidth="5" strokeLinecap="square" />
      <path d="M8 9 v12 m-3 0 h6" stroke="#0b1f3f" strokeWidth="2.5" fill="none" />
      <rect x="16" y="24" width="64" height="22" fill="#fff" stroke="#0b1f3f" strokeWidth="2.5" />
      <path d="M78 14 h20 l13 15 v17 h-35 z" fill="#fff" stroke="#0b1f3f" strokeWidth="2.5" />
      <path d="M84 18 h12 l8 9 h-20 z" fill="#0b1f3f" />
      <rect x="83" y="9" width="14" height="5" fill="#ff5b14" />
      <rect x="16" y="35" width="95" height="4" fill="#7a1c2c" />
      {[30, 52, 98].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="48" r="8" fill="#0b1f3f" />
          <circle cx={cx} cy="48" r="3" fill="#c9d1dc" />
        </g>
      ))}
    </svg>
  );
}

const ROAD = "M -40 220 C 160 220 220 60 400 70 S 700 250 860 200 S 1080 40 1260 60";
// The steps sit in three columns; each stop is where the road passes under
// the middle of a column, as a share of the road's length.
const COLUMN_X = [200, 600, 1000];
function stopsAlong(path) {
  const total = path.getTotalLength();
  return COLUMN_X.map((x) => {
    let low = 0;
    let high = total;
    for (let i = 0; i < 24; i += 1) {
      const mid = (low + high) / 2;
      if (path.getPointAtLength(mid).x < x) low = mid;
      else high = mid;
    }
    return { at: low / total, point: path.getPointAtLength(low) };
  });
}

// The three steps of a call along a winding road. On wide screens the
// section pins and a tow truck drives the road as the page scrolls, leaving
// an orange trail; each step lights up as the truck reaches it. Narrow
// screens get a straight road down the side of the steps.
export function Process() {
  const root = useRef(null);
  const [reached, setReached] = useState(steps.length);

  // Place the stop markers on the road, with or without motion.
  useGSAP(
    () => {
      const road = root.current.querySelector(".road-track");
      const markers = root.current.querySelectorAll(".road-stop");
      // Markers are page elements, placed by percentage, so they stay
      // square while the road stretches to the width of the screen.
      stopsAlong(road).forEach(({ point }, index) =>
        gsap.set(markers[index], { left: `${(point.x / 1200) * 100}%`, top: `${(point.y / 290) * 100}%` }),
      );
      // Without motion the truck waits at the last stop.
      const truck = root.current.querySelector(".drive-wide .truck-wrap");
      const end = stopsAlong(road)[COLUMN_X.length - 1].at;
      gsap.set(truck, {
        motionPath: { path: road, align: road, alignOrigin: [0.5, 0.82], autoRotate: true, start: end, end },
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        `${MOTION_OK} and (min-width: 901px)`,
        () => {
          const section = root.current;
          const road = section.querySelector(".road-track");
          const trail = section.querySelector(".road-trail");
          const truck = section.querySelector(".drive-wide .truck-wrap");
          const stops = stopsAlong(road).map((stop) => stop.at);
          setReached(0);
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section.querySelector(".drive-stage"),
                start: "top top",
                end: "+=180%",
                pin: true,
                scrub: 0.8,
                onUpdate: (self) =>
                  setReached(stops.filter((stop) => self.progress >= stop - 0.01).length),
              },
            })
            .fromTo(trail, { strokeDashoffset: 1000 }, { strokeDashoffset: 0 }, 0)
            .to(
              truck,
              {
                motionPath: { path: road, align: road, alignOrigin: [0.5, 0.82], autoRotate: true },
              },
              0,
            );
          return () => setReached(steps.length);
        },
        root.current,
      );
      mm.add(
        `${MOTION_OK} and (max-width: 900px)`,
        () => {
          const section = root.current;
          const list = section.querySelector(".drive-narrow");
          setReached(0);
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: list,
                start: "top 65%",
                end: "bottom 65%",
                scrub: 0.5,
                onUpdate: (self) =>
                  setReached(
                    [0.05, 0.45, 0.9].filter((stop) => self.progress >= stop).length,
                  ),
              },
            })
            .fromTo(list.querySelector(".lane-trail"), { scaleY: 0 }, { scaleY: 1 }, 0)
            .fromTo(
              list.querySelector(".truck-wrap"),
              { top: "0%" },
              { top: "100%" },
              0,
            );
          return () => setReached(steps.length);
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="drive" id="how-it-works" ref={root} aria-labelledby="process-heading">
      <div className="drive-stage">
        <div className="drive-head">
          <h2 id="process-heading" data-reveal>
            What happens when you call
          </h2>
          <p>
            No perfect explanation needed. Three things happen, in this order,
            and you’ll know the cost before anything moves.
          </p>
        </div>

        <div className="drive-wide" aria-hidden="true">
          <svg className="road" viewBox="0 0 1200 290" preserveAspectRatio="none">
            <path className="road-base" d={ROAD} />
            <path className="road-dash" d={ROAD} />
            <path className="road-trail" d={ROAD} pathLength="1000" />
            <path className="road-track" d={ROAD} />
          </svg>
          {COLUMN_X.map((x, index) => (
            <span
              key={x}
              className="road-stop"
              data-reached={index < reached ? "" : undefined}
            />
          ))}
          <div className="truck-wrap">
            <TruckIcon />
          </div>
        </div>

        <div className="drive-body">
        <ol className="drive-steps">
          {steps.map((step, index) => (
            <li
              className="drive-step"
              key={step.title}
              data-reached={index < reached ? "" : undefined}
            >
              <span className="drive-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="drive-narrow" aria-hidden="true">
          <span className="lane" />
          <span className="lane-trail" />
          <div className="truck-wrap">
            <TruckIcon />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Reviews */

// Customer reviews in the circular testimonials carousel. Sample entries
// show only on the local preview; see reviews.js.
export function Reviews() {
  if (!reviews.length) return null;
  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-heading">
      <div className="section-head">
        <h2 id="reviews-heading" data-reveal>
          What customers say
        </h2>
      </div>
      <CircularTestimonials
        testimonials={reviews}
        label="Customer reviews"
        autoplay
        colors={{
          name: "#0b1f3f",
          designation: "#56627a",
          testimony: "#0b1f3f",
          arrowBackground: "#0b1f3f",
          arrowForeground: "#ffffff",
          arrowHoverBackground: "#ff5b14",
        }}
        fontSizes={{
          name: "2rem",
          designation: "1rem",
          quote: "clamp(1.15rem, 1rem + 0.6vw, 1.5rem)",
        }}
      />
    </section>
  );
}

/* ------------------------------------------------------------- Coverage */

// A schematic of the highways that meet in Prince George. Rivers are drawn
// for orientation: Highway 16 follows the Nechako west, Highway 97 the
// Fraser south.
const ROUTES = {
  west: {
    d: "M360 272 C 312 266 270 252 222 248 S 128 226 74 214",
    shield: [222, 248],
    number: "16",
    end: [74, 214],
    label: "Vanderhoof",
    labelAt: [74, 190],
  },
  north: {
    d: "M360 272 C 364 228 350 196 354 152 S 366 86 372 42",
    shield: [354, 152],
    number: "97",
    end: [372, 42],
    label: "Hart Highlands",
    labelAt: [392, 48],
  },
  south: {
    d: "M360 272 C 370 322 392 352 394 402 S 410 478 418 524",
    shield: [394, 402],
    number: "97",
    end: [418, 524],
    label: "Quesnel",
    labelAt: [438, 530],
  },
};
const RIVERS = [
  "M40 246 C 110 238 150 262 210 262 S 300 286 352 282",
  "M610 112 C 560 150 500 160 456 196 S 380 250 372 290 S 400 352 412 392 S 440 470 448 548",
];

function Shield({ x, y, number }) {
  return (
    <g className="route-shield" transform={`translate(${x - 15} ${y - 17})`}>
      <g className="shield-art">
        <path d="M2 4 Q15 -1 28 4 L28 18 Q28 29 15 34 Q2 29 2 18 Z" />
        <text x="15" y="22" textAnchor="middle">
          {number}
        </text>
      </g>
    </g>
  );
}

function RouteMap({ active, onSelect }) {
  const root = useRef(null);
  const activeId = areas[active].id;
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const svg = root.current;
          gsap
            .timeline({
              scrollTrigger: { trigger: svg, start: "top 75%", once: true },
              defaults: { ease: "power2.inOut" },
            })
            .from(svg.querySelectorAll(".river"), { strokeDashoffset: 1000, duration: 1.6, stagger: 0.2 }, 0)
            .from(svg.querySelectorAll(".road-line"), { strokeDashoffset: 1000, duration: 1.3, stagger: 0.15 }, 0.2)
            .from(svg.querySelectorAll(".route-shield, .place"), { opacity: 0, duration: 0.5, stagger: 0.06 }, 1.1);
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <figure className="route-map" ref={root} data-active={activeId}>
      <svg viewBox="0 0 640 560" role="img" aria-labelledby="route-map-title">
        <title id="route-map-title">
          Schematic map: Highway 16 runs west from Prince George toward
          Vanderhoof, and Highway 97 runs north past Hart Highlands and south
          toward Quesnel.
        </title>
        {RIVERS.map((d) => (
          <path key={d} className="river" d={d} pathLength="1000" />
        ))}
        {Object.entries(ROUTES).map(([id, route]) => (
          <g
            key={id}
            className="route"
            data-on={activeId === id}
            onClick={() => onSelect(areas.findIndex((area) => area.id === id))}
          >
            <path className="road-hit" d={route.d} />
            <path className="road-line" d={route.d} pathLength="1000" />
            <circle className="place" cx={route.end[0]} cy={route.end[1]} r="5" />
            <text className="place place-label" x={route.labelAt[0]} y={route.labelAt[1]}>
              {route.label}
            </text>
            <Shield x={route.shield[0]} y={route.shield[1]} number={route.number} />
          </g>
        ))}
        <g className="city" data-on={activeId === "pg"} onClick={() => onSelect(0)}>
          <circle className="city-halo" cx="360" cy="272" r="34" />
          <rect className="city-ring" x="347" y="259" width="26" height="26" />
          <rect className="city-dot" x="354" y="266" width="12" height="12" />
          <text className="place city-label" x="300" y="320" textAnchor="end">
            Prince George
          </text>
        </g>
      </svg>
      <figcaption>Schematic, not to scale</figcaption>
    </figure>
  );
}

export function Coverage() {
  const [active, setActive] = useState(0);
  const area = { ...areas[active], ...(areas[active].home || {}) };
  const keydown = (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(event.key in keys) && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? areas.length - 1
          : (active + keys[event.key] + areas.length) % areas.length;
    setActive(next);
    document.getElementById(`area-tab-${areas[next].id}`)?.focus();
  };
  return (
    <section className="coverage" id="coverage" aria-labelledby="coverage-heading">
      <div className="section-head">
        <h2 id="coverage-heading" data-reveal>
          Prince George and the highways out of town
        </h2>
        <p>
          In the city or out on 16 and 97. Tell us the road you’re on and the
          last place you passed, and we’ll confirm we can reach you.
        </p>
      </div>
      <div className="coverage-grid">
        <div className="coverage-side">
          <div className="area-tabs" role="tablist" aria-label="Service areas" aria-orientation="vertical">
            {areas.map((item, index) => (
              <button
                key={item.id}
                id={`area-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="area-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={keydown}
              >
                <span>{item.name}</span>
                <span className="area-tab-route">{item.route}</span>
              </button>
            ))}
          </div>
          <div className="area-panel" id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${area.id}`} tabIndex={0}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={area.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <h3>{area.name}</h3>
                <p>{area.detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <RouteMap active={active} onSelect={setActive} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Questions */

function Question({ question, answer, open, onToggle }) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <div className="qa" data-open={open}>
      <h3>
        <button type="button" id={`${id}-q`} aria-expanded={open} aria-controls={`${id}-a`} onClick={onToggle}>
          <span>{question}</span>
          <span className="qa-icon" aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            className="qa-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Questions({
  items = faqs,
  heading = "Before you call",
  intro = "The things people most often ask dispatch. Anything else, just ask on the phone.",
  id = "faq",
} = {}) {
  const [open, setOpen] = useState(0);
  return (
    <section className="questions" id={id} aria-labelledby={`${id}-heading`}>
      <div className="questions-side">
        <h2 id={`${id}-heading`} data-reveal>
          {heading}
        </h2>
        <p>{intro}</p>
        <div className="safety">
          <strong>If anyone is hurt or in danger, call 911 first.</strong>
          <p>Then, if it’s safe, move away from traffic, turn on your hazard lights and keep your phone with you.</p>
        </div>
      </div>
      <div className="questions-list">
        {items.map(([question, answer], index) => (
          <Question
            key={question}
            question={question}
            answer={answer}
            open={open === index}
            onToggle={() => setOpen(open === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Closing */

// The last word: the number, very large, on the company's orange. Its
// characters climb into place the first time it scrolls into view.
export function Closing({
  heading = "Stuck somewhere? Call dispatch.",
  action = "Call dispatch",
  text = "Prince George and along Highways 16 and 97, day and night. Tell us where you are and what happened.",
} = {}) {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const number = root.current.querySelector(".closing-digits");
          const split = SplitText.create(number, { type: "chars", mask: "chars" });
          gsap.from(split.chars, {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: { each: 0.045, from: "start" },
            scrollTrigger: { trigger: number, start: "top 88%", once: true },
          });
          gsap.fromTo(
            number,
            { xPercent: 6 },
            {
              xPercent: -4,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
          return () => split.revert();
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="closing" id="contact" ref={root} aria-labelledby="closing-heading">
      <h2 id="closing-heading" data-reveal>
        {heading}
      </h2>
      <a className="closing-number" href={business.phoneHref}>
        <span className="sr-only">Call </span>
        <span className="closing-digits">{business.phone}</span>
      </a>
      <div className="closing-foot">
        <p>{text}</p>
        <div className="closing-actions">
          <Magnet>
            <a className="button button-ink" href={business.phoneHref}>
              <Icon name="phone" />
              {action}
            </a>
          </Magnet>
          <a className="text-link" href="/contact/">
            More ways to reach us
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Footer */

// Inner pages pass `home` so the logo and the home page anchors lead back to
// the home page.
export function Footer({ home = false } = {}) {
  const prefix = home ? "/" : "";
  return (
    <footer className="footer">
      <div className="footer-top">
        <a
          className="footer-brand"
          href={home ? "/" : "#home"}
          aria-label={home ? "Prince George Towing, home" : "Prince George Towing, back to top"}
        >
          <img src="/images/brand-header-reversed.webp" alt="" width="720" height="234" loading="lazy" />
        </a>
        <nav className="footer-links" aria-label="Footer">
          <a href="/services/">Our services</a>
          <a href="/about/">About us</a>
          <a href="/contact/">Contact</a>
          <a href={`${prefix}#coverage`}>Service areas</a>
          <a href={`${prefix}#faq`}>Common questions</a>
          <a href={business.mapsUrl} target="_blank" rel="noopener">
            Find us on Google
          </a>
        </nav>
        <div className="footer-call">
          <span>Dispatch, day and night</span>
          <a href={business.phoneHref}>{business.phone}</a>
        </div>
      </div>
      <div className="footer-base">
        <span>
          © {new Date().getFullYear()} {business.legalName}
        </span>
        <span>Prince George, British Columbia</span>
        <a href="#home">Back to top</a>
      </div>
    </footer>
  );
}
