import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { statementLines } from "./content";
import { MOTION_OK } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Three lines of very large type, each with a photo set between its words.
// As each line scrolls in it slides from alternate sides, and its photo
// grows from a sliver and warms from grey to full colour (after Codrops'
// One Element Scroll and Layout Formations demos).
export default function Statement() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          root.current.querySelectorAll(".st-line").forEach((line, index) => {
            const scroll = {
              trigger: line,
              start: "top bottom",
              end: "top 40%",
              scrub: true,
            };
            gsap.fromTo(
              line,
              { xPercent: index % 2 ? 22 : -22 },
              { xPercent: 0, ease: "power1.out", scrollTrigger: scroll },
            );
            const media = line.querySelector(".st-media");
            gsap.fromTo(
              media,
              { scaleX: 0.15, filter: "grayscale(1) brightness(1.35)" },
              { scaleX: 1, filter: "grayscale(0) brightness(1)", ease: "none", scrollTrigger: { ...scroll } },
            );
            gsap.fromTo(
              media.querySelector("img"),
              { scale: 1.7 },
              { scale: 1, ease: "none", scrollTrigger: { ...scroll } },
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
    <section className="statement" ref={root} aria-labelledby="statement-heading">
      <h2 className="st-lines" id="statement-heading">
        {statementLines.map((line) => (
          <span className="st-line" key={line.before}>
            <span>{line.before}</span>
            <span className="st-media" aria-hidden="true">
              <img
                src={line.image.src}
                srcSet={line.image.srcSet}
                sizes="30vw"
                alt=""
                width={line.image.width}
                height={line.image.height}
                loading="eager"
              />
            </span>
            {line.after && <span>{line.after}</span>}
          </span>
        ))}
      </h2>
      <div className="st-foot">
        <p>
          Five services and one dispatch number. Tell us what happened and we
          match the truck and the setup to the job, in town or out on the
          highway.
        </p>
        <a className="text-link" href="#services">
          See the services
        </a>
      </div>
    </section>
  );
}
