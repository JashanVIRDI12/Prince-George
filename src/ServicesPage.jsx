import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { serviceFaqs, business } from "./data";
import { serviceDetails } from "./serviceContent";
import { Icon } from "./icons";
import { RecoveryWalkthrough } from "./ServiceMotion";
import "./services-page.css";
import "./services-motion.css";
import "./services-redesign.css";

gsap.registerPlugin(ScrollTrigger);

const situations = [
  {
    label: "My vehicle won’t start",
    service: "roadside",
    title: "Start with roadside assistance.",
    description:
      "Tell us what happened and where you are. We’ll help you understand the issue and determine whether a roadside solution or towing support is the right next step.",
    action: "Get roadside help",
  },
  {
    label: "Flat tire, lockout, or fuel",
    service: "roadside",
    title: "Help at roadside.",
    description:
      "Tell us what happened, your location, and your vehicle details. Whether it’s a flat tire, locked keys, or running low on fuel, we’ll help determine the right roadside support for your situation.",
    action: "Get roadside help",
  },
  {
    label: "I need a vehicle moved",
    service: "towing",
    title: "Arrange a tow or recovery.",
    description:
      "Share your pickup location, destination, and vehicle condition. We’ll help determine the right equipment and towing solution to safely move your vehicle.",
    action: "Get towing help",
  },
  {
    label: "It’s a truck, RV, or equipment",
    service: "heavy",
    title: "Plan a heavy-duty move.",
    description:
      "Larger vehicles and equipment require the right approach. Share your vehicle details, approximate size, and destination, and we’ll help confirm the right equipment and transport solution.",
    action: "Arrange heavy-duty help",
  },
];

function ServiceAction({ children, onClick, className = "", href }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      className={`svc-button ${className}`}
      href={href}
      onClick={(event) => {
        event.currentTarget.focus({ preventScroll: true });
        onClick?.();
      }}
    >
      <span>{children}</span>
      <Icon name="arrow" />
    </Tag>
  );
}

