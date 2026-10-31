import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services, areas, faqs, business } from "./data";
import { additionalServices } from "./additionalServices";
import { Icon } from "./icons";
import CoverageMap from "./CoverageMap";

gsap.registerPlugin(ScrollTrigger);

export const serviceVisuals = {
  towing: {
    src: "/images/fleet-heavy-equipment.webp",
    alt: "Prince George Towing’s heavy recovery truck and rear lifting equipment",
    title: (
      <>
        Reliable recovery.
        <br />
        <em>Safe transport.</em>
      </>
    ),
    category: "CARS / SUVS / PICKUPS / VANS",
  },
  roadside: {
    src: "/images/fleet-roadside.webp",
    alt: "A roadside technician beside Prince George Towing’s white and burgundy recovery truck",
    title: (
      <>
        Small problem.
        <br />
        <em>Quick solution.</em>
      </>
    ),
    category: "ASSISTANCE / REPAIR",
    note: "OUR RECOVERY TRUCK",
  },
  heavy: {
    src: "/images/fleet-coach.webp",
    alt: "Prince George Towing’s white and burgundy recovery truck towing a passenger coach",
    title: (
      <>
        Big vehicles.
        <br />
        <em>The right recovery.</em>
      </>
    ),
    category: "BUSES / TRUCKS / EQUIPMENT",
    note: "BUS & COACH TOWING",
  },
  ...Object.fromEntries(additionalServices.map((service) => [service.id, {
    src: service.image,
    alt: service.alt,
    title: <>{service.imageHeading[0]}<br /><em>{service.imageHeading[1]}</em></>,
    category: service.category,
    note: service.imageLabel,
  }])),
};

function Chapter({ number, children, light = false }) {
  return (
    <div className={`chapter-label ${light ? "on-dark" : ""}`}>
      <span className="chapter-number">{number}</span>
      <span>{children}</span>
    </div>
  );
}

function EditorialLink({ children, onClick, href, className = "" }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={(e) => {
        e.currentTarget.focus({ preventScroll: true });
        onClick?.(e);
      }}
      className={`editorial-link ${className}`}
    >
      <span>{children}</span>
      <Icon name="arrow" />
    </Tag>
  );
}

function CompanyIntro({ onService }) {
  return (
    <section
      className="company-intro"
      id="about"
      aria-labelledby="company-heading"
    >
      <div className="company-photo exp-reveal">
        <img
          src="/images/fleet-highway.webp"
          srcSet="/images/fleet-highway-960.webp 960w, /images/fleet-highway-1280.webp 1280w, /images/fleet-highway.webp 1536w"
          sizes="(max-width: 900px) 100vw, 50vw"
          alt="Prince George Towing’s white and burgundy heavy recovery truck on a forested highway"
          width="1536"
          height="1024"
          loading="lazy"
        />
        <div className="company-photo-caption">
          <Icon name="pin" />
          <span>PRINCE GEORGE, BC</span>
        </div>
      </div>
      <div className="company-copy">
        <Chapter number="01">YOUR LOCAL TOWING COMPANY</Chapter>
        <h2 className="company-heading exp-reveal" id="company-heading">
          Every vehicle.
          <br />
          <span>Local towing support.</span>
        </h2>
        <p className="company-lead">
          Whether it’s a car that won’t start or a semi truck stopped on the
          highway, every tow needs equipment built for the job. Prince George Towing
          helps drivers and fleet operators in Prince George and the
          surrounding area get the right tow.
        </p>
        <p className="company-body">
          Call with your location, vehicle, and what happened. From car and
          pickup towing to bus, truck, and equipment recovery, we’ll discuss
          access, the destination, and cost before work begins.
        </p>
        <ul className="company-promises">
          <li>
            <Icon name="check" />
            <span>Towing for cars, SUVs, pickups, and vans</span>
          </li>
          <li>
            <Icon name="check" />
            <span>Heavy-duty towing for buses, semi trucks, and commercial fleets</span>
          </li>
          <li>
            <Icon name="check" />
            <span>Clear discussion of the service and cost before the job</span>
          </li>
          <li>
            <Icon name="check" />
            <span>Equipment transport to your repair facility, depot, or yard</span>
          </li>
        </ul>
        <div className="company-actions">
          <EditorialLink className="company-button" href={business.phoneHref}>
            Get towing help
          </EditorialLink>
          <a className="company-secondary" href="/services/">
            View our services <Icon name="right" />
          </a>
          <a className="company-secondary" href="/about/">
            About us <Icon name="right" />
          </a>
        </div>
      </div>
      <div className="company-service-strip">
        {[
          { id: "towing", icon: "shield", title: "Car towing" },
          { id: "heavy", icon: "heavy", title: "Heavy-duty towing" },
          {
            id: "equipment",
            icon: "truck",
            title: "Heavy equipment",
          },
          { id: "offloading", icon: "heavy", title: "Offloading services" },
        ].map((item) => (
          <button
            key={item.title}
            onClick={(event) => {
              event.currentTarget.focus();
              const service = services.find((entry) => entry.id === item.id);
              onService(item.modal ? { ...service, modal: item.modal } : service);
            }}
          >
            <Icon name={item.icon} />
            <span>{item.title}</span>
            <Icon name="right" />
          </button>
        ))}
      </div>
    </section>
  );
}

