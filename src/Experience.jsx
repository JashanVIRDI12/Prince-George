import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services, areas, faqs, business } from "./data";
import { Icon } from "./icons";
import CoverageMap from "./CoverageMap";

gsap.registerPlugin(ScrollTrigger);

export const serviceVisuals = {
  towing: {
    src: "/images/recovery-detail.webp",
    alt: "Gloved hands securing a vehicle wheel to a recovery flatbed with an orange strap",
    title: (
      <>
        A careful lift.
        <br />
        <em>A fresh start.</em>
      </>
    ),
    category: "RECOVERY / TRANSPORT",
  },
  roadside: {
    src: "/images/roadside-detail.webp",
    alt: "A roadside professional connecting a jump starter beneath a vehicle hood",
    title: (
      <>
        A small fix.
        <br />
        <em>A big relief.</em>
      </>
    ),
    category: "ASSISTANCE / REPAIR",
  },
  heavy: {
    src: "/images/heavy-recovery.webp",
    alt: "Blue heavy-duty recovery truck transporting a semi truck on a northern highway",
    title: (
      <>
        Serious capability.
        <br />
        <em>Steady hands.</em>
      </>
    ),
    category: "COMMERCIAL / HEAVY DUTY",
  },
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

function CompanyIntro({ onHelp, onService }) {
  return (
    <section
      className="company-intro"
      id="about"
      aria-labelledby="company-heading"
    >
      <div className="company-photo exp-reveal">
        <img
          src="/images/northern-road-recovery.webp"
          alt="A blue flatbed tow truck carrying an SUV beside a northern highway"
          width="1536"
          height="1024"
          loading="lazy"
        />
        <div className="company-photo-caption">
          <Icon name="pin" />
          <span>PRINCE GEORGE, BC</span>
          <span className="photo-caption-line" />
          <span>LOCAL & LONG-DISTANCE</span>
        </div>
      </div>
      <div className="company-copy">
        <Chapter number="01">YOUR LOCAL TOWING COMPANY</Chapter>
        <h2 className="company-heading exp-reveal" id="company-heading">
          The right help.
          <br />
          <span>When you need it.</span>
        </h2>
        <p className="company-lead">
          Towing, recovery, and roadside assistance in Prince George and the
          surrounding area.
        </p>
        <p className="company-body">
          A breakdown is enough to deal with. Tell us where you are and what you
          drive. We’ll help you work out the next step, confirm the equipment,
          and talk through the cost.
        </p>
        <ul className="company-promises">
          <li>
            <Icon name="check" />
            <span>Help for cars, trucks, RVs, and commercial vehicles</span>
          </li>
          <li>
            <Icon name="check" />
            <span>Service and pricing discussed before the job</span>
          </li>
          <li>
            <Icon name="check" />
            <span>Transport to your chosen repair shop or destination</span>
          </li>
        </ul>
        <div className="company-actions">
          <EditorialLink className="company-button" onClick={() => onHelp()}>
            Get towing help
          </EditorialLink>
          <a className="company-secondary" href="/services/">
            Explore our services <Icon name="right" />
          </a>
          <a className="company-secondary" href="/about/">
            More about us <Icon name="right" />
          </a>
        </div>
      </div>
      <div className="company-service-strip">
        {[
          { id: "towing", icon: "shield", title: "Towing & recovery" },
          { id: "roadside", icon: "clock", title: "Roadside assistance" },
          { id: "towing", icon: "pin", title: "Local & long-distance" },
        ].map((item) => (
          <button
            key={item.title}
            onClick={(event) => {
              event.currentTarget.focus();
              onService(services.find((service) => service.id === item.id));
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

function ServiceShowcase({ onService, onHelp }) {
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
          ? 2
          : (active +
              (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1) +
              3) %
            3;
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
            Towing & recovery.
            <br />
            Roadside assistance.
          </h2>
        </div>
        <p>
          Different situations.
          <br />
          The same care, every time.
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
            <EditorialLink onClick={() => onHelp()}>
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
              <span>0{active + 1} — 03</span>
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
    heading: "A few details help us get it right.",
    text: "Start with where you are, what you drive, and the problem. A nearby intersection, highway marker, or landmark helps us find you.",
    checklist: [
      "Your location and a callback number",
      "Vehicle make, model, and condition",
      "What happened and where you need to go",
    ],
    note: "Not sure which service you need? Describe the problem and we’ll talk it through.",
    action: "Prepare your request",
  },
  {
    title: "Confirm the plan",
    short: "Understand the service, cost, and next step.",
    icon: "check",
    heading: "Know what to expect before we start.",
    text: "We discuss the right equipment, service availability, and pricing for your situation. Ask any questions before arranging the job.",
    checklist: [
      "The service and equipment your vehicle needs",
      "Pricing and any additional charges",
      "Availability and the pickup destination",
    ],
    note: "Arrival times depend on your location, road conditions, and equipment availability.",
    action: "Discuss your situation",
  },
  {
    title: "Get moving again",
    short: "Roadside help or transport to your destination.",
    icon: "right",
    heading: "The right solution for your vehicle.",
    text: "Some problems can be resolved at the roadside. If your vehicle needs a tow, we’ll arrange transport to the agreed repair shop or destination.",
    checklist: [
      "Roadside assistance where appropriate",
      "Vehicle recovery and loading for transport",
      "Delivery to the agreed destination",
    ],
    note: "Have any access restrictions or special vehicle requirements? Let us know before pickup.",
    action: "Get help with your vehicle",
  },
];

function ServiceProcess({ onHelp }) {
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
            <EditorialLink onClick={() => onHelp()}>
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

function ServiceAreas({ onHelp }) {
  const [active, setActive] = useState(0);
  const area = areas[active];
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
            <EditorialLink className="company-button" onClick={() => onHelp()}>
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

function FieldNotes({ onHelp }) {
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
              <EditorialLink onClick={() => onHelp()}>
                Start a conversation
              </EditorialLink>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactChapter({ onHelp }) {
  const [selected, setSelected] = useState("towing");
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
        <label>
          <span>I could use a hand with</span>
          <select
            aria-label="Choose help for your next move"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={(e) => {
            e.currentTarget.focus();
            onHelp(selected);
          }}
        >
          Let’s get you moving{" "}
          <span>
            <Icon name="arrow" />
          </span>
        </button>
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

export function SiteFooter({ onHelp, homePrefix = "" }) {
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
            Prince George Towing
            <br />
            Northern British Columbia
          </p>
          <span>Good people. Wherever the road goes.</span>
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
        </div>
        <div className="footer-contact">
          <span className="console-label">WHEN YOU NEED US</span>
          {business.phone ? (
            <a href={business.phoneHref}>{business.phone}</a>
          ) : (
            <button onClick={() => onHelp()}>
              Let’s talk.
              <Icon name="arrow" />
            </button>
          )}
          <p>
            Your way forward
            <br />
            is our reason for being here.
          </p>
        </div>
      </div>
      <div className="footer-colophon">
        <span>© {new Date().getFullYear()} PRINCE GEORGE TOWING</span>
        <span>FOR THE ROAD. FOR THE PEOPLE.</span>
        <a href="#home">
          BACK TO THE TOP <Icon name="arrow" />
        </a>
      </div>
    </footer>
  );
}

export default function Experience({ onHelp, onService }) {
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
      <CompanyIntro onHelp={onHelp} onService={onService} />
      <ServiceShowcase onService={onService} onHelp={onHelp} />
      <ServiceProcess onHelp={onHelp} />
      <ServiceAreas onHelp={onHelp} />
      <FieldNotes onHelp={onHelp} />
      <ContactChapter onHelp={onHelp} />
    </div>
  );
}
