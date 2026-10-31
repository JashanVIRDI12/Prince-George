import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Icon } from "../icons";
import { areas, business, contactFaqs } from "../data";
import { homePhotography } from "../home/photography";
import { Closing, Questions } from "../home/Sections";
import { MOTION_OK, Magnet } from "../home/motion";
import { Crumbs } from "../services/ServicesIndex";
import { services } from "../services/content";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const ZONE = "America/Vancouver";
const RING = 2 * Math.PI * 42;
const pad = (value) => String(value).padStart(2, "0");

function localTime(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const read = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
  return { hour: read("hour") % 24, minute: read("minute") };
}

// The time in Prince George, as digits and as a ring that fills through the
// day. It updates every 15 seconds and whenever the tab comes back.
function LocalClock() {
  const [time, setTime] = useState(() => localTime(new Date()));
  useEffect(() => {
    const update = () => setTime(localTime(new Date()));
    const timer = window.setInterval(update, 15000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const fraction = (time.hour * 60 + time.minute) / 1440;
  return (
    <div className="ct-dial" role="group" aria-label="Local time in Prince George">
      <svg className="ct-dial-face" viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ct-dial-track" cx="60" cy="60" r="42" />
        <circle
          className="ct-dial-arc"
          cx="60"
          cy="60"
          r="42"
          strokeDasharray={RING}
          strokeDashoffset={RING * (1 - fraction)}
        />
        <text className="ct-dial-read" x="60" y="69">
          <tspan className="ct-dial-digits">{pad(time.hour)}</tspan>
          <tspan className="ct-dial-colon">:</tspan>
          <tspan className="ct-dial-digits">{pad(time.minute)}</tspan>
        </text>
      </svg>
      <span className="ct-dial-caption">
        Local time in Prince George. Dispatch answers day and night.
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ Hero */

// The headline, a photograph with the live clock on it, and the dispatch
// number set across the full width. Its characters climb in on load and the
// number drifts sideways as the page scrolls.
function Hero() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const section = root.current;
          const title = SplitText.create(section.querySelector(".ct-title"), { type: "words, chars", mask: "chars" });
          const digits = SplitText.create(section.querySelector(".ct-number-digits"), { type: "chars", mask: "chars" });
          const photo = section.querySelector(".ct-photo");
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(title.chars, { yPercent: 105, duration: 1.1, stagger: 0.02 }, 0.1)
            .fromTo(
              photo,
              { clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut" },
              0.2,
            )
            .from(photo.querySelector("img"), { scale: 1.35, duration: 2 }, 0.2)
            // The ring sweeps round to the current time, then hands control
            // back to React so later minutes still move it.
            .from(
              section.querySelector(".ct-dial-arc"),
              { strokeDashoffset: RING, duration: 1.8, ease: "power3.inOut", clearProps: "strokeDashoffset" },
              0.6,
            )
            .from(digits.chars, { yPercent: 110, duration: 1.2, stagger: 0.04 }, 0.5)
            .from(section.querySelectorAll(".ct-hero-foot > *"), { y: 20, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.9);
          gsap.fromTo(
            section.querySelector(".ct-number-digits"),
            { xPercent: 0 },
            {
              xPercent: -8,
              ease: "none",
              scrollTrigger: { trigger: section.querySelector(".ct-number"), start: "top 80%", end: "bottom top", scrub: true },
            },
          );
          return () => {
            title.revert();
            digits.revert();
          };
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  const photo = homePhotography.hero;
  return (
    <section className="ct-hero" id="home" ref={root} aria-labelledby="contact-title">
      <div className="ct-hero-grid">
        <div className="ct-hero-copy">
          <Crumbs trail={[["Home", "/"], ["Contact"]]} />
          <p className="ct-status">
            <span className="live-dot" aria-hidden="true" />
            Dispatch answers 24/7
          </p>
          <h1 className="ct-title" id="contact-title">
            Need a tow? Let’s get you moving.
          </h1>
          <p className="ct-lede">
            Car towing, heavy-duty recovery, equipment moved or a truck
            offloaded. Tell us where you are and what needs moving, and we’ll
            work out the right help.
          </p>
        </div>
        <figure className="ct-photo">
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(max-width: 900px) 100vw, 45vw"
            alt="Prince George Towing’s white and burgundy wrecker beside a forested highway"
            width={photo.width}
            height={photo.height}
            fetchPriority="high"
          />
          <LocalClock />
        </figure>
      </div>
      <a className="ct-number" href={business.phoneHref}>
        <span className="sr-only">Call </span>
        <span className="ct-number-digits">{business.phone}</span>
      </a>
      <div className="ct-hero-foot">
        <Magnet>
          <a className="button button-signal page-call" href={business.phoneHref}>
            <Icon name="phone" />
            Call dispatch
          </a>
        </Magnet>
        <a className="text-link" href="/services/">
          Explore our services
        </a>
        <p className="ct-911">If someone is hurt or in danger, call 911 first.</p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Chooser */

// What kind of help? One tab per service; the panel shows its photo, what to
// have ready and a call. The photo wipes in on each change.
function Chooser() {
  const root = useRef(null);
  const [selected, setSelected] = useState("heavy");
  const service = services.find((item) => item.id === selected);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const panel = root.current.querySelector(".ct-panel");
          gsap.fromTo(
            panel.querySelector(".ct-panel-photo"),
            { clipPath: "inset(0% 0% 0% 100%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power4.inOut" },
          );
          gsap.fromTo(panel.querySelector(".ct-panel-photo img"), { scale: 1.25 }, { scale: 1, duration: 1.1, ease: "expo.out" });
          gsap.fromTo(
            panel.querySelectorAll(".ct-panel-copy > *"),
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.05, delay: 0.15 },
          );
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [selected], revertOnUpdate: true },
  );

  const onKeyDown = (event, index) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(event.key in keys) && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? services.length - 1
          : (index + keys[event.key] + services.length) % services.length;
    setSelected(services[next].id);
    document.getElementById(`ct-tab-${services[next].id}`)?.focus();
  };

  return (
    <section className="ct-choose" id="before-you-call" ref={root} aria-labelledby="ct-choose-title">
      <div className="ct-choose-side">
        <h2 id="ct-choose-title" data-reveal>
          What kind of help do you need?
        </h2>
        <p>Choose what fits. Dispatch will confirm the rest on the call.</p>
        <div className="ct-tabs" role="tablist" aria-label="Choose the help you need" aria-orientation="vertical">
          {services.map((item, index) => (
            <button
              key={item.id}
              id={`ct-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected === item.id}
              aria-controls="ct-service-panel"
              tabIndex={selected === item.id ? 0 : -1}
              onClick={() => setSelected(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span>{item.title}</span>
              <Icon name="right" />
            </button>
          ))}
        </div>
      </div>
      <div
        className="ct-panel"
        id="ct-service-panel"
        role="tabpanel"
        aria-labelledby={`ct-tab-${selected}`}
        tabIndex={0}
        data-service={selected}
      >
        <figure className="ct-panel-photo">
          <img
            src={service.image.src}
            srcSet={service.image.srcSet}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt={service.alt}
            width={service.image.width}
            height={service.image.height}
            loading="lazy"
          />
        </figure>
        <div className="ct-panel-copy">
          <h3>{service.title}</h3>
          <p>{service.promise}</p>
          <p className="ct-needs-label">Good to have when you call</p>
          <ul className="ct-needs">
            {service.prepare.map(([title]) => (
              <li key={title}>
                <Icon name="check" />
                {title}
              </li>
            ))}
          </ul>
          <a className="button button-signal" href={business.phoneHref}>
            <Icon name="phone" />
            {service.action}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Four things */

// Four things to tell dispatch, as cards that stick and stack: each new card
// slides over the last while the one underneath shrinks back.
const fourThings = [
  ["Where you are", "Your location, highway, intersection or nearest landmark. On the road, your direction of travel helps us find you.", "If you’re in danger, call 911 first."],
  ["What you drive", "The vehicle type, make and model. For buses, semis, RVs or equipment, the approximate size, weight and load.", "Extra details help, but aren’t required."],
  ["What happened", "What stopped you: a breakdown, a flat, a collision, a recovery or something else.", "A rough description is enough to start."],
  ["Where it needs to go", "A repair shop, home, yard or somewhere else. We’ll talk through the options before anything moves.", "We confirm the next step before we move."],
];

function FourThings() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const cards = gsap.utils.toArray(root.current.querySelectorAll(".ct-card"));
          cards.slice(0, -1).forEach((card, index) => {
            const next = cards[index + 1];
            const scroll = {
              trigger: next,
              start: "top bottom",
              end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
              scrub: true,
              invalidateOnRefresh: true,
            };
            gsap.to(card, { scale: 0.9 + index * 0.025, ease: "none", scrollTrigger: scroll });
            gsap.to(card.querySelector(".ct-card-shade"), { opacity: 1, ease: "none", scrollTrigger: { ...scroll } });
          });
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="ct-four" ref={root} aria-labelledby="ct-four-title">
      <div className="section-head">
        <h2 id="ct-four-title" data-reveal>
          Four things to tell us
        </h2>
        <p>You don’t need every answer before calling. These help us plan the right response.</p>
      </div>
      <ol className="ct-cards">
        {fourThings.map(([title, text, note], index) => (
          <li className="ct-card" key={title} style={{ "--i": index }}>
            <span className="ct-card-num" aria-hidden="true">
              {pad(index + 1)}
            </span>
            <div className="ct-card-copy">
              <h3>{title}</h3>
              <p>{text}</p>
              <p className="ct-card-note">{note}</p>
            </div>
            <span className="ct-card-shade" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ----------------------------------------------------------------- Reach */

// The four service areas, along a highway line that draws itself down the
// page as the rows go by.
function Reach() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const list = root.current.querySelector(".ct-reach-list");
          gsap.fromTo(
            root.current.querySelector(".ct-reach-line span"),
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: true } },
          );
          list.querySelectorAll(".ct-reach-row").forEach((row) =>
            gsap.from(row, {
              xPercent: 8,
              opacity: 0,
              duration: 1,
              ease: "expo.out",
              scrollTrigger: { trigger: row, start: "top 82%", once: true },
            }),
          );
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="ct-reach" id="where-we-go" ref={root} aria-labelledby="ct-reach-title">
      <div className="ct-reach-intro">
        <h2 id="ct-reach-title" data-reveal>
          In town. Out on the highway.
        </h2>
        <p>
          Tell us where you are, what happened and what needs help. We’ll
          confirm the next step.
        </p>
        <div className="ct-reach-links">
          <a className="text-link" href="/#coverage">
            Open the service-area map
          </a>
          <a className="text-link" href={business.mapsUrl} target="_blank" rel="noopener">
            Find us on Google Maps
          </a>
        </div>
      </div>
      <div className="ct-reach-body">
        <span className="ct-reach-line" aria-hidden="true">
          <span />
        </span>
        <ul className="ct-reach-list">
          {areas.map((area) => (
            <li className="ct-reach-row" key={area.id}>
              <span className="ct-reach-name">{area.name}</span>
              <span className="ct-reach-route">{area.route}</span>
              <p>{area.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <Hero />
      <Chooser />
      <FourThings />
      <Reach />
      <Questions
        items={contactFaqs}
        heading="Common questions"
        intro="A few answers for the moment before you call."
        id="questions"
      />
      <Closing
        heading="Let’s get you moving."
        text="One call starts it. Tell us where you are and what happened, day or night."
      />
    </>
  );
}