function ServiceShowcase({ onService }) {
  const [active, setActive] = useState(0);
  const media = useRef(null);
  const chosen = services[active];
  const visual = serviceVisuals[chosen.id];
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        media.current,
        { opacity: 0.3, scale: 1.035 },
        { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" },
      );
    });
    return () => mm.revert();
  }, [active]);
  const chooseWithKeyboard = (e) => {
    if (
      ![
        "ArrowDown",
        "ArrowUp",
        "ArrowRight",
        "ArrowLeft",
        "Home",
        "End",
      ].includes(e.key)
    )
      return;
    e.preventDefault();
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? services.length - 1
          : (active +
              (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1) +
              services.length) %
            services.length;
    setActive(next);
    document.getElementById(`service-tab-${services[next].id}`)?.focus();
  };
  return (
    <section className="service-lab" id="services">
      <div className="lab-heading">
        <div>
          <Chapter number="02" light>
            THE RIGHT KIND OF HELP
          </Chapter>
          <h2 className="editorial-heading exp-reveal">
            Cars. Heavy duty.
            <br />
            Equipment &amp; offloading.
          </h2>
        </div>
        <p>
          Cars, buses, semi trucks, heavy equipment, and offloading.
          <br />
          Find the right towing, recovery, or roadside support.
        </p>
      </div>
      <div className="lab-layout">
        <div className="service-rail">
          <div
            className="service-tabs"
            role="tablist"
            aria-label="Choose a recovery service"
            aria-orientation="vertical"
          >
            {services.map((service, i) => (
              <button
                key={service.id}
                id={`service-tab-${service.id}`}
                role="tab"
                aria-selected={active === i}
                aria-controls="service-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={chooseWithKeyboard}
              >
                <span className="rail-number">0{i + 1}</span>
                <span className="rail-name">
                  {service.title}
                  <span>{serviceVisuals[service.id].category}</span>
                </span>
                <Icon name="arrow" />
              </button>
            ))}
          </div>
          <div className="rail-bottom">
            <span className="rail-mini-mark" aria-hidden="true">
              <Icon name="phone" />
            </span>
            <p>
              Not sure what you need?
              <br />
              That’s what we’re here for.
            </p>
            <EditorialLink href={business.phoneHref}>
              Talk it through
            </EditorialLink>
          </div>
        </div>
        <div
          className="service-stage"
          id="service-panel"
          role="tabpanel"
          aria-labelledby={`service-tab-${chosen.id}`}
          tabIndex={0}
        >
          <div className="service-film">
            <img
              ref={media}
              key={chosen.id}
              src={visual.src}
              alt={visual.alt}
              width="1536"
              height="1024"
              loading="lazy"
            />
            <div className="film-top">
              <span>PG / FIELD OPERATIONS</span>
              <span>{chosen.number} — {String(services.length).padStart(2, "0")}</span>
            </div>
            <div className="film-bottom">
              <h3>{visual.title}</h3>
              <button
                className="film-explore"
                aria-label={`Explore ${chosen.title}`}
                onClick={(e) => {
                  e.currentTarget.focus();
                  onService(chosen);
                }}
              >
                <Icon name="arrow" />
              </button>
            </div>
          </div>
          <div className="service-caption">
            {visual.note && <span className="console-label">{visual.note}</span>}
            <p>{chosen.description}</p>
            <ul>
              {chosen.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <EditorialLink href="/services/" className="lab-page-link">
        View all services
      </EditorialLink>
      <div className="lab-footnote">
        <span>FROM THE FIRST CALL TO THE LAST KILOMETRE.</span>
        <span className="lab-line" />
        <span>WE’RE WITH YOU.</span>
      </div>
    </section>
  );
}

