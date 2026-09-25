import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { flushSync } from "react-dom";
import { Icon } from "./icons";
import CoverageMap from "./CoverageMap";
import { areas, business, services } from "./data";
import "./about-page.css";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const MOTION = "(prefers-reduced-motion: no-preference)";
const STILL = "(prefers-reduced-motion: reduce)";

// The faces that set this page's measurements. They are loaded by name:
// document.fonts.ready on its own can resolve before a newly rendered face
// has even been requested, and everything measured then is measured in the
// fallback.
const fontsLanded = () =>
  Promise.all(
    ['800 1em "Barlow Condensed"', '400 1em "DM Sans"', '700 1em "DM Sans"'].map(
      (font) => document.fonts.load(font),
    ),
  ).then(
    () => document.fonts.ready,
    () => document.fonts.ready,
  );

// The same four steps, in the order they happen. Drawn from the request flow
// and the service copy in data.js, not invented.
const steps = [
  [
    "We listen.",
    "Where you are, what you drive, and what happened. Not sure is a complete answer.",
  ],
  [
    "We plan the job.",
    "The right truck and equipment for your vehicle, and for the ground it’s sitting on.",
  ],
  [
    "You get the price.",
    "You hear what it costs before the winch moves. Then you decide.",
  ],
  [
    "We get you moving.",
    "A boost and you’re on your way, or a tow to the shop, home, or wherever it needs to go.",
  ],
];

