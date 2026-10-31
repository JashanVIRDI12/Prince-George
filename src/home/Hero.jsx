import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Icon } from "../icons";
import { heroImages } from "../heroImages";
import { business } from "./content";
import { MOTION_OK, Magnet } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Frames of the company's truck towing a semi along a northern highway, 12 per
// second, made by design/prepare-sequence.mjs.
const FRAME_COUNT = 138;
const frameSrc = (width, index) =>
  `/images/road-sequence/${width}/${String(index + 1).padStart(3, "0")}.webp`;

// Where the trucks sit across each shot, so narrow screens crop around them
// rather than the middle of the picture.
const SHOTS = [
  { from: 0, focus: 0.62 },
  { from: 59, focus: 0.55 },
];

// Every 16th frame first, then the gaps between them, so scrolling shows the
// whole drive before every frame has downloaded.
const loadOrder = () => {
  const order = [0, FRAME_COUNT - 1];
  for (const step of [16, 8, 4, 2, 1])
    for (let index = 0; index < FRAME_COUNT; index += step)
      if (!order.includes(index)) order.push(index);
  return order;
};

// Draws one frame at a time onto the canvas, cropped to cover it. Until a
// frame arrives, the nearest one that has is drawn instead.
function frameSequence(canvas) {
  const context = canvas.getContext("2d");
  const frames = [];
  let wanted = 0;
  let drawn = -1;
  let alive = true;

  const nearestLoaded = (index) => {
    for (let distance = 0; distance < FRAME_COUNT; distance += 1) {
      if (frames[index - distance]) return index - distance;
      if (frames[index + distance]) return index + distance;
    }
    return -1;
  };
  const draw = () => {
    const index = nearestLoaded(wanted);
    if (index < 0 || index === drawn || !canvas.width) return;
    const image = frames[index];
    const { focus } = SHOTS.findLast((shot) => index >= shot.from);
    const scale = Math.max(
      canvas.width / image.naturalWidth,
      canvas.height / image.naturalHeight,
    );
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(
      image,
      (canvas.width - width) * focus,
      (canvas.height - height) / 2,
      width,
      height,
    );
    drawn = index;
  };
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    drawn = -1;
    draw();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const load = () => {
    const width = window.matchMedia("(max-width: 820px)").matches ? 960 : 1280;
    const queue = loadOrder();
    const next = () => {
      if (!alive || !queue.length) return;
      const index = queue.shift();
      const image = new Image();
      image.decoding = "async";
      image.src = frameSrc(width, index);
      image
        .decode()
        .then(
          () => {
            if (!alive) return;
            frames[index] = image;
            draw();
            if (index === 0) canvas.dataset.ready = "";
          },
          () => {},
        )
        .finally(next);
    };
    for (let lane = 0; lane < 4; lane += 1) next();
  };

  return {
    show(index) {
      wanted = index;
      draw();
    },
    load,
    destroy() {
      alive = false;
      observer.disconnect();
      delete canvas.dataset.ready;
    },
  };
}

// The window's place on the stage, as a clip-path inset.
const insetOf = (target, stage) => {
  const a = target.getBoundingClientRect();
  const b = stage.getBoundingClientRect();
  return `inset(${a.top - b.top}px ${b.right - a.right}px ${b.bottom - a.bottom}px ${a.left - b.left}px)`;
};