const serviceSteps = [
  {
    title: "Tell us what happened",
    short: "Share your location and vehicle details.",
    icon: "phone",
    heading: "Tell us what happened",
    text: "Start by sharing your location, vehicle details, and what went wrong. The more we know, the better we can understand the situation and send the right help.",
    checklist: [
      "Your location and callback number",
      "Vehicle make, model, and condition (and weight or load for heavy vehicles)",
      "What happened and where you need to go",
    ],
    note: "Not sure what service you need? Just explain the situation, and we’ll help guide you through the next step.",
    action: "Call us now",
  },
  {
    title: "Confirm the plan",
    short: "Understand the service, cost, and next step.",
    icon: "check",
    heading: "Know what to expect before we start",
    text: "We’ll confirm the right service, equipment, and estimated cost based on your situation. You’ll know the plan before we begin, with clear communication throughout the process.",
    checklist: [
      "The service and equipment your vehicle requires",
      "Pricing and any additional details before starting",
      "Pickup location and destination details",
    ],
    note: "Every situation is different. We’ll help determine the right approach based on your vehicle, location, and the support you need.",
    action: "Discuss your situation",
  },
  {
    title: "Get moving again",
    short: "Roadside help or transport to your destination.",
    icon: "right",
    heading: "The right solution for your vehicle",
    text: "Once we understand your situation, we’ll provide the support your vehicle needs. Whether it can be resolved roadside or requires transportation, we’ll help get you to the next destination safely.",
    checklist: [
      "Roadside assistance where possible",
      "Safe vehicle recovery and loading",
      "Transport to your chosen destination",
    ],
    note: "Have specific access requirements or vehicle concerns? Let us know before pickup so we can prepare the right approach.",
    action: "Get help with your vehicle",
  },
];

function ServiceProcess() {
  const [active, setActive] = useState(0);
  const step = serviceSteps[active];
  const panel = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        panel.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    });
    return () => mm.revert();
  }, [active]);
  const keydown = (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 2
          : (active + (event.key === "ArrowRight" ? 1 : -1) + 3) % 3;
    setActive(next);
    document.getElementById(`process-tab-${next}`)?.focus();
  };
  return (
    <section
      className="service-process"
      id="how-it-works"
      aria-labelledby="process-heading"
    >
      <div className="practical-section-heading">
        <div>
          <Chapter number="03">HOW IT WORKS</Chapter>
          <h2 className="company-heading exp-reveal" id="process-heading">
            Getting help is simple.
          </h2>
        </div>
        <p>
          Three straightforward steps.
          <br /> Clear information from the start.
        </p>
      </div>
      <div
        className="process-tabs"
        role="tablist"
        aria-label="Steps to getting towing help"
      >
        {serviceSteps.map((item, index) => (
          <button
            key={item.title}
            role="tab"
            id={`process-tab-${index}`}
            aria-selected={active === index}
            aria-controls="process-panel"
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={keydown}
          >
            <span className="process-number">0{index + 1}</span>
            <span className="process-tab-copy">
              <strong>{item.title}</strong>
              <span>{item.short}</span>
            </span>
            <Icon name="right" />
          </button>
        ))}
      </div>
      <div
        className="process-detail"
        id="process-panel"
        role="tabpanel"
        aria-labelledby={`process-tab-${active}`}
        tabIndex={0}
      >
        <div className="process-detail-main" ref={panel}>
          <div className="process-detail-icon">
            <Icon name={step.icon} />
          </div>
          <div className="process-detail-copy">
            <span className="practical-eyebrow">STEP 0{active + 1} OF 03</span>
            <h3>{step.heading}</h3>
            <p>{step.text}</p>
            <EditorialLink href={business.phoneHref}>
              {step.action}
            </EditorialLink>
          </div>
          <aside className="process-checklist" aria-label="What to have ready">
            <span className="practical-eyebrow">
              {active === 0
                ? "HAVE THESE DETAILS READY"
                : active === 1
                  ? "WHAT WE’LL CONFIRM"
                  : "WHAT HAPPENS NEXT"}
            </span>
            <ul>
              {step.checklist.map((item) => (
                <li key={item}>
                  <Icon name="check" />
                  {item}
                </li>
              ))}
            </ul>
            <p>{step.note}</p>
          </aside>
        </div>
      </div>
      <div className="process-bottom">
        <Icon name="phone" />
        <span>
          Need help now? Start with your location. We’ll take it from there.
        </span>
        <a href="#contact">
          Get in touch <Icon name="right" />
        </a>
      </div>
    </section>
  );
}

