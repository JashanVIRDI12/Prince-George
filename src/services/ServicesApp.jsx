import React, { useRef } from "react";
import Header from "../home/Header";
import { Footer } from "../home/Sections";
import { useRevealLines, useSmoothScroll } from "../home/motion";
import { CallBar, useHashAlign } from "../home/shell";
import { findService } from "./content";
import ServicesIndex from "./ServicesIndex";
import ServicePage from "./ServicePage";

// The services page, or one service page when `id` names a service.
export default function ServicesApp({ id }) {
  const root = useRef(null);
  const service = id ? findService(id) : null;
  useSmoothScroll();
  useRevealLines(root);
  useHashAlign();
  return (
    <div className={service ? "service-page" : "services-page"} ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header home current="services" />
      <main id="main">{service ? <ServicePage service={service} /> : <ServicesIndex />}</main>
      <Footer home />
      <CallBar watch=".page-call, .closing-number, .footer-call" />
    </div>
  );
}
