import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { business } from "./data";
import { heroImages } from "./heroImages";
import { Icon } from "./icons";
import "./road-sequence.css";

gsap.registerPlugin(ScrollTrigger);

// Frames of the supplied road footage, 12 per second, made by
// design/prepare-sequence.mjs.
const FRAME_COUNT = 138;
const frameSrc = (width, index) =>
  `/images/road-sequence/${width}/${String(index + 1).padStart(3, "0")}.webp`;

// Where the trucks sit across each shot, so narrow screens crop around them
// rather than the middle of the picture. The poster's object-position in
// road-sequence.css matches the first shot.
const SHOTS = [
  { from: 0, focus: 0.62 },
  { from: 59, focus: 0.55 },
];

// Points along the section's scroll, from 0 to 1. The footage plays, the
// closing card fades in over its last frames, and the card holds before the
// page moves on.
const FOOTAGE_END = 0.84;
const CARD_FADE = [0.8, 0.12];
const COPY_FADE = [0.02, 0.12];

// Every 16th frame first, then the gaps between them, so scrolling shows the
// footage before the whole set has downloaded.
const loadOrder = () => {
  const order = [0, FRAME_COUNT - 1];
  for (const step of [16, 8, 4, 2, 1])
    for (let index = 0; index < FRAME_COUNT; index += step)
      if (!order.includes(index)) order.push(index);
  return order;
};

// The homepage hero: the footage fills the screen under `children`, plays as
// the visitor scrolls, and ends on the logo and dispatch number.
export default function RoadSequence({ children }) {
  const root = useRef(null);
  const stageRef = useRef(null);
  const posterRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    const section = root.current;
    const stage = stageRef.current;
    const poster = posterRef.current;
    const canvas = canvasRef.current;
    const copy = copyRef.current;
    const card = cardRef.current;
    const frames = [];
    let render = () => {};
    let loading = false;
    let mounted = true;

    // Frames outlive a change of screen size, so they download only once.
    const load = () => {
      if (loading) return;
      loading = true;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const cover = Math.max(
        (canvas.clientWidth * ratio) / 960,
        (canvas.clientHeight * ratio) / 540,
      );
      const width = cover > 1.1 ? 1280 : 960;
      const queue = loadOrder();
      const next = () => {
        if (!mounted || !queue.length) return;
        const index = queue.shift();
        const image = new Image();
        image.decoding = "async";
        image.src = frameSrc(width, index);
        image
          .decode()
          .then(
            () => {
              if (!mounted) return;
              frames[index] = image;
              render();
            },
            () => {},
          )
          .finally(next);
      };
      for (let lane = 0; lane < 6; lane += 1) next();
    };
    // The poster is the page's main image, so it downloads first.
    const loadAfterPoster = () => {
      if (poster.complete) load();
      else {
        poster.addEventListener("load", load, { once: true });
        poster.addEventListener("error", load, { once: true });
      }
    };

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".road-sequence-eyebrow", { y: 16, opacity: 0, duration: 0.7 }, 0.1)
        .from(
          ".road-sequence-line > span",
          { yPercent: 110, rotate: 3, duration: 1.1, stagger: 0.13 },
          0.15,
        )
        .from(".road-sequence-intro", { y: 20, opacity: 0, duration: 0.8 }, 0.6);
    }, section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Without data-scrub the section is a single still, which is what
      // reduced-motion and data-saver visitors see.
      if (navigator.connection?.saveData) return;
      section.dataset.scrub = "true";
      const context = canvas.getContext("2d");
      const playhead = { frame: 0 };
      let drawn = -1;

      const nearestLoaded = (index) => {
        for (let distance = 0; distance < FRAME_COUNT; distance += 1) {
          if (frames[index - distance]) return index - distance;
          if (frames[index + distance]) return index + distance;
        }
        return -1;
      };
      const draw = () => {
        const index = nearestLoaded(playhead.frame);
        if (index < 0 || index === drawn) return;
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
        section.dataset.ready = "true";
      };
      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * ratio);
        canvas.height = Math.round(canvas.clientHeight * ratio);
        drawn = -1;
        draw();
      };
      render = draw;
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      // Wait until the hero is near the screen, in case the page opened
      // further down at a section link.
      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          intersectionObserver.disconnect();
          loadAfterPoster();
        },
        { rootMargin: "100% 0px" },
      );
      intersectionObserver.observe(section);

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: () =>
          section.style.setProperty("--sequence-progress", timeline.progress()),
        scrollTrigger: {
          trigger: section,
          // The stage sticks below the header, so playback starts there.
          start: () => `top ${parseFloat(getComputedStyle(stage).top) || 0}px`,
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
      timeline
        .to(
          playhead,
          {
            frame: FRAME_COUNT - 1,
            snap: "frame",
            duration: FOOTAGE_END,
            onUpdate: draw,
          },
          0,
        )
        .to(copy, { autoAlpha: 0, y: -40, duration: COPY_FADE[1] }, COPY_FADE[0])
        .to(card, { autoAlpha: 1, duration: CARD_FADE[1] }, CARD_FADE[0])
        .from(
          ".road-sequence-card-inner",
          { y: 24, scale: 0.97, duration: CARD_FADE[1] },
          CARD_FADE[0],
        )
        .set({}, {}, 1);

      return () => {
        render = () => {};
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        delete section.dataset.scrub;
        delete section.dataset.ready;
        section.style.removeProperty("--sequence-progress");
      };
    }, section);

    return () => {
      mounted = false;
      mm.revert();
    };
  }, []);

  const { src, srcSet, sizes } = heroImages.home;
  return (
    <section
      className="road-sequence"
      id="home"
      ref={root}
      aria-labelledby="home-heading"
    >
      <div className="road-sequence-stage" ref={stageRef}>
        <div className="road-sequence-media">
          <img
            className="road-sequence-poster"
            ref={posterRef}
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt="A Prince George Towing heavy wrecker towing a semi truck on a northern BC highway"
            width="1280"
            height="720"
            fetchPriority="high"
          />
          <canvas className="road-sequence-canvas" ref={canvasRef} aria-hidden="true" />
        </div>
        <div className="road-sequence-copy" ref={copyRef}>
          {children}
        </div>
        <div className="road-sequence-meter" aria-hidden="true">
          <span className="road-sequence-track">
            <span />
          </span>
          <span>SCROLL</span>
        </div>
        <div className="road-sequence-card" ref={cardRef}>
          <div className="road-sequence-card-inner">
            <img
              src="/images/brand-header.png"
              alt="Prince George Towing"
              width="1890"
              height="615"
            />
            <span className="road-sequence-tagline">SERVICE &amp; RECOVERY</span>
            <a className="road-sequence-phone" href={business.phoneHref}>
              <span className="road-sequence-phone-icon">
                <Icon name="phone" />
              </span>
              {business.phone}
            </a>
            <span className="road-sequence-dispatch">DISPATCH, 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
