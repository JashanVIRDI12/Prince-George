import React, { useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { Icon } from "../icons";
import CoverageMap from "../CoverageMap";
import { areas, business } from "../data";
import { homePhotography } from "../home/photography";
import { Closing } from "../home/Sections";
import { MOTION_OK, Magnet } from "../home/motion";
import { Crumbs } from "../services/ServicesIndex";
import { services } from "../services/content";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip);

const WIDE_MOTION = `${MOTION_OK} and (min-width: 901px)`;

/* ------------------------------------------------------------------ Hero */

// The headline and a tall photograph of the truck. On load the letters climb
// in and the photo rises; as the page scrolls the three lines drift apart
// and the photo slowly closes in.
function Hero() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const section = root.current;
          const title = section.querySelector(".ab-title");
          const photo = section.querySelector(".ab-hero-photo");
          const split = SplitText.create(title, { type: "words, chars", mask: "chars" });
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(split.chars, { yPercent: 105, duration: 1.2, stagger: 0.018 }, 0.1)
            .fromTo(
              photo,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" },
              0.2,
            )
            .from(photo.querySelector("img"), { scale: 1.4, duration: 2.2 }, 0.2)
            .from(section.querySelectorAll(".ab-hero-foot > *"), { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.6);

          const scroll = { trigger: section, start: "top top", end: "bottom top", scrub: true };
          section.querySelectorAll(".ab-title-line").forEach((line, index) =>
            gsap.to(line, { xPercent: [-14, 10, -22][index] ?? 0, ease: "none", scrollTrigger: { ...scroll } }),
          );
          gsap.to(photo.querySelector("img"), { scale: 1.18, yPercent: 6, ease: "none", scrollTrigger: { ...scroll } });
          return () => split.revert();
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  const photo = homePhotography.wrecker;
  return (
    <section className="ab-hero" id="home" ref={root} aria-labelledby="about-title">
      <div className="ab-hero-copy">
        <Crumbs trail={[["Home", "/"], ["About us"]]} />
        <h1 className="ab-title" id="about-title">
          <span className="ab-title-line">The help you need</span>{" "}
          <span className="ab-title-line">when things stop</span>{" "}
          <span className="ab-title-line">moving</span>
        </h1>
        <div className="ab-hero-foot">
          <p className="ab-lede">
            From everyday cars and pickups to buses, coaches and semi trucks,
            we tow and recover vehicles in Prince George, and move heavy
            equipment, offload trucks and help at the roadside.
          </p>
          <div className="ab-hero-actions">
            <Magnet>
              <a className="button button-signal page-call" href={business.phoneHref}>
                <Icon name="phone" />
                Call {business.phone}
              </a>
            </Magnet>
            <a className="text-link" href="#how-we-work">
              How we work
            </a>
          </div>
        </div>
      </div>
      <figure className="ab-hero-photo">
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(max-width: 900px) 100vw, 40vw"
          alt="Prince George Towing’s white and burgundy wrecker at a forest edge"
          width={photo.width}
          height={photo.height}
          fetchPriority="high"
        />
      </figure>
    </section>
  );
}

/* ----------------------------------------------------------------- Truck */

// A real photograph of the company's heavy wrecker. On wide screens the
// section pins, the photo settles and three labels point out what the truck
// carries, one at a time. Elsewhere the labels are simply listed.
// `x` and `y` place each label's dot on the photo; `dy` nudges its card up or
// down so the three never overlap.
const callouts = [
  { x: 13, y: 40, dy: 0, title: "Recovery boom", text: "Lifting and winching gear for recoveries and heavy tows." },
  { x: 43, y: 26, dy: -70, title: "Light bar", text: "Warning lights for working safely at the roadside." },
  { x: 26, y: 57, dy: 70, title: "Our number on the side", text: "Painted on the truck, and the same number that rings dispatch." },
];

