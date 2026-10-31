import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Icon } from "../icons";
import { homePhotography } from "../home/photography";
import { Closing, Questions } from "../home/Sections";
import { MOTION_OK, Magnet } from "../home/motion";
import { business, services } from "./content";
import { Crumbs } from "./ServicesIndex";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ Hero */

function Hero({ service }) {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const section = root.current;
          const photo = section.querySelector(".sp-photo");
          const split = SplitText.create(section.querySelector(".sp-title"), {
            // Words hold their letters together so lines only break between words.
            type: "words, chars",
            mask: "chars",
          });
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(split.chars, { yPercent: 105, duration: 1.15, stagger: 0.025 }, 0.1)
            .from(section.querySelectorAll(".sp-hero-row > *"), { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.45)
            .fromTo(
              photo,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" },
              0.25,
            )
            .from(photo.querySelector("img"), { scale: 1.35, duration: 2.2 }, 0.25);
          // As the page moves on, the photo drifts and tightens.
          gsap.to(photo.querySelector("img"), {
            yPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: photo, start: "top 40%", end: "bottom top", scrub: true },
          });
          return () => split.revert();
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="sp-hero" id="home" ref={root} aria-labelledby="service-title">
      <Crumbs trail={[["Home", "/"], ["Services", "/services/"], [service.title]]} />
      <h1 className="sp-title" id="service-title">
        {service.title}
      </h1>
      <div className="sp-hero-row">
        <p className="sp-lead">{service.lead}</p>
        <div className="sp-hero-actions">
          <Magnet>
            <a className="button button-signal page-call" href={business.phoneHref}>
              <Icon name="phone" />
              {service.action}
            </a>
          </Magnet>
          <a className="text-link" href="#before-you-call">
            What to have ready
          </a>
        </div>
      </div>
      <figure className="sp-photo">
        <img
          src={service.image.src}
          srcSet={service.image.srcSet}
          sizes="100vw"
          alt={service.alt}
          width={service.image.width}
          height={service.image.height}
          fetchPriority="high"
        />
      </figure>
    </section>
  );
}

/* --------------------------------------------------------------- Handles */

function Handles({ service }) {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          ScrollTrigger.batch(root.current.querySelectorAll(".sp-handle"), {
            start: "top 88%",
            once: true,
            onEnter: (cards) =>
              gsap.from(cards, { y: 80, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }),
          });
          root.current.querySelectorAll(".sp-handle").forEach((card) =>
            gsap.fromTo(
              card.querySelector(".sp-handle-rule"),
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: { trigger: card, start: "top 85%", end: "top 55%", scrub: true },
              },
            ),
          );
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="sp-handles" id="what-we-handle" ref={root} aria-labelledby="handles-title">
      <div className="section-head">
        <h2 id="handles-title" data-reveal>
          What we handle
        </h2>
        <p>{service.promise}</p>
      </div>
      <ul className="sp-handle-grid">
        {service.handles.map(([title, text]) => (
          <li className="sp-handle" key={title}>
            <span className="sp-handle-rule" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------- Statement */

// One sentence, very large, that fills in word by word as it passes.
function Statement({ service }) {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const text = root.current.querySelector(".sp-statement");
          const split = SplitText.create(text, {
            type: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.16 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 45%", scrub: true },
                },
              ),
          });
          return () => split.revert();
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="sp-say" ref={root} aria-label="How we work">
      <p className="sp-statement">{service.statement}</p>
    </section>
  );
}

/* ------------------------------------------------------- Before you call */

// Three details that let dispatch plan the job, beside a photo that stays
// put. Each step lights up as it reaches the middle of the screen.
function BeforeYouCall({ service }) {
  const root = useRef(null);
  const photo = service.id === "roadside" ? homePhotography.hero : homePhotography.wrecker;
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          root.current.querySelectorAll(".sp-step").forEach((step) => {
            const scroll = { trigger: step, start: "top 75%", end: "top 45%", scrub: true };
            gsap.fromTo(step, { opacity: 0.25 }, { opacity: 1, ease: "none", scrollTrigger: scroll });
            gsap.fromTo(
              step.querySelector(".sp-step-num"),
              { xPercent: -40 },
              { xPercent: 0, ease: "power2.out", scrollTrigger: { ...scroll } },
            );
          });
          gsap.fromTo(
            root.current.querySelector(".sp-before-photo img"),
            { scale: 1.2 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
            },
          );
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="sp-before" id="before-you-call" ref={root} aria-labelledby="before-title">
      <div className="sp-before-media">
        <figure className="sp-before-photo">
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(max-width: 900px) 100vw, 45vw"
            alt="Prince George Towing’s white and burgundy wrecker, ready to go"
            width={photo.width}
            height={photo.height}
            loading="lazy"
          />
        </figure>
      </div>
      <div className="sp-before-copy">
        <h2 id="before-title" data-reveal>
          Before you call
        </h2>
        <p className="sp-before-lead">
          Three details let dispatch plan the job before the truck leaves. No
          perfect explanation needed.
        </p>
        <ol className="sp-steps">
          {service.prepare.map(([title, text], index) => (
            <li className="sp-step" key={title}>
              <span className="sp-step-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <a className="button button-signal" href={business.phoneHref}>
          <Icon name="phone" />
          {service.action}
        </a>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Others */

function Others({ service }) {
  const root = useRef(null);
  const others = services.filter((item) => item.id !== service.id);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          gsap.from(root.current.querySelectorAll(".sp-other"), {
            y: 100,
            rotation: (index) => (index - 1.5) * 3,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: root.current.querySelector(".sp-other-grid"), start: "top 85%", once: true },
          });
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="sp-others" ref={root} aria-labelledby="others-title">
      <div className="section-head">
        <h2 id="others-title" data-reveal>
          Other services
        </h2>
        <a className="text-link" href="/services/">
          Compare all services
        </a>
      </div>
      <ul className="sp-other-grid">
        {others.map((item) => (
          <li key={item.id}>
            <a className="sp-other" href={item.path}>
              <span className="sp-other-photo">
                <img
                  src={item.image.src}
                  srcSet={item.image.srcSet}
                  sizes="(max-width: 760px) 80vw, 25vw"
                  alt=""
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                />
              </span>
              <strong>{item.title}</strong>
              <span>{item.promise}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ServicePage({ service }) {
  return (
    <>
      <Hero service={service} />
      <Handles service={service} />
      <Statement service={service} />
      <BeforeYouCall service={service} />
      <Questions
        items={service.questions}
        heading="Good to know"
        intro={`The questions people ask most about ${service.title.toLowerCase()}. Anything else, ask dispatch.`}
        id="questions"
      />
      <Others service={service} />
      <Closing
        heading={`Need ${service.title.toLowerCase()}? Call dispatch.`}
        action={service.action}
        text="Tell us where you are and what happened. We’ll confirm the equipment, the destination and the cost before anything moves."
      />
    </>
  );
}