// A three-line headline with a small photo window set into it. With motion,
// the stage pins and the window opens out to fill the screen while the lines
// slide apart. Scrolling on drives the truck down the highway, frame by frame,
// and the drive ends on the logo, the dispatch number and a way to get in
// touch. Without motion, the page simply scrolls past the headline.
export default function Hero() {
  const root = useRef(null);
  const [live, setLive] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const section = root.current;
          const stage = section.querySelector(".hero-stage");
          const film = section.querySelector(".hero-film");
          const frame = section.querySelector(".hero-window");
          const still = section.querySelector(".hero-film-still");
          const canvas = section.querySelector(".hero-sequence");
          const caption = section.querySelector(".hero-film-caption");
          const card = section.querySelector(".hero-card");
          const photoBounds = () => {
            const box = frame.getBoundingClientRect();
            const canvasBox = stage.getBoundingClientRect();
            return {
              left: box.left - canvasBox.left,
              top: box.top - canvasBox.top,
              width: box.width,
              height: box.height,
            };
          };
          const lines = section.querySelectorAll(".hero-line");
          section.classList.add("is-live");
          setLive(true);

          // Visitors saving data keep the still photograph under the card.
          const saveData = Boolean(navigator.connection?.saveData);
          const sequence = frameSequence(canvas);
          const playhead = { frame: 0 };
          // The still is the page's main image, so the frames wait for it.
          if (!saveData) {
            if (still.complete) sequence.load();
            else {
              still.addEventListener("load", sequence.load, { once: true });
              still.addEventListener("error", sequence.load, { once: true });
            }
          }

          // Entrance: letters climb out of each line, the photo settles.
          // Split the heading itself, so its accessible name stays on the h1.
          // Words as well as letters: splitting letters alone makes SplitText
          // cut each line where it wraps at that moment, often before the
          // headline font has loaded, and the break then stays for good.
          const split = SplitText.create(section.querySelector(".hero-title"), {
            type: "words,chars",
            mask: "chars",
          });
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(split.chars, { yPercent: 105, duration: 1.2, stagger: 0.022 }, 0.1)
            .from(still, { scale: 1.08, duration: 2 }, 0)
            .from(section.querySelectorAll(".hero-foot > *"), { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.6);

          // Scroll: the window opens to the whole stage (0 to 1), the truck
          // drives (0.5 to 3.1), then the closing card comes up and holds.
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "+=390%",
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .fromTo(
              film,
              { clipPath: () => insetOf(frame, stage) },
              { clipPath: "inset(0px 0px 0px 0px)", ease: "power2.inOut", duration: 1 },
              0,
            )
            .fromTo(
              still,
              {
                left: () => photoBounds().left,
                top: () => photoBounds().top,
                width: () => photoBounds().width,
                height: () => photoBounds().height,
              },
              { left: 0, top: 0, width: "100%", height: "100%", ease: "power2.inOut", duration: 1 },
              0,
            )
            .to(lines[0], { xPercent: -45, duration: 1 }, 0)
            .to(lines[1], { xPercent: 25, duration: 1 }, 0)
            .to(lines[2], { xPercent: -30, duration: 1 }, 0)
            .to(section.querySelector(".hero-foot"), { yPercent: 60, opacity: 0, duration: 0.5 }, 0);
          // Start with the truck portrait in the headline window; hand over
          // to the road frames as the photograph opens to full width.
          if (!saveData) timeline.to(still, { opacity: 0, duration: 0.25 }, 0.4);
          timeline
            .to(
              playhead,
              {
                frame: FRAME_COUNT - 1,
                snap: "frame",
                duration: 2.6,
                onUpdate: () => sequence.show(playhead.frame),
              },
              0.5,
            )
            .fromTo(caption, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, 0.75)
            .fromTo(caption.querySelector(".hero-film-meter span"), { scaleX: 0 }, { scaleX: 1, duration: 2.35 }, 0.75)
            .to(caption, { y: -20, opacity: 0, duration: 0.2 }, 2.85)
            .fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 2.95)
            .fromTo(
              card.querySelectorAll(".hero-card-inner > *"),
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.35, stagger: 0.07, ease: "power3.out" },
              3.0,
            )
            // Hold the card for a moment before the page moves on.
            .set({}, {}, 3.9);

          return () => {
            split.revert();
            sequence.destroy();
            still.removeEventListener("load", sequence.load);
            still.removeEventListener("error", sequence.load);
            section.classList.remove("is-live");
            setLive(false);
          };
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="hero" id="home" ref={root} aria-labelledby="home-heading">
      <div className="hero-stage">
        <div className="hero-layout">
          <h1 className="hero-title" id="home-heading">
            <span className="hero-line">Towing and heavy</span>{" "}
            <span className="hero-line hero-line-split">
              <span>recovery</span>
              <span className="hero-window" aria-hidden="true">
                <img
                  src={heroImages.home.src}
                  srcSet={heroImages.home.srcSet}
                  sizes="(max-width: 760px) 100vw, 40vw"
                  alt=""
                  width="1600"
                  height="900"
                  fetchPriority="high"
                />
              </span>
            </span>{" "}
            {/* Kept together so "BC" never wraps onto a line alone. */}
            <span className="hero-line">
              in Prince <span className="hero-keep">George, BC</span>
            </span>
          </h1>

          <div className="hero-foot">
            <p className="hero-sub">
              Cars to tour coaches, semis to excavators. Call once, and we plan
              the right truck for the job.
            </p>
            <div className="hero-dispatch">
              <span>Dispatch answers 24/7</span>
              <a className="hero-number" href={business.phoneHref}>
                <span className="sr-only">Call </span>
                {business.phone}
              </a>
            </div>
            <div className="hero-actions">
              <Magnet>
                <a className="button button-signal hero-cta" href={business.phoneHref}>
                  <Icon name="phone" />
                  Call dispatch
                </a>
              </Magnet>
              <a className="text-link" href="#services">
                See what we move
              </a>
            </div>
          </div>
        </div>

        <div className="hero-film" aria-hidden={live ? undefined : "true"}>
          <div className="hero-film-media">
            <canvas className="hero-sequence" aria-hidden="true" />
            <img
              className="hero-film-still"
              {...heroImages.home}
              alt=""
              fetchPriority="high"
            />
          </div>
          <div className="hero-film-caption" aria-hidden="true">
            <span>Our truck on the road</span>
            <span className="hero-film-meter">
              <span />
            </span>
          </div>
          <div className="hero-card">
            <div className="hero-card-inner">
              <img
                className="hero-card-logo"
                src="/images/brand-header-reversed-1200.webp"
                alt="Prince George Towing"
                width="1200"
                height="390"
                loading="lazy"
              />
              <span className="hero-card-label">Dispatch answers 24/7</span>
              <a className="hero-card-number" href={business.phoneHref}>
                <span className="sr-only">Call </span>
                {business.phone}
              </a>
              <Magnet>
                <a className="button button-signal hero-card-cta" href="/contact/">
                  Contact now
                  <Icon name="right" />
                </a>
              </Magnet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