function Truck() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        WIDE_MOTION,
        () => {
          const section = root.current;
          const pins = gsap.utils.toArray(section.querySelectorAll(".ab-pin"));
          const timeline = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: section.querySelector(".ab-truck-stage"),
              start: "top top",
              end: "+=170%",
              pin: true,
              scrub: 0.7,
            },
          });
          // The photo settles first, so the labels land on the right spots.
          timeline.fromTo(
            section.querySelector(".ab-truck-photo img"),
            { scale: 1.35, xPercent: 6 },
            { scale: 1, xPercent: 0, ease: "power2.out", duration: 0.5 },
            0,
          );
          pins.forEach((pin, index) => {
            const at = 0.6 + index * 0.55;
            timeline
              .from(pin.querySelector(".ab-pin-dot"), { scale: 0, duration: 0.2, ease: "back.out(3)" }, at)
              .from(pin.querySelector(".ab-pin-line"), { scaleX: 0, duration: 0.25 }, at + 0.1)
              .from(pin.querySelector(".ab-pin-label"), { y: 20, opacity: 0, duration: 0.3 }, at + 0.2);
          });
          timeline.to({}, { duration: 0.4 });
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="ab-truck" ref={root} aria-labelledby="truck-title">
      <div className="ab-truck-stage">
        <div className="ab-truck-head">
          <h2 id="truck-title" data-reveal>
            Meet the truck
          </h2>
          <p>
            Our heavy wrecker, photographed as it is. It’s the truck behind
            the bus, semi and recovery jobs, and it carries our number on the
            door.
          </p>
        </div>
        <figure className="ab-truck-photo">
          <img
            src="/images/fleet-recovery-profile-1280.webp"
            srcSet="/images/fleet-recovery-profile-960.webp 960w, /images/fleet-recovery-profile-1280.webp 1280w, /images/fleet-recovery-profile.webp 1600w"
            sizes="(max-width: 900px) 100vw, 80vw"
            alt="Prince George Towing’s white and burgundy heavy wrecker, number 568, parked side-on"
            width="1600"
            height="1200"
            loading="lazy"
          />
          <ol className="ab-pins">
            {callouts.map((item, index) => (
              <li
                className="ab-pin"
                key={item.title}
                style={{ "--x": `${item.x}%`, "--y": `${item.y}%`, "--dy": `${item.dy}px` }}
              >
                <span className="ab-pin-dot" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="ab-pin-line" aria-hidden="true" />
                <span className="ab-pin-label">
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <figcaption>Photograph of our truck</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Steps */

// The four steps of a call. With motion they take the screen one at a time
// as the page scrolls: the big number rolls over, the words slide through.
const steps = [
  ["We listen.", "Tell us where you are, what you drive and what happened. Even if you’re unsure what kind of help you need, we’ll work out the right next step with you."],
  ["We plan the job.", "We consider the vehicle, the location and the situation, then arrange the right service and equipment for the move."],
  ["You get the details.", "Before any work begins, we confirm the service, explain what to expect and answer your questions."],
  ["We get you moving.", "Roadside help, a tow or transport: we handle the next step and get the vehicle where it needs to go."],
];

function Steps() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const section = root.current;
          const items = gsap.utils.toArray(section.querySelectorAll(".ab-step"));
          section.classList.add("is-live");
          const timeline = gsap.timeline({
            defaults: { ease: "power3.inOut", duration: 1 },
            scrollTrigger: {
              trigger: section.querySelector(".ab-steps-stage"),
              start: "top top",
              end: () => `+=${items.length * 80}%`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                gsap.set(section.querySelector(".ab-steps-bar span"), { scaleX: self.progress }),
            },
          });
          items.forEach((item, index) => {
            if (index === 0) return;
            const previous = items[index - 1];
            const at = index * 1.4;
            timeline
              .to(previous.querySelector(".ab-step-num"), { yPercent: -110 }, at)
              .to(previous.querySelector(".ab-step-copy"), { yPercent: -40, opacity: 0 }, at)
              .fromTo(item.querySelector(".ab-step-num"), { yPercent: 110 }, { yPercent: 0 }, at)
              .fromTo(item.querySelector(".ab-step-copy"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1 }, at + 0.1);
          });
          timeline.to({}, { duration: 0.6 });
          return () => section.classList.remove("is-live");
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="ab-steps" id="how-we-work" ref={root} aria-labelledby="ab-steps-title">
      <div className="ab-steps-stage">
        <div className="ab-steps-head">
          <h2 id="ab-steps-title" data-reveal>
            What happens when you call
          </h2>
          <span className="ab-steps-bar" aria-hidden="true">
            <span />
          </span>
        </div>
        <ol className="ab-step-list">
          {steps.map(([title, text], index) => (
            <li className="ab-step" key={title}>
              <span className="ab-step-num-mask" aria-hidden="true">
                <span className="ab-step-num">{String(index + 1).padStart(2, "0")}</span>
              </span>
              <div className="ab-step-copy">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Gallery */

// Five panels, one per service. The chosen panel opens wide; GSAP Flip
// animates every panel from its old size to its new one.
function Gallery() {
  const root = useRef(null);
  const [active, setActive] = useState("heavy");
  const service = services.find((item) => item.id === active);

  const select = (id) => {
    if (id === active) return;
    const panels = root.current.querySelectorAll(".ab-panel");
    const motion = window.matchMedia(MOTION_OK).matches;
    const state = motion ? Flip.getState(panels) : null;
    flushSync(() => setActive(id));
    if (motion) {
      Flip.killFlipsOf(panels);
      Flip.from(state, { duration: 0.7, ease: "power3.inOut", nested: true });
      gsap.fromTo(
        root.current.querySelectorAll(".ab-gallery-detail > *"),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "expo.out", delay: 0.2 },
      );
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          gsap.from(root.current.querySelectorAll(".ab-panel"), {
            yPercent: 30,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: root.current.querySelector(".ab-panels"), start: "top 85%", once: true },
          });
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="ab-gallery" ref={root} aria-labelledby="ab-gallery-title">
      <div className="section-head">
        <h2 id="ab-gallery-title" data-reveal>
          Every call has a story
        </h2>
        <p>
          A dead battery, a coach on the shoulder, an excavator between job
          sites. Choose one to see how we approach it.
        </p>
      </div>
      <div className="ab-panels" role="group" aria-label="Our work">
        {services.map((item) => (
          <button
            className="ab-panel"
            key={item.id}
            type="button"
            data-active={active === item.id}
            aria-pressed={active === item.id}
            aria-controls="ab-gallery-detail"
            onClick={() => select(item.id)}
          >
            <img
              src={item.image.src}
              srcSet={item.image.srcSet}
              sizes="(max-width: 900px) 100vw, 50vw"
              alt=""
              width={item.image.width}
              height={item.image.height}
              loading="lazy"
            />
            <span className="ab-panel-title">{item.title}</span>
          </button>
        ))}
      </div>
      <div className="ab-gallery-detail" id="ab-gallery-detail" aria-live="polite">
        {/* The open panel already shows the name, so it is spoken, not repeated. */}
        <h3 className="sr-only">{service.title}</h3>
        <p>{service.promise}</p>
        <a className="text-link" href={service.path}>
          Explore {service.title.toLowerCase()}
        </a>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Roads */

// The roads out of Prince George, on a real street map.
function Roads() {
  const root = useRef(null);
  const [selected, setSelected] = useState(0);
  const area = areas[selected];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          gsap.fromTo(
            root.current.querySelector(".ab-roads-map"),
            { clipPath: "inset(12% 12% 12% 12%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "power2.out",
              scrollTrigger: { trigger: root.current.querySelector(".ab-roads-map"), start: "top 90%", end: "top 40%", scrub: true },
            },
          );
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next;
    if (event.key in step) next = (selected + step[event.key] + areas.length) % areas.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = areas.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    root.current.querySelector(`#ab-road-${areas[next].id}`).focus();
  };

  return (
    <section className="ab-roads" id="where-we-work" ref={root} aria-labelledby="ab-roads-title">
      <div className="ab-roads-copy">
        <h2 id="ab-roads-title" data-reveal>
          Where the roads meet
        </h2>
        <p>
          Prince George and the highways out of it: 16 west toward Vanderhoof,
          97 north past the Hart and 97 south toward Quesnel.
        </p>
        <div className="ab-roads-tabs" role="tablist" aria-label="Roads out of Prince George">
          {areas.map((item, index) => (
            <button
              key={item.id}
              id={`ab-road-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls="ab-roads-panel"
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={onKeyDown}
            >
              <span>{item.name}</span>
              <span className="ab-road-route">{item.route}</span>
            </button>
          ))}
        </div>
        <div className="ab-roads-panel" id="ab-roads-panel" role="tabpanel" aria-labelledby={`ab-road-${area.id}`} tabIndex={0}>
          <h3>{area.name}</h3>
          <p>{area.aboutDetail}</p>
        </div>
        <a className="text-link" href="/#coverage">
          Explore service areas
        </a>
      </div>
      <div className="ab-roads-map">
        <CoverageMap active={selected} onSelect={setSelected} panelId="ab-roads-panel" overview />
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Truck />
      <Steps />
      <Gallery />
      <Roads />
      <Closing
        heading="Help is never far away."
        text="Day or night, tell us where you are and what happened. We’ll help you work out the next step."
      />
    </>
  );
}
