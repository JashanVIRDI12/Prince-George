import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { business, services } from "./data";
import Experience, { SiteFooter, serviceVisuals } from "./Experience";
import { Brand, Icon } from "./icons";
import ServicesPage from "./ServicesPage";
import ServiceDetailPage from "./ServiceDetailPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
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

function RequestModal({ onClose, initialService = "towing" }) {
  const [form, setForm] = useState({
    service: initialService,
    location: "",
    vehicle: "",
    destination: "",
    name: "",
    phone: "",
  });
  const [step, setStep] = useState(1);
  const [geoState, setGeoState] = useState("");
  const [copyState, setCopyState] = useState("");
  const summaryRef = useRef(null);
  const update = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const serviceName = services.find((s) => s.id === form.service)?.title;
  const summary = `PRINCE GEORGE TOWING — SERVICE REQUEST\nService: ${serviceName}\nLocation: ${form.location}\nVehicle: ${form.vehicle}\nDestination: ${form.destination || "To be discussed"}\nName: ${form.name}\nPhone: ${form.phone}`;
  useEffect(() => {
    if (step === 2) summaryRef.current?.focus();
  }, [step]);
  const locate = () => {
    if (!navigator.geolocation) {
      setGeoState(
        "Location isn’t available here. Please enter your nearest address or landmark.",
      );
      return;
    }
    setGeoState("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((f) => ({
          ...f,
          location: `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`,
        }));
        setGeoState("Location added. Include a nearby landmark if you can.");
      },
      () =>
        setGeoState(
          "Couldn’t access your location. Please enter an address or nearby landmark.",
        ),
      { timeout: 10000, enableHighAccuracy: true },
    );
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyState("Details copied");
    } catch {
      setCopyState(
        "Copy isn’t available in this browser. Use “Save details” instead.",
      );
    }
  };
  const save = () => {
    const url = URL.createObjectURL(
      new Blob([summary], { type: "text/plain" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "prince-george-towing-request.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Modal onClose={onClose} titleId="request-title" className="request-modal">
      <span className="eyebrow">
        <span className="status-dot" /> LET’S GET YOU MOVING
      </span>
      <h2 id="request-title">
        {step === 1 ? (
          <>
            Let’s make
            <br />
            your next move.
          </>
        ) : (
          <>
            Your next step,
            <br />
            ready.
          </>
        )}
      </h2>
      {step === 1 ? (
        <>
          <p className="modal-lead">
            Tell us what’s happening. We’ll put your details together so you’re
            ready to arrange help.
          </p>
          {business.phone && (
            <a className="dispatch-call" href={business.phoneHref}>
              <Icon name="phone" /> Need help now? Call {business.phone}
            </a>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
          >
            <fieldset className="service-choices">
              <legend>What can we help with?</legend>
              {services.map((s) => (
                <label
                  key={s.id}
                  className={form.service === s.id ? "selected" : ""}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={form.service === s.id}
                    onChange={update}
                  />
                  <span>{s.title}</span>
                  <Icon name={form.service === s.id ? "check" : "plus"} />
                </label>
              ))}
            </fieldset>
            <div className="location-label">
              <label htmlFor="request-location">
                Your location <span>*</span>
              </label>
              <button
                type="button"
                onClick={locate}
                disabled={geoState === "Finding your location…"}
              >
                <Icon name="locate" /> Use my location
              </button>
            </div>
            <input
              id="request-location"
              name="location"
              placeholder="Street, highway marker, or nearest landmark"
              value={form.location}
              onChange={update}
              required
              autoComplete="street-address"
              maxLength={200}
            />
            {geoState && (
              <p className="field-message" role="status">
                {geoState}
              </p>
            )}
            <div className="form-grid">
              <label>
                Vehicle <span>*</span>
                <input
                  name="vehicle"
                  placeholder="e.g. 2020 Toyota RAV4"
                  value={form.vehicle}
                  onChange={update}
                  required
                  maxLength={100}
                />
              </label>
              <label>
                Destination <span className="optional">(optional)</span>
                <input
                  name="destination"
                  placeholder="Where do you need to go?"
                  value={form.destination}
                  onChange={update}
                  maxLength={200}
                />
              </label>
              <label>
                Your name <span>*</span>
                <input
                  name="name"
                  placeholder="First name"
                  value={form.name}
                  onChange={update}
                  autoComplete="given-name"
                  required
                  maxLength={80}
                />
              </label>
              <label>
                Phone number <span>*</span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Your callback number"
                  value={form.phone}
                  onChange={update}
                  autoComplete="tel"
                  required
                  pattern={String.raw`[+0-9 .\(\)\-]{7,25}`}
                  title="Enter a phone number with at least 7 characters"
                  maxLength={25}
                />
              </label>
            </div>
            <ActionButton type="submit" className="button-blue">
              Prepare my request
            </ActionButton>
            <p className="form-note">
              Your details stay in this browser until you choose to share them.
              Preparing a request does not dispatch a truck.
            </p>
          </form>
        </>
      ) : (
        <div ref={summaryRef} tabIndex={-1} className="request-summary">
          <p className="modal-lead">
            Your details are ready. Contact dispatch to confirm your service,
            availability, and price.
          </p>
          <dl>
            <div>
              <dt>Service</dt>
              <dd>{serviceName}</dd>
            </div>
            <div>
              <dt>Pickup</dt>
              <dd>{form.location}</dd>
            </div>
            <div>
              <dt>Vehicle</dt>
              <dd>{form.vehicle}</dd>
            </div>
            <div>
              <dt>Destination</dt>
              <dd>{form.destination || "To be discussed"}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                {form.name} · {form.phone}
              </dd>
            </div>
          </dl>
          {business.phone ? (
            <ActionButton
              href={business.phoneHref}
              className="button-blue"
              icon="phone"
            >
              Call {business.phone}
            </ActionButton>
          ) : (
            <p className="preview-notice">
              This is a website preview. Dispatch is not connected and your
              request has not been sent.
            </p>
          )}
          <div className="summary-actions">
            <button onClick={copy}>
              <Icon name="copy" /> Copy details
            </button>
            <button onClick={save}>
              <Icon name="down" /> Save details
            </button>
          </div>
          <p role="status" className="field-message">
            {copyState}
          </p>
          <button className="text-button" onClick={() => setStep(1)}>
            ← Edit my details
          </button>
        </div>
      )}
      <div className="emergency-note">
        <Icon name="shield" />
        <span>
          In immediate danger or a medical emergency? Call{" "}
          <a href="tel:911">911</a>.
        </span>
      </div>
    </Modal>
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
  const [request, setRequest] = useState(null);
  const [service, setService] = useState(null);
  const help = (type = "towing") => {
    setMenuOpen(false);
    setService(null);
    setRequest(type);
  };
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
        if (isHomePage) {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.from(".hero-eyebrow", { y: 16, opacity: 0, duration: 0.7 }, 0.1)
            .from(
              ".hero-title-line span",
              { yPercent: 110, rotate: 3, duration: 1.1, stagger: 0.13 },
              0.15,
            )
            .from(".hero-visual", { x: 90, opacity: 0, duration: 1.5 }, 0.35)
            .from(
              ".hero-bottom-content",
              { y: 20, opacity: 0, duration: 0.8 },
              0.7,
            )
            .from(
              ".hero-stamp",
              { scale: 0.7, rotation: -40, opacity: 0, duration: 1 },
              0.6,
            );
          gsap.to(".hero-visual-inner", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
          gsap.to(".hero-stamp svg", {
            rotation: 100,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
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
    const alignHash = (event) => {
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
              behavior:
                event?.type === "hashchange" &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "smooth"
                  : "instant",
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
                    <span className="services-dropdown-photo"><img src={item.image} alt="" width="1536" height="1024" /></span>
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
            onClick={() => help()}
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
            onClick={() => help()}
            className="button-orange"
            icon="phone"
          >
            Get roadside help
          </ActionButton>
        </nav>
      )}
      <main id="main">
        {isContactPage ? (
          <ContactPage onHelp={help} />
        ) : isAboutPage ? (
          <AboutPage onHelp={help} />
        ) : detailId ? (
          <ServiceDetailPage id={detailId} onHelp={help} />
        ) : isServicesPage ? (
          <ServicesPage onHelp={help} />
        ) : (
          <>
            <section className="hero" id="home">
              <div className="hero-text">
                <div className="eyebrow hero-eyebrow">
                  <span className="status-dot" /> PRINCE GEORGE, BC & THE ROADS
                  BEYOND
                </div>
                <h1 className="hero-title">
                  <span className="hero-title-line">
                    <span>BAD DAY?</span>
                  </span>
                  <span className="hero-title-line">
                    <span>GOOD</span>
                  </span>
                  <span className="hero-title-line">
                    <span>
                      BACKUP<span className="title-period">.</span>
                    </span>
                  </span>
                </h1>
                <div className="hero-bottom-content">
                  <p>
                    Wrong turn. Flat tire. Life happens.
                    <br />
                    We’ll get you back where you belong.
                  </p>
                  <ActionButton
                    onClick={() => help()}
                    className="button-blue hero-cta"
                    icon="arrow"
                  >
                    Let’s get you moving
                  </ActionButton>
                  <div className="hero-small-note">
                    <Icon name="clock" />
                    <span>AROUND THE CLOCK. AROUND THE CORNER.</span>
                  </div>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-visual-inner">
                  <img
                    src="/images/hero-tow-truck.webp"
                    alt="Cobalt blue recovery truck against a vivid orange landscape"
                    fetchPriority="high"
                    width="1536"
                    height="1024"
                  />
                </div>
              </div>
              <div className="hero-outline-text" aria-hidden="true">
                24/7
              </div>
              <div
                className="hero-stamp"
                role="img"
                aria-label="Northern roads. Local heroes."
              >
                <svg viewBox="0 0 150 150" aria-hidden="true">
                  <defs>
                    <path
                      id="stamp-circle"
                      d="M75,75m-56,0a56,56 0 1,1 112,0a56,56 0 1,1 -112,0"
                    />
                  </defs>
                  <circle cx="75" cy="75" r="73" />
                  <circle cx="75" cy="75" r="42" />
                  <text>
                    <textPath href="#stamp-circle" textLength="347">
                      NORTHERN ROADS. LOCAL HEROES. ✦{" "}
                    </textPath>
                  </text>
                </svg>
                <Icon name="arrow" />
              </div>
              <div className="hero-coordinates">
                <span>53°55′ N</span>
                <span>122°45′ W</span>
                <span className="coordinate-line" />
                <span>READY WHEN YOU NEED US.</span>
              </div>
              <a href="#services" className="hero-scroll">
                <span>THERE’S A WAY FORWARD</span>
                <span className="scroll-circle">
                  <Icon name="down" />
                </span>
              </a>
            </section>

            <Experience onHelp={help} onService={setService} />
          </>
        )}
      </main>
      <SiteFooter onHelp={help} homePrefix={homePrefix} />
      <div className="mobile-help new-mobile-help">
        <span>
          <span className="status-dot" /> NEED A HAND?
        </span>
        <button onClick={() => help()}>
          Get help now <Icon name="arrow" />
        </button>
      </div>
      {service && (
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
            src={serviceVisuals[service.id].src}
            alt={serviceVisuals[service.id].alt}
            width="1536"
            height="1024"
          />
          <h2 id="service-title">{service.title}</h2>
          <p className="modal-lead">{service.description}</p>
          <div className="modal-tags">
            {service.tags.map((tag) => (
              <span key={tag}>
                <Icon name="check" />
                {tag}
              </span>
            ))}
          </div>
          <p className="service-detail">{service.detail}</p>
          <ActionButton
            className="button-blue"
            onClick={() => help(service.id)}
          >
            Get help with this
          </ActionButton>
          <a className="service-modal-page-link" href={`/services/${service.id}/`}>
            Explore {service.title} <Icon name="arrow" />
          </a>
        </Modal>
      )}
      {request && (
        <RequestModal
          initialService={request}
          onClose={() => setRequest(null)}
        />
      )}
    </div>
  );
}
