import React, { useRef } from "react";
import Header from "../home/Header";
import { Footer } from "../home/Sections";
import { useRevealLines, useSmoothScroll } from "../home/motion";
import { CallBar, useHashAlign } from "../home/shell";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";

// The About page or the Contact page, in the site's shared frame.
export default function CompanyApp({ page }) {
  const root = useRef(null);
  useSmoothScroll();
  useRevealLines(root);
  useHashAlign();
  return (
    <div className={page === "contact" ? "contact-page" : "about-page"} ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header home current={page} />
      <main id="main">{page === "contact" ? <ContactPage /> : <AboutPage />}</main>
      <Footer home />
      <CallBar watch=".page-call, .ct-number, .closing-number, .footer-call" />
    </div>
  );
}
