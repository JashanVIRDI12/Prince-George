import React, { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { areas, business, contactFaqs, services } from "./data";
import { heroImages } from "./heroImages";
import { additionalServices } from "./additionalServices";
import "./contact-page.css";

const ZONE = "America/Vancouver";
const RING = 2 * Math.PI * 42;

const checklist = [
  {
    title: "Where you are",
    text: "Share your location, highway, intersection, or nearest landmark. If you are on the road, your direction of travel helps us find you faster.",
    note: "IF YOU ARE IN DANGER, CALL 911 FIRST.",
  },
  {
    title: "What you drive",
    text: "Tell us the vehicle type, make, and model. For buses, semi trucks, RVs, or equipment, share the approximate size, weight, and load if available.",
    note: "HAVE A SPARE OR EXTRA DETAILS? LET US KNOW.",
  },
  {
    title: "What happened",
    text: "Explain what stopped you, whether it is a breakdown, flat tire, accident, recovery situation, or another issue.",
    note: "A ROUGH DESCRIPTION IS ENOUGH TO START.",
  },
  {
    title: "Where it needs to go",
    text: "Tell us the destination, whether it is a repair shop, home, yard, or another location. We will discuss the right option before moving forward.",
    note: "WE WILL CONFIRM THE NEXT STEP BEFORE WE MOVE.",
  },
];

const serviceNotes = {
  towing: {
    label: "CARS, SUVS, PICKUPS & VANS",
    heading: "When your vehicle can’t move.",
    copy: "From a car that won’t start to a pickup off the road, tell us where your vehicle is and where it needs to go. We’ll help arrange the right equipment and next step.",
    items: ["Pickup location", "Vehicle condition", "Destination"],
    action: "Request service",
    image: "/images/fleet-heavy-equipment.webp",
    imageAlt: "Prince George Towing’s heavy recovery wrecker and lifting equipment",
    imageCaption: "VEHICLE RECOVERY / THE DETAILS MATTER",
  },
  roadside: {
    label: "ROADSIDE ASSISTANCE",
    heading: "A little help. A big difference.",
    copy: "A dead battery, flat tire, lockout, or empty tank can stop your day. Tell us what happened and where you are, and we’ll help figure out the right roadside solution.",
    items: ["Exact location", "Vehicle make & model", "What happened"],
    action: "Request help",
    image: "/images/fleet-roadside.webp",
    imageAlt: "A roadside technician beside Prince George Towing’s white and burgundy recovery truck",
    imageCaption: "ROADSIDE HELP",
  },
  heavy: {
    label: "BUSES, TRUCKS & EQUIPMENT",
    heading: "The right plan for the load.",
    copy: "A disabled bus or semi truck, or equipment that needs moving, calls for the right transport plan. Share the vehicle or equipment type, approximate weight, load details, and destination so we can prepare the right response.",
    items: ["Vehicle or equipment", "Approximate weight & size", "Route"],
    action: "Request help",
    image: "/images/fleet-coach.webp",
    imageAlt: "Prince George Towing’s white and burgundy recovery truck towing a passenger coach",
    imageCaption: "BUS & COACH TOWING",
  },
  ...Object.fromEntries(additionalServices.map((service) => [service.id, {
    label: service.category,
    heading: service.fieldHeading,
    copy: service.description,
    items: service.checklist,
    action: service.action,
    image: service.image,
    imageAlt: service.alt,
    imageCaption: service.imageLabel,
  }])),
};

function localTime(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const read = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
  return { hour: read("hour") % 24, minute: read("minute") };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function LocalClock() {
  const [time, setTime] = useState(() => localTime(new Date()));

  useEffect(() => {
    const update = () => setTime(localTime(new Date()));
    const timer = window.setInterval(update, 15000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const fraction = (time.hour * 60 + time.minute) / 1440;

  return (
    <div className="ct-dial" role="group" aria-label="Local time in Prince George">
      <svg className="ct-dial-face" viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ct-dial-track" cx="60" cy="60" r="42" />
        <circle
          className="ct-dial-arc"
          cx="60"
          cy="60"
          r="42"
          strokeDasharray={RING}
          strokeDashoffset={RING * (1 - fraction)}
        />
        <circle className="ct-dial-point" cx="60" cy="18" r="3" />
        <text className="ct-dial-read" x="60" y="65">
          <tspan className="ct-dial-digits">{pad(time.hour)}</tspan>
          <tspan className="ct-dial-colon">:</tspan>
          <tspan className="ct-dial-digits">{pad(time.minute)}</tspan>
        </text>
      </svg>
      <span className="ct-dial-caption">LOCAL TIME<br />PRINCE GEORGE, BC</span>
    </div>
  );
}

function FaqRow({ index, question, answer, open, onToggle }) {
  return (
    <div className={"ct-faq-row" + (open ? " is-open" : "")}>
      <h3>
        <button
          id={"ct-q-" + index}
          type="button"
          aria-expanded={open}
          aria-controls={"ct-a-" + index}
          onClick={onToggle}
        >
          <span className="ct-faq-index">{pad(index + 1)}</span>
          <span className="ct-faq-question">{question}</span>
          <span className="ct-faq-mark" aria-hidden="true"><Icon name={open ? "close" : "plus"} /></span>
        </button>
      </h3>
      <div
        id={"ct-a-" + index}
        className="ct-faq-body"
        role="region"
        aria-labelledby={"ct-q-" + index}
        hidden={!open}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [selected, setSelected] = useState("heavy");
  const [openFaq, setOpenFaq] = useState(0);
  const tabs = useRef([]);
  const selectedNote = serviceNotes[selected];

  const onTabKeyDown = (event, index) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? services.length - 1 : (index + direction + services.length) % services.length;
    setSelected(services[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <div className="contact-page ct">
      <section className="ct-hero" id="home" aria-labelledby="contact-title">
        <div className="ct-hero-top">
          <nav className="ct-crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><Icon name="right" /><span aria-current="page">Contact</span>
          </nav>
          <span className="ct-status"><i aria-hidden="true" />24/7. EVERY DAY.</span>
        </div>

        <div className="ct-hero-grid">
          <div className="ct-hero-copy">
            <span className="ct-eyebrow">TOWING & ROADSIDE HELP / PRINCE GEORGE, BC</span>
            <h1 id="contact-title" className="ct-title">Need a tow? <br /><em>Let's get you moving.</em></h1>
            <p className="ct-lede">Need car towing, heavy-duty recovery, heavy equipment moved, or a truck offloaded? Tell us where you are and what needs moving. We’ll help figure out the right service for your situation.</p>
            <a className="ct-hero-number" href={business.phoneHref}>
              <span>CALL DISPATCH, 24/7</span>
              <strong><Icon name="phone" />{business.phone}</strong>
            </a>
            <div className="ct-hero-actions">
              <a className="ct-primary" href={business.phoneHref}>Get in touch <Icon name="phone" /></a>
              <a className="ct-text-link" href="/services/">Explore our services <Icon name="arrow" /></a>
            </div>
            <span className="ct-hero-services">CARS <i /> HEAVY DUTY <i /> EQUIPMENT <i /> OFFLOADING</span>
          </div>
          <figure className="ct-hero-media">
            <img {...heroImages.contact} alt="Prince George Towing’s white and burgundy heavy-duty recovery truck" width="1536" height="1024" fetchPriority="high" />
            <figcaption><span>CAR TO HEAVY-DUTY TOWING</span><span>READY FOR THE ROADS BEYOND TOWN</span></figcaption>
          </figure>
        </div>
        <aside className="ct-dispatch" aria-label="Dispatch contact">
          <div className="ct-dispatch-top">
            <span className="ct-eyebrow">DIRECT TO DISPATCH</span>
            <span className="ct-dispatch-live"><i aria-hidden="true" />24/7. EVERY DAY.</span>
          </div>
          <div className="ct-dispatch-main">
            <a className="ct-number-link" href={business.phoneHref}>
              <span className="ct-number-face">{business.phone}</span>
              <span className="ct-number-mark"><Icon name="phone" /></span>
            </a>
          </div>
          <div className="ct-dispatch-bottom"><LocalClock /></div>
        </aside>
        <div className="ct-hero-foot"><span>01 / START HERE</span><span>IF SOMEONE IS HURT OR IN DANGER, CALL 911 FIRST.</span></div>
      </section>

      <section className="ct-ready" id="before-you-call" aria-labelledby="ct-ready-title">
        <div className="ct-section-intro">
          <span className="ct-eyebrow">02 / BEFORE YOU CALL</span>
          <div><h2 id="ct-ready-title">What kind of<br /><em>help do you need?</em></h2><p>Choose the situation that best matches what happened. We’ll help guide you toward the right service and next step.</p></div>
        </div>

        <div className="ct-selector">
          <div className="ct-selector-tabs" role="tablist" aria-label="Choose the help you need">
            {services.map((service, index) => (
              <button
                key={service.id}
                id={"ct-tab-" + service.id}
                ref={(node) => { tabs.current[index] = node; }}
                type="button"
                role="tab"
                aria-selected={selected === service.id}
                aria-controls="ct-service-panel"
                tabIndex={selected === service.id ? 0 : -1}
                onClick={() => setSelected(service.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span className="ct-tab-index">{pad(index + 1)}</span>
                <span>{service.title}</span>
                <Icon name="right" />
              </button>
            ))}
          </div>
          <div className="ct-selector-panel" id="ct-service-panel" role="tabpanel" aria-labelledby={"ct-tab-" + selected}>
            <figure className="ct-selector-media" key={selected}>
              <img src={selectedNote.image} alt={selectedNote.imageAlt} width="1536" height="1024" loading="lazy" />
              <figcaption>{selectedNote.imageCaption}</figcaption>
            </figure>
            <div className="ct-selector-copy">
              <span className="ct-eyebrow">{selectedNote.label}</span>
              <h3>{selectedNote.heading}</h3>
              <p>{selectedNote.copy}</p>
              <div className="ct-panel-needs"><span>GOOD TO HAVE</span>{selectedNote.items.map((item) => <span key={item}><Icon name="check" />{item}</span>)}</div>
              <a className="ct-panel-action" href={business.phoneHref}>{selectedNote.action} <Icon name="phone" /></a>
            </div>
          </div>
        </div>

        <div className="ct-checklist-head"><h3>Four things to tell us.</h3><p>A few details help us understand the situation and plan the right response. You do not need every answer before reaching out.</p></div>
        <ol className="ct-checklist">
          {checklist.map((item, index) => (
            <li className="ct-panel" key={item.title}>
              <span className="ct-panel-number">{pad(index + 1)}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="ct-panel-note">{item.note}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="ct-reach" id="where-we-go" aria-labelledby="ct-reach-title">
        <div className="ct-reach-intro"><span className="ct-eyebrow">03 / WHERE WE GO</span><h2 id="ct-reach-title">In town.<br /><em>Out there.</em></h2><p>From city streets to the highways around Prince George, we help drivers find the right support when they need it. Tell us where you are, what happened, and what kind of vehicle needs help. We’ll confirm the next step.</p><a href="/#coverage" className="ct-map-link">Open the service-area map <Icon name="arrow" /></a><a href={business.mapsUrl} className="ct-map-link" target="_blank" rel="noopener">Find us on Google Maps <Icon name="arrow" /></a></div>
        <ul className="ct-reach-list">
          {areas.map((area, index) => (
            <li className="ct-reach-row" key={area.id}>
              <span className="ct-reach-bearing">{pad(index + 1)} / {area.bearing}</span>
              <span className="ct-reach-name">{area.name}</span>
              <span className="ct-reach-route">{area.route}</span>
              <p className="ct-reach-detail">{area.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="ct-faq" id="questions" aria-labelledby="ct-faq-title">
        <div className="ct-faq-intro"><span className="ct-eyebrow">04 / COMMON QUESTIONS</span><h2 id="ct-faq-title">The things<br />you might <em>ask.</em></h2><p>A few answers for the moment before you call.</p></div>
        <div className="ct-faq-list">
          {contactFaqs.map(([question, answer], index) => <FaqRow key={question} index={index} question={question} answer={answer} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? -1 : index)} />)}
        </div>
      </section>

      <section className="ct-close" aria-labelledby="ct-close-title">
        <div className="ct-close-copy">
          <span className="ct-eyebrow">READY WHEN YOU ARE</span>
          <h2 id="ct-close-title">Let's get you<br /><em>moving.</em></h2>
          <div className="ct-close-actions">
            <a className="ct-close-call" href={business.phoneHref}>Call {business.phone}<Icon name="phone" /></a>
            <p>One call starts the conversation.</p>
          </div>
        </div>
        <figure className="ct-close-media"><img src="/images/fleet-recovery-detail.webp" alt="An operator inspecting the rigging on Prince George Towing’s white and burgundy heavy recovery truck" width="1536" height="1024" loading="lazy" /></figure>
        <div className="ct-close-foot"><a href="/services/">Our services <Icon name="right" /></a><a href="/about/">About us <Icon name="right" /></a><a href="/#coverage">Service areas <Icon name="right" /></a><a href={business.mapsUrl} target="_blank" rel="noopener">Google Maps <Icon name="right" /></a></div>
      </section>
    </div>
  );
}
