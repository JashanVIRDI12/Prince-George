import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "../icons";
import { business, homeServices } from "./content";
import { useHeaderOnScroll } from "./motion";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Clear over the top of the page, solid white once it scrolls, and out of the
// way while the visitor reads downward. Inner pages pass `home` so the logo
// leads back to the home page, and `current` to mark where the visitor is.
export default function Header({ home = false, current } = {}) {
  const header = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  // The dropdown photos load the first time it opens, not with the page.
  const [servicesSeen, setServicesSeen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const toggleRef = useRef(null);
  const closeTimer = useRef(null);
  useHeaderOnScroll(header);

  const openServices = () => {
    setServicesSeen(true);
    setServicesOpen(true);
  };
  const cancelClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const hoverOpen = (event) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    openServices();
  };
  const hoverClose = (event) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      if (!servicesRef.current?.contains(document.activeElement))
        setServicesOpen(false);
    }, 220);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      if (servicesOpen) {
        setServicesOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [servicesOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const closeOutside = (event) => {
      if (!servicesRef.current?.contains(event.target)) setServicesOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [servicesOpen]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", menuOpen);
    return () => document.documentElement.removeAttribute("data-menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className="site-header"
        ref={header}
        data-open={menuOpen || servicesOpen ? "true" : undefined}
      >
        <a
          className="brand"
          href={home ? "/" : "#home"}
          aria-label={home ? "Prince George Towing, home" : "Prince George Towing, back to top"}
        >
          <img src="/images/brand-header.png" alt="" width="1890" height="615" />
        </a>

        <nav className="nav" aria-label="Main navigation">
          <div
            className="nav-services"
            ref={servicesRef}
            onPointerEnter={hoverOpen}
            onPointerLeave={hoverClose}
          >
            <a
              href="/services/"
              className="nav-link"
              aria-current={current === "services" ? "page" : undefined}
            >
              Services
            </a>
            <button
              type="button"
              ref={toggleRef}
              className="nav-services-toggle"
              aria-label="Services menu"
              aria-expanded={servicesOpen}
              aria-controls="services-dropdown"
              onClick={(event) => {
                cancelClose();
                // A mouse click after hovering keeps the menu open rather than
                // closing what the hover just opened.
                if (event.detail > 0 && window.matchMedia(FINE_POINTER).matches)
                  openServices();
                else if (servicesOpen) setServicesOpen(false);
                else openServices();
              }}
            >
              <Chevron />
            </button>
            <div
              className="services-dropdown"
              id="services-dropdown"
              data-open={servicesOpen}
              onPointerEnter={hoverOpen}
            >
              <ul>
                {homeServices.map((item) => (
                  <li key={item.id}>
                    <a href={`/services/${item.id}/`}>
                      <span className="dropdown-photo">
                        {servicesSeen && (
                          <img
                            {...item.image}
                            sizes="(max-width: 1100px) 25vw, 15vw"
                            alt=""
                          />
                        )}
                      </span>
                      <strong>{item.title}</strong>
                      <span>{item.line}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a className="dropdown-all" href="/services/">
                Compare all services
              </a>
            </div>
          </div>
          <a
            className="nav-link"
            href="/about/"
            aria-current={current === "about" ? "page" : undefined}
          >
            About us
          </a>
          <a
            className="nav-link"
            href="/contact/"
            aria-current={current === "contact" ? "page" : undefined}
          >
            Contact
          </a>
        </nav>

        <div className="header-end">
          <a className="header-call" href={business.phoneHref}>
            <Icon name="phone" />
            <span className="header-call-label">Call</span>
            <span className="header-call-number">{business.phone}</span>
          </a>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-menu"
            id="mobile-menu"
            aria-label="Mobile navigation"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mobile-services">
              <div className="mobile-services-heading">
                <a href="/services/" onClick={closeMenu}>
                  Services
                </a>
                <button
                  type="button"
                  aria-label="Mobile services menu"
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-list"
                  onClick={() => setMobileServicesOpen((open) => !open)}
                >
                  <Chevron />
                </button>
              </div>
              <div
                className="mobile-services-list"
                id="mobile-services-list"
                hidden={!mobileServicesOpen}
              >
                {homeServices.map((item) => (
                  <a key={item.id} href={`/services/${item.id}/`} onClick={closeMenu}>
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
            <a
              className="mobile-link"
              href="/about/"
              onClick={closeMenu}
              aria-current={current === "about" ? "page" : undefined}
            >
              About us
            </a>
            <a
              className="mobile-link"
              href="/contact/"
              onClick={closeMenu}
              aria-current={current === "contact" ? "page" : undefined}
            >
              Contact
            </a>
            <a className="button button-signal mobile-call" href={business.phoneHref}>
              <Icon name="phone" />
              Call {business.phone}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