function ServiceAreas() {
  const [active, setActive] = useState(0);
  const area = { ...areas[active], ...areas[active].home };
  const keydown = (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? areas.length - 1
          : (active + (event.key === "ArrowRight" ? 1 : -1) + areas.length) %
            areas.length;
    setActive(next);
    document.getElementById(`territory-tab-${areas[next].id}`)?.focus();
  };
  return (
    <section
      className="service-areas"
      id="coverage"
      aria-labelledby="coverage-heading"
    >
      <div className="practical-section-heading">
        <div>
          <Chapter number="04">WHERE WE GO</Chapter>
          <h2 className="company-heading exp-reveal" id="coverage-heading">
            Prince George.
            <br />
            <span>And the roads beyond.</span>
          </h2>
        </div>
        <p>
          In town or along the highway.
          <br /> Choose your area to see how we can help.
        </p>
      </div>
      <div className="coverage-layout">
        <CoverageMap active={active} onSelect={setActive} />
        <div className="coverage-card">
          <div
            className="coverage-tabs"
            role="tablist"
            aria-label="Explore service areas"
          >
            {areas.map((item, index) => (
              <button
                key={item.id}
                role="tab"
                id={`territory-tab-${item.id}`}
                aria-controls="territory-panel"
                aria-selected={active === index}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={keydown}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div
            className="coverage-info"
            id="territory-panel"
            role="tabpanel"
            aria-labelledby={`territory-tab-${area.id}`}
            tabIndex={0}
          >
            <span className="coverage-area-label">
              <Icon name="pin" />
              {active === 0
                ? "LOCAL SERVICE"
                : `${area.bearing} OF PRINCE GEORGE`}
            </span>
            <h3>{area.name}</h3>
            <strong>{area.route}</strong>
            <p>{area.detail}</p>
            <EditorialLink className="company-button" href={business.phoneHref}>
              Check service availability
            </EditorialLink>
          </div>
          <div className="coverage-note">
            <Icon name="locate" />
            <p>
              Outside these areas? Share your pickup point and destination so we
              can confirm availability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldNotes() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const filtered = faqs
    .map((faq, index) => ({ faq, index }))
    .filter(({ faq }) =>
      faq.join(" ").toLowerCase().includes(query.toLowerCase()),
    );
  const selected = filtered.some((item) => item.index === active)
    ? active
    : filtered[0]?.index;
  return (
    <section className="field-notes" id="faq">
      <div className="notes-heading">
        <Chapter number="05">A FEW THINGS WORTH KNOWING</Chapter>
        <h2 className="editorial-heading exp-reveal">Roadside questions.</h2>
        <span className="notes-edition">
          THE PRACTICAL STUFF
          <br />
          BEFORE YOU CALL
        </span>
      </div>
      <div className="notes-layout">
        <div className="notes-index">
          <label className="notes-search">
            <span className="sr-only">Search roadside questions</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="6" />
              <path d="m15 15 6 6" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What’s on your mind?"
            />
          </label>
          <div className="notes-questions">
            {filtered.map(({ faq, index }) => (
              <button
                key={faq[0]}
                aria-pressed={selected === index}
                aria-controls="field-answer"
                onClick={() => {
                  setActive(index);
                  if (window.matchMedia("(max-width: 600px)").matches) {
                    requestAnimationFrame(() =>
                      document.getElementById("field-answer")?.scrollIntoView({
                        behavior: window.matchMedia(
                          "(prefers-reduced-motion: reduce)",
                        ).matches
                          ? "instant"
                          : "smooth",
                        block: "center",
                      }),
                    );
                  }
                }}
              >
                <span>0{index + 1}</span>
                <span>{faq[0]}</span>
                <Icon name="arrow" />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="notes-empty">
                No notes found. Try “tow”, “battery”, or “cost”, or talk to us
                directly.
              </p>
            )}
          </div>
        </div>
        <div className="field-answer" id="field-answer" aria-live="polite">
          {selected !== undefined ? (
            <>
              <div className="answer-top">
                <span>HELPFUL INFORMATION</span>
                <span>NOTE / 0{selected + 1}</span>
              </div>
              <span className="answer-symbol" aria-hidden="true">
                ↗
              </span>
              <h3>{faqs[selected][0]}</h3>
              <p>{faqs[selected][1]}</p>
              <div className="answer-safety">
                <strong>Stay safe while waiting for help</strong>
                <p>
                  If your vehicle breaks down, move to a safe location if
                  possible and turn on your hazard lights. Avoid standing near
                  traffic and keep your phone available so you can communicate
                  with our team when we arrive. A few simple steps can make a
                  difference.
                </p>
              </div>
              <div className="answer-bottom">
                <span>A LITTLE CLARITY GOES A LONG WAY.</span>
                <span>PG.</span>
              </div>
            </>
          ) : (
            <>
              <div className="answer-top">
                <span>LET’S TALK IT THROUGH</span>
              </div>
              <h3>
                Some questions
                <br />
                need <em>a person.</em>
              </h3>
              <p>
                Every roadside situation is different. Tell us yours, and we’ll
                help you work out the next step.
              </p>
              <EditorialLink href={business.phoneHref}>
                Start a conversation
              </EditorialLink>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactChapter() {
  return (
    <section className="contact-chapter" id="contact">
      <div className="contact-top">
        <span className="contact-cross" aria-hidden="true">
          +
        </span>
        <span className="micro-copy">
          A BETTER ENDING
          <br />
          STARTS WITH A CONVERSATION.
        </span>
        <span className="contact-availability">
          <span /> DAY OR NIGHT
        </span>
      </div>
      <div className="contact-heading">
        <span className="contact-prelude">Wherever you’ve stopped.</span>
        <h2 className="exp-reveal">
          Need a tow?
          <br />
          We can help.
        </h2>
      </div>
      <div className="contact-desk">
        <div className="desk-label">
          <span className="desk-dot" />
          <span>YOUR NEXT MOVE</span>
        </div>
        <div className="desk-number">
          <span>Call dispatch, day or night</span>
          <a href={business.phoneHref}>{business.phone}</a>
        </div>
        <a href={business.phoneHref}>
          Let’s get you moving{" "}
          <span>
            <Icon name="phone" />
          </span>
        </a>
      </div>
      <div className="contact-afterword">
        <p>
          No perfect explanation needed.
          <br />
          Just tell us what happened.
        </p>
        <span>
          PRINCE GEORGE, BRITISH COLUMBIA
          <br />
          53.9171° N / 122.7497° W
        </span>
      </div>
    </section>
  );
}

export function SiteFooter({ homePrefix = "" }) {
  return (
    <footer className="site-footer-new">
      <div className="footer-directory">
        <a
          className="footer-monogram"
          href="#home"
          aria-label="Prince George Towing, back to top"
        >
          <img
            src="/images/brand-mark.png"
            alt=""
            width="505"
            height="615"
          />
        </a>
        <div className="footer-address">
          <span className="console-label">PRINCE GEORGE TOWING</span>
          <p>
            {business.legalName}
            <br />
            Prince George, British Columbia
          </p>
          <span>Car and heavy-duty towing. Local recovery support.</span>
        </div>
        <div className="footer-links">
          <span className="console-label">QUICK LINKS</span>
          <a href="/about/">
            About us <Icon name="arrow" />
          </a>
          <a href="/services/">
            Our services <Icon name="arrow" />
          </a>
          <a href={`${homePrefix}#coverage`}>
            Service areas <Icon name="arrow" />
          </a>
          <a href={`${homePrefix}#faq`}>
            Common questions <Icon name="arrow" />
          </a>
          <a href="/contact/">
            Contact <Icon name="arrow" />
          </a>
          <a href={business.mapsUrl} target="_blank" rel="noopener">
            Find us on Google <Icon name="arrow" />
          </a>
        </div>
        <div className="footer-contact">
          <span className="console-label">WHEN YOU NEED US</span>
          <a href={business.phoneHref}>{business.phone}</a>
          <p>
            Your way forward
            <br />
            is our reason for being here.
          </p>
        </div>
      </div>
      <div className="footer-colophon">
        <span>
          © {new Date().getFullYear()} {business.legalName.toUpperCase()}
        </span>
        <span>FOR THE ROAD. FOR THE PEOPLE.</span>
        <a href="#home">
          BACK TO THE TOP <Icon name="arrow" />
        </a>
      </div>
    </footer>
  );
}

export default function Experience({ onService }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils.toArray(".exp-reveal").forEach((el) =>
          gsap.from(el, {
            y: 35,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 91%", once: true },
          }),
        );
      },
      root,
    );
    return () => mm.revert();
  }, []);
  return (
    <div className="new-experience" ref={root}>
      <CompanyIntro onService={onService} />
      <ServiceShowcase onService={onService} />
      <ServiceProcess />
      <ServiceAreas />
      <FieldNotes />
      <ContactChapter />
    </div>
  );
}