function Roads() {
  const [selected, setSelected] = useState(0);
  const root = useRef(null);
  const ready = useRef(false);
  const area = areas[selected];

  useLayoutEffect(() => {
    if (ready.current && !window.matchMedia(STILL).matches)
      gsap.fromTo(
        root.current.querySelectorAll(".ab-roads-panel > *"),
        { y: 8, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.04, ease: "power2.out", overwrite: true },
      );
    ready.current = true;
  }, [selected]);

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next;
    if (event.key in step)
      next = (selected + step[event.key] + areas.length) % areas.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = areas.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    root.current.querySelector(`#ab-road-${areas[next].id}`).focus();
  };

  return (
    <section className="ab-roads" id="where-we-work" aria-labelledby="ab-roads-title" ref={root}>
      <div className="ab-roads-copy">
        <span className="ab-kicker">03 / WHERE WE GO</span>
        <h2 id="ab-roads-title">Where Highway 16 meets 97.</h2>
        <p>
          Prince George is home. Choose a road to see its place on the map and
          what helps us find you there. Pins mark communities, not a guaranteed
          service boundary.
        </p>
        <div className="ab-roads-tabs" role="tablist" aria-label="Roads out of Prince George">
          {areas.map((item, index) => (
            <button
              key={item.id}
              id={`ab-road-${item.id}`}
              className="ab-road-tab"
              role="tab"
              aria-selected={selected === index}
              aria-controls="ab-roads-panel"
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={onKeyDown}
            >
              <span className="ab-road-tab-num">0{index + 1}</span>
              <span className="ab-road-tab-label">{item.name}</span>
              <span className="ab-road-tab-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div
          className="ab-roads-panel"
          id="ab-roads-panel"
          role="tabpanel"
          aria-labelledby={`ab-road-${area.id}`}
          tabIndex={0}
        >
          <span className="ab-kicker">LOCATION NOTE / {area.bearing}</span>
          <h3>{area.name}</h3>
          <p>{area.detail}</p>
        </div>
        <a className="ab-link" href="/#coverage">Explore service areas</a>
      </div>
      <div className="ab-roads-map">
        <CoverageMap active={selected} onSelect={setSelected} panelId="ab-roads-panel" overview />
      </div>
    </section>
  );
}

const fieldScenes = [
  {
    id: "roadside",
    short: "Roadside help",
    image: "/images/roadside-detail.webp",
    note: "A boost, a tire, a way forward.",
  },
  {
    id: "towing",
    short: "Towing & recovery",
    image: "/images/recovery-detail.webp",
    note: "Care in every connection.",
  },
  {
    id: "heavy",
    short: "Heavy hauling",
    image: "/images/heavy-recovery.webp",
    note: "The right plan for the load.",
  },
];

function FieldGallery() {
  const [active, setActive] = useState("towing");
  const root = useRef(null);
  const scene = fieldScenes.find((item) => item.id === active);
  const service = services.find((item) => item.id === active);

  const select = (id) => {
    if (id === active) return;
    const cards = root.current.querySelectorAll(".ab-field-card");
    const motion = window.matchMedia(MOTION).matches;
    if (motion) Flip.killFlipsOf(cards);
    const state = motion ? Flip.getState(cards) : null;
    flushSync(() => setActive(id));
    if (motion)
      Flip.from(state, {
        duration: 0.55,
        ease: "power2.inOut",
        scale: true,
        nested: true,
        absolute: false,
      });
  };

  return (
    <section className="ab-field" aria-labelledby="ab-field-title" ref={root}>
      <div className="ab-field-head">
        <div>
          <span className="ab-kicker">01 / ON THE GROUND</span>
          <h2 id="ab-field-title">The work, up close.</h2>
        </div>
        <p>
          Different calls need different equipment. Choose a scene to see how
          we think about the job.
        </p>
      </div>
      <div className="ab-field-cards" role="group" aria-label="Explore our work">
        {fieldScenes.map((item, index) => (
          <button
            className={`ab-field-card${active === item.id ? " is-active" : ""}`}
            key={item.id}
            type="button"
            onClick={() => select(item.id)}
            aria-pressed={active === item.id}
            aria-controls="ab-field-detail"
          >
            <img src={item.image} alt="" width="1200" height="800" loading="eager" decoding="async" />
            <span className="ab-field-shade" aria-hidden="true" />
            <span className="ab-field-index">0{index + 1}</span>
            <span className="ab-field-card-title">{item.short}</span>
            <span className="ab-field-card-icon" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div className="ab-field-detail" id="ab-field-detail" aria-live="polite">
        <div className="ab-field-detail-main">
          <span className="ab-kicker">SELECTED / {scene.short.toUpperCase()}</span>
          <h3>{scene.note}</h3>
          <p>{service.description}</p>
        </div>
        <div className="ab-field-detail-side">
          <span className="ab-field-tags">{service.tags.join(" / ")}</span>
          <a className="ab-link" href={`/services/${active}/`}>
            Explore {scene.short.toLowerCase()} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage({ onHelp }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const track = root.current.querySelector(".ab-steps-track");
    const strap = track.querySelector(".ab-strap");
    const nodes = track.querySelectorAll(".ab-step-node");
    const fit = () => {
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      strap.style.top = `${first.offsetTop + first.offsetHeight / 2}px`;
      strap.style.height = `${last.offsetTop - first.offsetTop}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const page = root.current;
    const mm = gsap.matchMedia();
    mm.add(MOTION, (context) => {
      let live = true;
      let split;
      const title = page.querySelector(".ab-title");
      const media = page.querySelector(".ab-hero-media");
      const copy = page.querySelectorAll(".ab-hero .ab-kicker, .ab-lede, .ab-hero-actions");

      gsap.from(media, {
        autoAlpha: 0,
        scale: 1.045,
        duration: 1.05,
        ease: "power3.out",
        clearProps: "all",
      });
      gsap.from(copy, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
        delay: 0.25,
        stagger: 0.09,
        ease: "power2.out",
        clearProps: "all",
      });
      fontsLanded().then(() => {
        if (!live) return;
        context.add(() => {
          split = SplitText.create(title, {
            type: "lines",
            linesClass: "ab-title-line",
            mask: "lines",
            autoSplit: true,
            onSplit(instance) {
              return gsap.from(instance.lines, {
                yPercent: 106,
                autoAlpha: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
              });
            },
          });
          ScrollTrigger.refresh();
        });
      });

      const section = page.querySelector(".ab-steps");
      const stepItems = [...section.querySelectorAll(".ab-step")];
      const stepNodes = stepItems.map((item) => item.querySelector(".ab-step-node"));
      section.classList.add("is-live");
      let marks = [];
      const measureMarks = () => {
        const first = stepNodes[0].offsetTop;
        const span = stepNodes.at(-1).offsetTop - first || 1;
        marks = stepNodes.map((node) => (node.offsetTop - first) / span);
      };
      measureMarks();
      ScrollTrigger.addEventListener("refreshInit", measureMarks);
      gsap.fromTo(
        section.querySelector(".ab-strap-fill"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stepNodes[0],
            start: "center 64%",
            endTrigger: stepNodes.at(-1),
            end: "center 64%",
            scrub: 0.6,
          },
          onUpdate() {
            const progress = this.progress();
            stepItems.forEach((item, index) => {
              item.classList.toggle("is-set", index ? progress >= marks[index] - 0.004 : progress > 0.001);
            });
          },
        },
      );

      return () => {
        live = false;
        split?.revert();
        ScrollTrigger.removeEventListener("refreshInit", measureMarks);
        section.classList.remove("is-live");
        stepItems.forEach((item) => item.classList.remove("is-set"));
      };
    }, root);

    let height = page.offsetHeight;
    const refresh = gsap.delayedCall(0.2, () => ScrollTrigger.refresh()).pause();
    const observer = new ResizeObserver(() => {
      const next = page.offsetHeight;
      if (next !== height) {
        height = next;
        refresh.restart(true);
      }
    });
    observer.observe(page);
    return () => {
      observer.disconnect();
      refresh.kill();
      mm.revert();
    };
  }, []);

  return (
    <div className="ab" ref={root}>
      <section className="ab-hero" id="home" aria-labelledby="about-title">
        <figure className="ab-hero-media">
          <img
            src="/images/about-road-crew.webp"
            alt="A recovery operator in an orange safety jacket checks a vehicle strapped onto a blue flatbed at a forest roadside"
            width="1536"
            height="864"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption><span>PRINCE GEORGE, BC</span><span>ROAD CREW / ON THE JOB</span></figcaption>
        </figure>
        <div className="ab-hero-copy">
          <span className="ab-kicker">PRINCE GEORGE TOWING / ABOUT US</span>
          <h1 id="about-title" className="ab-title">The good part of a <em>bad day.</em></h1>
          <p className="ab-lede">
            Towing, recovery and roadside help in Prince George and out on the
            highways. When the day goes sideways, we pick up, come out, and
            help you find the next move.
          </p>
          <div className="ab-hero-actions">
            <a className="ab-hero-primary" href="#how-we-work">How we work <span aria-hidden="true">↓</span></a>
            <a className="ab-link" href="/contact/">Contact dispatch <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <FieldGallery />

      <section className="ab-steps" id="how-we-work" aria-labelledby="ab-steps-title">
        <div className="ab-steps-head">
          <span className="ab-kicker">02 / THE CALL</span>
          <h2 id="ab-steps-title">What happens when you call</h2>
          <p>From the first question to the last strap, you should know what is happening next.</p>
        </div>
        <div className="ab-steps-track">
          <span className="ab-strap" aria-hidden="true"><span className="ab-strap-fill" /></span>
          <ol className="ab-step-list">
            {steps.map(([title, text], index) => (
              <li className="ab-step" key={title}>
                <span className="ab-step-node" aria-hidden="true">{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Roads />

      <section className="ab-close" aria-labelledby="ab-close-title">
        <span className="ab-kicker">WHEN YOU NEED US</span>
        <h2 id="ab-close-title" className="ab-close-title">Somebody’s always up.</h2>
        <div className="ab-close-side">
          <p>Day or night, tell us where you are and what happened. We’ll work out the next step with you.</p>
          <div className="ab-close-actions">
            <button className="action-button button-blue" onClick={(event) => { event.currentTarget.focus({ preventScroll: true }); onHelp(); }}>
              <span>Get help now</span><span className="button-icon"><Icon name="phone" /></span>
            </button>
            {business.phone && <a className="ab-link" href={business.phoneHref}>Call {business.phone}</a>}
            <a className="ab-link" href="/contact/">Contact us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
