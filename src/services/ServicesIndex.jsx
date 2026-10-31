import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Icon } from "../icons";
import { Closing, Questions } from "../home/Sections";
import { MOTION_OK, Magnet } from "../home/motion";
import {
  business,
  findService,
  priceFactors,
  services,
  servicesIndexQuestions,
  situations,
} from "./content";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

function Crumbs({ trail }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {trail.map(([label, href], index) => (
        <React.Fragment key={label}>
          {index > 0 && <span aria-hidden="true">/</span>}
          {href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
export { Crumbs };

/* ------------------------------------------------------------------ Hero */

function Hero() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const section = root.current;
          const split = SplitText.create(section.querySelector(".sx-title"), {
            // Words hold their letters together so lines only break between words.
            type: "words, chars",
            mask: "chars",
          });
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(split.chars, { yPercent: 105, duration: 1.2, stagger: 0.02 }, 0.1)
            .from(section.querySelectorAll(".sx-hero-foot > *"), { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.5)
            .from(section.querySelectorAll(".sx-strip li"), { y: 90, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.55);
          return () => split.revert();
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="sx-hero" id="home" ref={root} aria-labelledby="services-title">
      <Crumbs trail={[["Home", "/"], ["Services"]]} />
      <h1 className="sx-title" id="services-title">
        Towing &amp; recovery services
      </h1>
      <div className="sx-hero-foot">
        <p>
          Five services and one dispatch number. Pick the one that sounds like
          your situation, or call and describe it, and dispatch will match the
          truck and the setup.
        </p>
        <div className="sx-hero-actions">
          <Magnet>
            <a className="button button-signal page-call" href={business.phoneHref}>
              <Icon name="phone" />
              Call {business.phone}
            </a>
          </Magnet>
          <a className="text-link" href="#finder">
            Not sure? Start with what happened
          </a>
        </div>
      </div>
      <nav aria-label="The five services">
        <ul className="sx-strip">
          {services.map((service) => (
            <li key={service.id}>
              <a href={`#${service.id}`}>
                <span className="sx-strip-photo">
                  <img
                    src={service.image.src}
                    srcSet={service.image.srcSet}
                    sizes="(max-width: 760px) 70vw, 18vw"
                    alt=""
                    width={service.image.width}
                    height={service.image.height}
                    fetchPriority={service.id === "towing" ? "high" : undefined}
                  />
                </span>
                <span className="sx-strip-title">{service.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

/* ---------------------------------------------------------------- Finder */

// "What happened?" The visitor picks the situation that sounds like theirs;
// the matching service answers with its photo, a call and its page.
function Finder() {
  const root = useRef(null);
  const [selected, setSelected] = useState(0);
  const situation = situations[selected];
  const service = findService(situation.service);
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
          const panel = root.current.querySelector(".fx-panel");
          gsap.fromTo(
            panel.querySelector(".fx-photo"),
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power4.inOut" },
          );
          gsap.fromTo(
            panel.querySelector(".fx-photo img"),
            { scale: 1.25 },
            { scale: 1, duration: 1.1, ease: "expo.out" },
          );
          gsap.fromTo(
            panel.querySelectorAll(".fx-copy > *"),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.05, delay: 0.15 },
          );
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [selected], revertOnUpdate: true },
  );

  const keydown = (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(event.key in keys) && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? situations.length - 1
          : (selected + keys[event.key] + situations.length) % situations.length;
    setSelected(next);
    document.getElementById(`situation-${next}`)?.focus();
  };

  return (
    <section className="fx" id="finder" ref={root} aria-labelledby="finder-title">
      <div className="fx-side">
        <h2 id="finder-title" data-reveal>
          What happened?
        </h2>
        <p>You don’t need the right words. Pick the one closest to yours.</p>
        <div
          className="fx-list"
          role="tablist"
          aria-label="Choose what happened"
          aria-orientation="vertical"
        >
          {situations.map((item, index) => (
            <button
              key={item.label}
              id={`situation-${index}`}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls="finder-panel"
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={keydown}
            >
              <span>{item.label}</span>
              <Icon name="right" />
            </button>
          ))}
        </div>
      </div>
      <div
        className="fx-panel"
        id="finder-panel"
        role="tabpanel"
        aria-labelledby={`situation-${selected}`}
        tabIndex={0}
        data-service={service.id}
      >
        <figure className="fx-photo">
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
        <div className="fx-copy">
          <p className="fx-match">This sounds like</p>
          <h3>{service.title}</h3>
          <p>{situation.answer}</p>
          <div className="fx-actions">
            <a className="button button-signal" href={business.phoneHref}>
              <Icon name="phone" />
              {service.action}
            </a>
            <a className="text-link" href={service.path}>
              {service.title} in detail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Chapters */

// One chapter per service. On wide screens an index stays beside them and
// marks the chapter being read; each photo opens as its chapter arrives.
function Chapters() {
  const root = useRef(null);
  const [active, setActive] = useState(services[0].id);

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray(root.current.querySelectorAll(".chapter"));
      chapters.forEach((chapter) =>
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setActive(chapter.id),
        }),
      );
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          chapters.forEach((chapter) => {
            const photo = chapter.querySelector(".chapter-photo");
            const scroll = { trigger: photo, start: "top 92%", end: "top 30%", scrub: true };
            gsap.fromTo(
              photo,
              { clipPath: "inset(18% 12% 18% 12%)" },
              { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: scroll },
            );
            gsap.fromTo(
              photo.querySelector("img"),
              { scale: 1.3 },
              { scale: 1, ease: "none", scrollTrigger: { ...scroll, end: "bottom top" } },
            );
            gsap.from(chapter.querySelectorAll(".chapter-handles li"), {
              y: 40,
              opacity: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.07,
              scrollTrigger: { trigger: chapter.querySelector(".chapter-handles"), start: "top 85%", once: true },
            });
          });
          gsap.fromTo(
            root.current.querySelector(".chapter-meter span"),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top 45%", end: "bottom 55%", scrub: true },
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
    <section className="chapters" ref={root} aria-label="Our services">
      <nav className="chapter-index" aria-label="Services on this page">
        <span className="chapter-meter" aria-hidden="true">
          <span />
        </span>
        <ul>
          {services.map((service) => (
            <li key={service.id}>
              <a
                href={`#${service.id}`}
                aria-current={active === service.id ? "location" : undefined}
              >
                {service.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="chapter-list">
        {services.map((service) => (
          <article
            className="chapter"
            id={service.id}
            key={service.id}
            aria-labelledby={`chapter-${service.id}`}
          >
            <figure className="chapter-photo">
              <img
                src={service.image.src}
                srcSet={service.image.srcSet}
                sizes="(max-width: 900px) 100vw, 66vw"
                alt={service.alt}
                width={service.image.width}
                height={service.image.height}
                loading="lazy"
              />
            </figure>
            <h2 id={`chapter-${service.id}`}>{service.title}</h2>
            <p className="chapter-promise">{service.promise}</p>
            <ul className="chapter-handles">
              {service.handles.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="chapter-ready">
              <strong>Have ready:</strong>{" "}
              {service.prepare.map(([title]) => title.toLowerCase()).join(", ")}.
            </p>
            <div className="chapter-actions">
              <a className="button button-signal" href={business.phoneHref}>
                <Icon name="phone" />
                {service.action}
              </a>
              <a className="text-link" href={service.path}>
                {service.title} in detail
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Price */

// What the price depends on. Each word slides in from its own side.
function Price() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          root.current.querySelectorAll(".price-item").forEach((item, index) =>
            gsap.fromTo(
              item.querySelector("strong"),
              { xPercent: index % 2 ? 60 : -60, opacity: 0 },
              {
                xPercent: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: { trigger: item, start: "top 95%", end: "top 60%", scrub: true },
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
    <section className="price" id="price" ref={root} aria-labelledby="price-title">
      <div className="price-head">
        <h2 id="price-title" data-reveal>
          What sets the price
        </h2>
        <p>
          Every job is priced on these five things, and we go through the cost
          with you before anything moves.
        </p>
      </div>
      <ul className="price-list">
        {priceFactors.map(([word, text]) => (
          <li className="price-item" key={word}>
            <strong>{word}</strong>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ServicesIndex() {
  return (
    <>
      <Hero />
      <Finder />
      <Chapters />
      <Price />
      <Questions
        items={servicesIndexQuestions}
        heading="Questions about our services"
        intro="Cost, distance, and what we can tow. Anything else, ask dispatch."
        id="questions"
      />
      <Closing
        heading="Not sure which one? Call dispatch."
        text="Describe what happened and where you are. Dispatch will match the truck, the setup and the cost to the job."
      />
    </>
  );
}
