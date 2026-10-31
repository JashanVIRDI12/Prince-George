import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { business } from "./data";
import Experience, { SiteFooter, serviceVisuals } from "./Experience";
import { Brand, Icon } from "./icons";
import ServicesPage from "./ServicesPage";
import ServiceDetailPage from "./ServiceDetailPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import RoadSequence from "./RoadSequence";
import { serviceDetails } from "./serviceContent";

gsap.registerPlugin(ScrollTrigger);

function ActionButton({
  children,
  onClick,
  href,
  className = "",
  icon = "arrow",
  ...props
}) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      className={`action-button ${className}`}
      href={href}
      onClick={(e) => {
        e.currentTarget.focus({ preventScroll: true });
        onClick?.(e);
      }}
      {...props}
    >
      <span>{children}</span>
      <span className="button-icon">
        <Icon name={icon} />
      </span>
    </Tag>
  );
}

function Modal({ children, onClose, className = "", titleId }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-inner">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </dialog>
  );
}

export default function App({ page = "home" }) {
  const isServicesPage = page === "services";
  const detailId = page.startsWith("service-") ? page.slice(8) : null;
  const isAboutPage = page === "about";
  const isContactPage = page === "contact";
  const isHomePage = page === "home";
  const homePrefix = isHomePage ? "" : "/";
  const root = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesMenuRef = useRef(null);
  const servicesToggleRef = useRef(null);
  const servicesCloseTimer = useRef(null);
  const [service, setService] = useState(null);
  const modal = service && (service.modal || service);
  const cancelServicesClose = () => {
    window.clearTimeout(servicesCloseTimer.current);
    servicesCloseTimer.current = null;
  };
  const openServicesOnHover = (event) => {
    if (event.pointerType !== "mouse") return;
    cancelServicesClose();
    setServicesMenuOpen(true);
  };
  const closeServicesOnHover = (event) => {
    if (event.pointerType !== "mouse") return;
    cancelServicesClose();
    servicesCloseTimer.current = window.setTimeout(() => {
      const dropdown = servicesMenuRef.current?.querySelector(".services-dropdown");
      if (!dropdown?.contains(document.activeElement)) setServicesMenuOpen(false);
    }, 220);
  };

  useEffect(() => () => window.clearTimeout(servicesCloseTimer.current), []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(".page-progress", {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: "max",
            scrub: 0.2,
          },
        });
      },
      root,
    );
    mm.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        const cleanups = gsap.utils.toArray(".hero-cta").map((button) => {
          const strength = button.classList.contains("giant-arrow") ? 20 : 7;
          const move = (event) => {
            const rect = button.getBoundingClientRect();
            gsap.to(button, {
              x: ((event.clientX - rect.left) / rect.width - 0.5) * strength,
              y: ((event.clientY - rect.top) / rect.height - 0.5) * strength,
              duration: 0.4,
              overwrite: "auto",
            });
          };
          const reset = () =>
            gsap.to(button, {
              x: 0,
              y: 0,
              duration: 0.65,
              ease: "elastic.out(1, .4)",
              overwrite: "auto",
            });
          button.addEventListener("pointermove", move);
          button.addEventListener("pointerleave", reset);
          return () => {
            button.removeEventListener("pointermove", move);
            button.removeEventListener("pointerleave", reset);
            gsap.killTweensOf(button);
            gsap.set(button, { clearProps: "transform" });
          };
        });
        return () => cleanups.forEach((cleanup) => cleanup());
      },
      root,
    );
    return () => mm.revert();
  }, []);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileServicesOpen(false);
        if (servicesMenuOpen) {
          setServicesMenuOpen(false);
          servicesToggleRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [servicesMenuOpen]);

  useEffect(() => {
    if (!servicesMenuOpen) return;
    const closeOutside = (event) => {
      if (!servicesMenuRef.current?.contains(event.target))
        setServicesMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [servicesMenuOpen]);

  useEffect(() => {
    // Let React, fonts, and ScrollTrigger settle before positioning hash links.
    let cancelled = false;
    let frame;
    let revision = 0;
    const alignHash = () => {
      const targetId = window.location.hash.slice(1);
      if (!targetId) return;
      const currentRevision = ++revision;
      cancelAnimationFrame(frame);
      document.fonts.ready.then(() => {
        if (cancelled || currentRevision !== revision) return;
        frame = requestAnimationFrame(() => {
          const target = document.getElementById(targetId);
          if (!target) return;
          ScrollTrigger.refresh();
          // Refresh restores the document's scroll behavior on the next frame.
          frame = requestAnimationFrame(() => {
            target.scrollIntoView({
              // A later ScrollTrigger refresh can interrupt native smooth
              // scrolling while gallery layout is changing, leaving the
              // destination off screen in mobile WebKit.
              behavior: "instant",
              block: "start",
            });
            ScrollTrigger.update();
          });
        });
      });
    };
    alignHash();
    window.addEventListener("hashchange", alignHash);
    window.addEventListener("load", alignHash);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", alignHash);
      window.removeEventListener("load", alignHash);
    };
  }, []);

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Brand href={isHomePage ? "#home" : "/"} />
        <nav className="desktop-nav" aria-label="Main navigation">
          <div
            className="nav-services"
            ref={servicesMenuRef}
            data-active={isServicesPage || Boolean(detailId)}
            onPointerEnter={openServicesOnHover}
            onPointerLeave={closeServicesOnHover}
          >
            <a href="/services/" className="nav-services-link" aria-current={isServicesPage ? "page" : undefined}>
              <span className="nav-index">01</span> Services
            </a>
            <button
              type="button"
              ref={servicesToggleRef}
              className="nav-services-toggle"
              aria-label="Services menu"
              aria-expanded={servicesMenuOpen}
              aria-controls="services-dropdown"
              onClick={(event) => {
                cancelServicesClose();
                if (event.detail > 0 && window.matchMedia("(hover: hover) and (pointer: fine)").matches)
                  setServicesMenuOpen(true);
                else setServicesMenuOpen((open) => !open);
              }}
            >
              <Icon name="down" />
            </button>
            <div className="services-dropdown" id="services-dropdown" hidden={!servicesMenuOpen} onPointerEnter={openServicesOnHover}>
              <div className="services-dropdown-top">
                <div>
                  <span>THE RIGHT RESPONSE</span>
                  <strong>What can we help with?</strong>
                </div>
                <a href="/services/">All services <Icon name="arrow" /></a>
              </div>
              <div className="services-dropdown-grid">
                {serviceDetails.map((item) => (
                  <a href={item.path} key={item.id} aria-current={detailId === item.id ? "page" : undefined}>
                    <span className="services-dropdown-photo"><img src={item.image} alt="" width="1536" height="1024" loading="lazy" /></span>
                    <span className="services-dropdown-meta">{item.number} / {item.category}</span>
                    <strong>{item.title}</strong>
                    <span className="services-dropdown-copy">{item.indexCopy}</span>
                    <Icon name="arrow" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="/about/" aria-current={isAboutPage ? "page" : undefined}>
            <span className="nav-index">02</span> About us
          </a>
          <a href="/contact/" aria-current={isContactPage ? "page" : undefined}>
            <span className="nav-index">03</span> Contact
          </a>
        </nav>
        <div className="header-actions">
          <span className="header-availability">
            <span className="status-dot" /> 24/7. EVERY DAY.
          </span>
          <ActionButton
            className="header-help button-blue"
            href={business.phoneHref}
            icon="phone"
          >
            Get help now
          </ActionButton>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
        <div className="page-progress" />
      </header>
      {menuOpen && (
        <nav
          className="mobile-menu"
          id="mobile-menu"
          aria-label="Mobile navigation"
        >
          <div className="mobile-services">
            <div className="mobile-services-heading">
              <a href="/services/" aria-current={isServicesPage ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                <span className="eyebrow">01</span> Services <Icon name="arrow" />
              </a>
              <button
                type="button"
                aria-label="Mobile services menu"
                aria-expanded={mobileServicesOpen}
                aria-controls="mobile-services-list"
                onClick={() => setMobileServicesOpen((open) => !open)}
              >
                <Icon name="down" />
              </button>
            </div>
            <div className="mobile-services-list" id="mobile-services-list" hidden={!mobileServicesOpen}>
                {serviceDetails.map((item) => (
                  <a key={item.id} href={item.path} aria-current={detailId === item.id ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                    <span>{item.number}</span>{item.title}<Icon name="arrow" />
                  </a>
                ))}
            </div>
          </div>
          {[
            ["About us", "about"],
            ["Contact", "contact"],
          ].map(([label, id], i) => (
            <a
              key={id}
              href={`/${id}/`}
              aria-current={page === id ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span className="eyebrow">0{i + 2}</span>
              {label}
              <Icon name="arrow" />
            </a>
          ))}
          <ActionButton
            href={business.phoneHref}
            onClick={() => setMenuOpen(false)}
            className="button-orange"
            icon="phone"
          >
            Get towing help
          </ActionButton>
        </nav>
      )}
      <main id="main">
        {isContactPage ? (
          <ContactPage />
        ) : isAboutPage ? (
          <AboutPage />
        ) : detailId ? (
          <ServiceDetailPage id={detailId} />
        ) : isServicesPage ? (
          <ServicesPage />
        ) : (
          <>
            <RoadSequence>
              <div className="eyebrow road-sequence-eyebrow">
                <span className="status-dot" /> CARS / HEAVY DUTY / EQUIPMENT / OFFLOADING
              </div>
              <h1 className="road-sequence-title" id="home-heading">
                <span className="road-sequence-line">
                  <span>TOWING &amp;</span>
                </span>{" "}
                <span className="road-sequence-line">
                  <span>
                    RECOVERY<span className="road-sequence-period">.</span>
                  </span>
                </span>
              </h1>
              <div className="road-sequence-intro">
                <p>
                  Towing for cars, SUVs, and pickups, plus heavy-duty
                  recovery for buses, semi trucks, and commercial fleets, and
                  heavy equipment transport and offloading in Prince George, BC. Tell us what needs
                  moving. We’ll plan the right response.
                </p>
                <div className="hero-actions">
                  <ActionButton
                    href={business.phoneHref}
                    className="button-orange hero-cta"
                    icon="phone"
                  >
                    Call for a tow
                  </ActionButton>
                  <a className="hero-phone" href={business.phoneHref}>
                    <span className="hero-phone-label">DISPATCH, 24/7</span>
                    <span className="hero-phone-number">{business.phone}</span>
                  </a>
                </div>
              </div>
            </RoadSequence>

            <Experience onService={setService} />
          </>
        )}
      </main>
      <SiteFooter homePrefix={homePrefix} />
      <div className="mobile-help new-mobile-help">
        <span>
          <span className="status-dot" /> NEED A HAND?
        </span>
        <a href={business.phoneHref}>
          Call {business.phone} <Icon name="phone" />
        </a>
      </div>
      {service && modal && (
        <Modal
          onClose={() => setService(null)}
          titleId="service-title"
          className="service-modal"
        >
          <div className="eyebrow">
            / {service.number} — THE RIGHT HELP FOR YOUR ROAD
          </div>
          <img
            className="modal-service-photo"
            src={modal.image ?? serviceVisuals[service.id].src}
            alt={modal.alt ?? serviceVisuals[service.id].alt}
            width="1536"
            height="1024"
          />
          <h2 id="service-title">{modal.title}</h2>
          <p className="modal-lead">{modal.description}</p>
          <div className="modal-tags">
            {modal.tags.map((tag) => (
              <span key={tag}>
                <Icon name="check" />
                {tag}
              </span>
            ))}
          </div>
          {modal.detail && <p className="service-detail">{modal.detail}</p>}
          <ActionButton
            className="button-blue"
            href={business.phoneHref}
            icon="phone"
          >
            {modal.action || "Get help with this"}
          </ActionButton>
          {service.modal ? (
            <a className="service-modal-page-link" href="/services/">
              Explore our services <Icon name="arrow" />
            </a>
          ) : (
            <a className="service-modal-page-link" href={`/services/${service.id}/`}>
              Explore {service.title} <Icon name="arrow" />
            </a>
          )}
        </Modal>
      )}
    </div>
  );
}