function ServiceFinder({ onHelp }) {
  const [selected, setSelected] = useState(0);
  const root = useRef(null);
  const initialized = useRef(false);
  const situation = situations[selected];
  const service = serviceDetails.find((item) => item.id === situation.service);
  useLayoutEffect(() => {
    const photo = root.current.querySelector(".svc-finder-photo img");
    const copy = root.current.querySelector(".svc-recommendation-copy");
    const targets = [photo, copy];
    if (
      initialized.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.fromTo(
        photo,
        { scale: 1.06, clipPath: "inset(0% 100% 0% 0%)" },
        {
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.65,
          ease: "power3.inOut",
        },
      );
      gsap.fromTo(
        copy,
        { y: 10, opacity: 0.25 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    } else {
      gsap.set(photo, { scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(copy, { y: 0, opacity: 1 });
    }
    initialized.current = true;
    return () => gsap.killTweensOf(targets);
  }, [selected]);
  const chooseWithKeyboard = (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? situations.length - 1
          : (selected +
              (event.key === "ArrowDown" ? 1 : -1) +
              situations.length) %
            situations.length;
    setSelected(next);
    document.getElementById(`situation-${next}`)?.focus();
  };
  return (
    <section
      className="svc-finder"
      ref={root}
      id="service-finder"
      aria-labelledby="finder-title"
    >
      <div className="svc-section-intro">
        <div>
          <span className="svc-eyebrow">FIND THE RIGHT SERVICE</span>
          <h2 id="finder-title">
            What’s happening
            <br />
            with your vehicle?
          </h2>
        </div>
        <p>
          You don’t need to know the technical details.
          <br /> Start with the situation that sounds like yours.
        </p>
      </div>
      <div className="svc-finder-layout">
        <div
          className="svc-situations"
          role="tablist"
          aria-label="Choose your vehicle situation"
          aria-orientation="vertical"
        >
          <span className="svc-finder-prompt">
            SELECT YOUR SITUATION <Icon name="down" />
          </span>
          {situations.map((item, index) => (
            <button
              key={item.label}
              id={`situation-${index}`}
              role="tab"
              aria-selected={selected === index}
              aria-controls="service-recommendation"
              aria-label={item.label}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={chooseWithKeyboard}
            >
              <span className="svc-situation-number" aria-hidden="true">
                0{index + 1}
              </span>
              <span>{item.label}</span>
              <Icon name="right" />
            </button>
          ))}
        </div>
        <div
          className="svc-recommendation"
          id="service-recommendation"
          role="tabpanel"
          aria-labelledby={`situation-${selected}`}
          tabIndex={0}
          data-service={service.id}
        >
          <div className="svc-finder-photo">
            <img
              src={service.image}
              alt={service.alt}
              width="1536"
              height="1024"
              loading="lazy"
            />
            <span className="svc-finder-photo-label">
              A GOOD PLACE TO START <Icon name="arrow" />
            </span>
          </div>
          <div className="svc-recommendation-copy">
            <span className="svc-match-label">
              <Icon name="check" />
              {service.title}
            </span>
            <h3>{situation.title}</h3>
            <p>{situation.description}</p>
            <div className="svc-match-actions">
              <ServiceAction onClick={() => onHelp(service.id)}>
                {situation.action}
              </ServiceAction>
              <a href={service.path} className="svc-text-link">
                See service details <Icon name="right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage({ onHelp }) {
  const root = useRef(null);
  const [activeSection, setActiveSection] = useState("towing");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      serviceDetails.forEach((service) => {
        ScrollTrigger.create({
          trigger: `#${service.id}`,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveSection(service.id),
          onEnterBack: () => setActiveSection(service.id),
        });
      });
    }, root);
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(".svc-hero-copy > :not(.svc-breadcrumbs)", {
          y: 18,
          opacity: 0,
          stagger: 0.07,
          duration: 0.65,
          ease: "power2.out",
        });
        gsap.utils.toArray(".svc-reveal").forEach((element) =>
          gsap.from(element, {
            y: 22,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 90%", once: true },
          }),
        );
        gsap.fromTo(
          ".svc-hero-photo > img",
          { scale: 1.05 },
          {
            scale: 1.17,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: ".svc-hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
        gsap.from(".svc-hero-photo", {
          clipPath: "inset(0% 0% 0% 100%)",
          duration: 1.15,
          ease: "power3.inOut",
        });
        gsap.from(".recovery-road-scene", {
          opacity: 0,
          y: 25,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".recovery-road-scene",
            start: "top 85%",
            once: true,
          },
        });
        const cleanups = gsap.utils.toArray("details").map((detail) => {
          const summary = detail.querySelector("summary");
          let expanded = detail.open;
          const toggle = (event) => {
            event.preventDefault();
            expanded = !expanded;
            const start = detail.getBoundingClientRect().height;
            gsap.killTweensOf(detail);
            detail.style.height = "auto";
            detail.open = expanded;
            const end = detail.getBoundingClientRect().height;
            detail.open = true;
            gsap.fromTo(
              detail,
              { height: start, overflow: "hidden" },
              {
                height: end,
                duration: 0.35,
                ease: "power2.inOut",
                onComplete: () => {
                  detail.open = expanded;
                  gsap.set(detail, { clearProps: "height,overflow" });
                },
              },
            );
          };
          summary.addEventListener("click", toggle);
          return () => {
            summary.removeEventListener("click", toggle);
            gsap.killTweensOf(detail);
            detail.open = expanded;
            gsap.set(detail, { clearProps: "height,overflow" });
          };
        });
        return () => cleanups.forEach((cleanup) => cleanup());
      },
      root,
    );
    // Refresh after details settle, without interrupting an anchor's scroll.
    let refreshTimer;
    const refreshAfterDetails = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        if (ScrollTrigger.isScrolling()) refreshAfterDetails();
        else ScrollTrigger.refresh();
      }, 400);
    };
    const pageRoot = root.current;
    pageRoot.addEventListener("toggle", refreshAfterDetails, true);
    return () => {
      pageRoot.removeEventListener("toggle", refreshAfterDetails, true);
      clearTimeout(refreshTimer);
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <div className="services-page" ref={root}>
      <section className="svc-hero" id="home" aria-labelledby="services-title">
        <div className="svc-hero-copy">
          <nav className="svc-breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <Icon name="right" />
            <span aria-current="page">Services</span>
          </nav>
          <span className="svc-eyebrow">
            <span /> PRINCE GEORGE TOWING
          </span>
          <h1 id="services-title">
            Towing &<br />
            <span>roadside solutions.</span>
          </h1>
          <p>
            Professional towing, roadside assistance, and vehicle transport
            services across Prince George and surrounding areas.
          </p>
          <div className="svc-hero-actions">
            <ServiceAction
              className="svc-button-orange"
              onClick={() => onHelp()}
            >
              Get help now
            </ServiceAction>
            <a href="#our-services" className="svc-hero-secondary">
              Explore our services <Icon name="down" />
            </a>
          </div>
          <div className="svc-hero-note">
            <Icon name="pin" />
            <span>Prince George & surrounding highways</span>
          </div>
        </div>
        <div className="svc-hero-photo">
          <img
            src="/images/services-roadside-hero.webp"
            alt="A blue flatbed tow truck loading a passenger vehicle at a northern British Columbia roadside turnout"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <div className="svc-photo-caption">
            <span>LOCAL ROADS. PRACTICAL HELP.</span>
            <span>PG / BC</span>
          </div>
        </div>
      </section>

      <section className="svc-index" id="our-services" aria-labelledby="svc-index-title">
        <div className="svc-index-heading svc-reveal">
          <div>
            <span className="svc-eyebrow">01 / CHOOSE YOUR RESPONSE</span>
            <h2 id="svc-index-title">
              The right help for <em>every situation.</em>
            </h2>
          </div>
          <p>
            Different situations need different solutions. Choose the service
            that matches your vehicle, location, and the support you need.
          </p>
        </div>
        <div className="svc-index-grid">
          {serviceDetails.map((service) => (
            <a className="svc-index-card svc-reveal" href={service.path} key={service.id}>
              <span className="svc-index-photo">
                <img src={service.image} alt="" width="1536" height="1024" loading="lazy" />
                <span className="svc-index-number" aria-hidden="true">{service.number}</span>
              </span>
              <span className="svc-index-card-body">
                <span className="svc-index-category">{service.category}</span>
                <strong>{service.title}</strong>
                <span className="svc-index-copy">{service.indexCopy}</span>
                <Icon name="arrow" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <nav className="svc-jump-nav" aria-label="Service categories">
        <span className="svc-jump-label">OUR SERVICES</span>
        {serviceDetails.map((service) => (
          <a
            key={service.id}
            href={`#${service.id}`}
            aria-current={activeSection === service.id ? "location" : undefined}
          >
            <span>{service.number}</span>
            {service.title}
            <Icon name="down" />
          </a>
        ))}
      </nav>

      <div className="svc-detail-list">
        <div className="svc-service-chapters">
          {serviceDetails.map((service, index) => (
            <section
              className={`svc-detail svc-detail-${service.id}`}
              id={service.id}
              key={service.id}
              aria-labelledby={`svc-title-${service.id}`}
            >
              <div className="svc-detail-photo svc-reveal">
                <img
                  src={service.image}
                  alt={service.alt}
                  width="1536"
                  height="1024"
                  loading="lazy"
                />
                <div className="svc-photo-caption">
                  <span>{service.imageLabel}</span>
                  <span>0{index + 1}</span>
                </div>
                <span className="svc-detail-photo-number" aria-hidden="true">{service.number}</span>
              </div>
              <div className="svc-detail-copy svc-reveal">
                <span className="svc-eyebrow">
                  <span className="svc-section-number">{service.number}</span>
                  {service.category}
                </span>
                <h2 id={`svc-title-${service.id}`}>{service.title}</h2>
                <p className="svc-detail-description">{service.description}</p>
                <div className="svc-capabilities">
                  {service.features.map(([title, text], featureIndex) => (
                    <details key={title}>
                      <summary>
                        <span className="svc-capability-index">
                          0{featureIndex + 1}
                        </span>
                        <span>{title}</span>
                        <Icon name="plus" />
                      </summary>
                      <p>{text}</p>
                    </details>
                  ))}
                </div>
                <details className="svc-preparation">
                  <summary>
                    What to have ready <Icon name="plus" />
                  </summary>
                  <p>{service.prepare}</p>
                </details>
                <div className="svc-detail-actions">
                  <ServiceAction onClick={() => onHelp(service.id)}>
                    {service.action}
                  </ServiceAction>
                  <a href={service.path} className="svc-text-link svc-detail-more">Explore {service.title} <Icon name="arrow" /></a>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <RecoveryWalkthrough onHelp={onHelp} />

      <ServiceFinder onHelp={onHelp} />

      <section
        className="svc-questions"
        id="service-questions"
        aria-labelledby="svc-questions-title"
      >
        <div className="svc-questions-heading">
          <span className="svc-eyebrow">BEFORE YOU BOOK</span>
          <h2 id="svc-questions-title">
            A few things
            <br />
            you might ask.
          </h2>
          <p>
            Need help with a different question?
            <br />
            Tell us about your situation.
          </p>
          <button
            className="svc-text-link"
            onClick={(event) => {
              event.currentTarget.focus();
              onHelp();
            }}
          >
            Talk it through <Icon name="right" />
          </button>
        </div>
        <div className="svc-faq-list">
          {serviceFaqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Icon name="plus" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="svc-contact" aria-labelledby="svc-contact-title">
        <div className="svc-contact-main">
          <span className="svc-eyebrow">LET’S GET YOU MOVING</span>
          <h2 id="svc-contact-title">
            Need a hand?
            <br />
            We’re ready to talk.
          </h2>
          <p>
            Have your location and vehicle details ready. We’ll work out the
            next step together.
          </p>
          <div className="svc-contact-actions">
            <ServiceAction onClick={() => onHelp()} className="svc-button-dark">
              Get help with your vehicle
            </ServiceAction>
            {business.phone ? (
              <a className="svc-text-link" href={business.phoneHref}>
                <Icon name="phone" />
                {business.phone}
              </a>
            ) : (
              <a className="svc-text-link" href="/#coverage">
                Check our service areas <Icon name="right" />
              </a>
            )}
          </div>
        </div>
        <div className="svc-contact-photo">
          <img src="/images/northern-road-recovery.webp" alt="Blue flatbed tow truck on a northern British Columbia highway" width="1536" height="1024" loading="lazy" />
          <span>READY WHEN THE ROAD CHANGES / PG, BC</span>
        </div>
      </section>
    </div>
  );
}
