import React, { useRef } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Statement from "./Statement";
import ServicesCards from "./ServicesCards";
import {
  Closing,
  Coverage,
  Footer,
  HeavyDuty,
  Process,
  Questions,
  Reviews,
} from "./Sections";
import { useRevealLines, useSmoothScroll } from "./motion";
import { CallBar, useHashAlign } from "./shell";

export default function HomePage() {
  const root = useRef(null);
  useSmoothScroll();
  useRevealLines(root);
  useHashAlign();

  return (
    <div className="home" ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Statement />
        <ServicesCards />
        <HeavyDuty />
        <Process />
        <Reviews />
        <Coverage />
        <Questions />
        <Closing />
      </main>
      <Footer />
      <CallBar watch=".hero-number, .hero-card-number, .svc-call, .closing-number, .footer-call" />
    </div>
  );
}
