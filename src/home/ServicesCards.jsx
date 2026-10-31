import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "../icons";
import { business, homeServices } from "./content";
import { MOTION_OK } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WIDE = `${MOTION_OK} and (min-width: 1100px)`;
const NARROW = `${MOTION_OK} and (max-width: 1099px)`;

// Five service cards. On wide screens the section pins and the cards rise
// from below the fold, fanned out from the centre, and settle into a row
// (after Codrops' On-Scroll Layout Formations). Narrower screens get a
// simple rise as the cards arrive; phones swipe the row sideways.
export default function ServicesCards() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        WIDE,
        () => {
          const section = root.current;
          const cards = gsap.utils.toArray(section.querySelectorAll(".svc-card"));
          const middle = (cards.length - 1) / 2;
          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: section.querySelector(".svc-stage"),
                start: "top top",
                end: "+=140%",
                pin: true,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            })
            .from(cards, {
              y: () => window.innerHeight * 0.95,
              rotation: (index) => (middle - index) * 5,
              transformOrigin: "50% 0%",
              stagger: { amount: 0.3, from: "center" },
            })
            .from(
              section.querySelectorAll(".svc-card-body"),
              { yPercent: 40, opacity: 0, stagger: { amount: 0.3, from: "center" } },
              0.35,
            )
            .from(section.querySelector(".svc-call"), { yPercent: 120, opacity: 0, duration: 0.4 }, 0.7);
        },
        root.current,
      );
      mm.add(
        NARROW,
        () => {
          ScrollTrigger.batch(root.current.querySelectorAll(".svc-item"), {
            start: "top 92%",
            once: true,
            onEnter: (items) =>
              gsap.from(items, { y: 70, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }),
          });
        },
        root.current,
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="svc" id="services" ref={root} aria-labelledby="services-heading">
      <div className="svc-stage">
        <div className="svc-head">
          <h2 id="services-heading" data-reveal>
            Pick the job closest to yours
          </h2>
          <p>
            Each one opens a page with what we bring, what to have ready, and
            the questions people ask.
          </p>
        </div>
        <ul className="svc-grid">
          {homeServices.map((item) => (
            <li className="svc-item" key={item.id}>
              <a className="svc-card" href={`/services/${item.id}/`}>
                <span className="svc-card-media">
                  <img
                    src={item.image.src}
                    srcSet={item.image.srcSet}
                    sizes="(max-width: 760px) 80vw, (max-width: 1099px) 33vw, 20vw"
                    alt={item.alt}
                    width={item.image.width}
                    height={item.image.height}
                    loading="eager"
                  />
                </span>
                <span className="svc-card-body">
                  <strong className="svc-card-title">{item.title}</strong>
                  <span className="svc-card-line">{item.line}</span>
                  <span className="svc-card-go">
                    Details
                    <Icon name="right" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a className="svc-call" href={business.phoneHref}>
          <span className="svc-call-text">
            Not sure which one? Describe what happened, and dispatch works out
            the rest.
          </span>
          <span className="svc-call-number">
            <Icon name="phone" />
            {business.phone}
          </span>
        </a>
      </div>
    </section>
  );
}
