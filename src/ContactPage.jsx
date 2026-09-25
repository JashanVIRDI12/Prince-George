import React, { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { areas, business, faqs, services } from "./data";
import "./contact-page.css";

const ZONE = "America/Vancouver";
const RING = 2 * Math.PI * 42;

const checklist = [
  {
    title: "Where you are",
    text: "A street, highway marker, intersection, or landmark. On a highway, your direction of travel helps too.",
    note: "IF ANYONE IS HURT OR IN DANGER, CALL 911 FIRST.",
  },
  {
    title: "What you drive",
    text: "Make and model, plus whether it still rolls, steers, and brakes. For a larger vehicle, add its rough weight and size.",
    note: "HAVE A SPARE? LET US KNOW.",
  },
  {
    title: "What happened",
    text: "A flat, a dead battery, a lockout, or a vehicle off the road. It is fine if you are not sure yet.",
    note: "NOT SURE IS A COMPLETE ANSWER.",
  },
  {
    title: "Where it needs to go",
    text: "A shop, home, or somewhere you have not decided yet. We can talk through the options and cost before anything moves.",
    note: "A PRICE BEFORE THE WINCH MOVES.",
  },
];

const serviceNotes = {
  towing: {
    label: "TOWING & RECOVERY",
    heading: "Your vehicle needs a lift.",
    copy: "Whether it broke down or left the road, tell us where it is and where you want it to go. We will talk through the equipment and cost with you.",
    items: ["Pickup location", "Vehicle condition", "Destination"],
    image: "/images/recovery-detail.webp",
    imageAlt: "A recovery worker securing a vehicle to a flatbed tow truck",
    imageCaption: "FLATBED RECOVERY / THE DETAILS MATTER",
  },
  roadside: {
    label: "ROADSIDE ASSISTANCE",
    heading: "A little help can go a long way.",
    copy: "For a battery boost, tire change, lockout, or fuel delivery, tell us what happened and what you drive. A usable spare matters for a tire change.",
    items: ["Exact location", "Vehicle make & model", "What happened"],
    image: "/images/roadside-detail.webp",
    imageAlt: "A roadside worker connecting a battery booster to a vehicle",
    imageCaption: "ROADSIDE HELP / RIGHT WHERE YOU ARE",
  },
  heavy: {
    label: "HEAVY-DUTY HAULING",
    heading: "Tell us about the load.",
    copy: "For a truck, RV, or commercial vehicle, approximate weight and dimensions help us confirm the right transport option and availability.",
    items: ["Vehicle or equipment", "Rough weight & size", "Route"],
    image: "/images/heavy-recovery.webp",
    imageAlt: "A heavy recovery truck towing a commercial vehicle",
    imageCaption: "HEAVY RECOVERY / EQUIPMENT FOR THE JOB",
  },
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

export default function ContactPage({ onHelp }) {
  const [selected, setSelected] = useState("towing");
  const [openFaq, setOpenFaq] = useState(0);
  const tabs = useRef([]);
  const hasNumber = Boolean(business.phone);
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
            <h1 id="contact-title" className="ct-title">Need a tow? <br /><em>We're on it.</em></h1>
            <p className="ct-lede">Broken down, off the road, or just stuck? Tell us where you are and what you drive. We will help you work out the next move.</p>
            <div className="ct-hero-actions">
              {hasNumber ? <a className="ct-primary" href={business.phoneHref}>Call for a tow <Icon name="phone" /></a> : <button className="ct-primary" type="button" onClick={() => onHelp("towing")}>Prepare a tow request <Icon name="arrow" /></button>}
              {hasNumber && <button className="ct-text-link" type="button" onClick={() => onHelp("towing")}>Prepare details <Icon name="arrow" /></button>}
              <a className="ct-text-link" href="#before-you-call">Choose a service <Icon name="down" /></a>
            </div>
            <span className="ct-hero-services">FLATBED TOWING <i /> ROADSIDE ASSISTANCE <i /> HEAVY RECOVERY</span>
          </div>
          <figure className="ct-hero-media">
            <img src="/images/northern-road-recovery.webp" alt="A tow truck carrying an SUV on a northern road" width="1536" height="1024" fetchPriority="high" />
            <figcaption><span>01 / TOWING & RECOVERY</span><span>READY FOR THE ROADS BEYOND TOWN</span></figcaption>
          </figure>
        </div>
        <aside className="ct-dispatch" aria-label="Dispatch contact">
          <div className="ct-dispatch-top">
            <span className="ct-eyebrow">DIRECT TO DISPATCH</span>
            <span className="ct-dispatch-live"><i aria-hidden="true" />24/7. EVERY DAY.</span>
          </div>
          <div className="ct-dispatch-main">
            {hasNumber ? (
              <a className="ct-number-link" href={business.phoneHref}>
                <span className="ct-number-face">{business.phone}</span>
                <span className="ct-number-mark"><Icon name="phone" /></span>
              </a>
            ) : (
              <div className="ct-number-empty">
                <span className="ct-number-face">Number pending</span>
                <p className="ct-preview-notice">This is a website preview. The dispatch number has not been configured yet.</p>
              </div>
            )}
          </div>
          <div className="ct-dispatch-bottom"><LocalClock /></div>
        </aside>
        <div className="ct-hero-foot"><span>01 / START HERE</span><span>IF SOMEONE IS HURT OR IN DANGER, CALL 911 FIRST.</span></div>
      </section>

      <section className="ct-ready" id="before-you-call" aria-labelledby="ct-ready-title">
        <div className="ct-section-intro">
          <span className="ct-eyebrow">02 / BEFORE YOU CALL</span>
          <div><h2 id="ct-ready-title">What kind of<br /><em>help?</em></h2><p>Choose what sounds closest to your situation. We will help you find the right next step.</p></div>
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
              <button type="button" className="ct-panel-action" onClick={() => onHelp(selected)}>Prepare a {selected === "roadside" ? "roadside" : selected === "heavy" ? "heavy-duty" : "towing"} request <Icon name="arrow" /></button>
            </div>
          </div>
        </div>

        <div className="ct-checklist-head"><h3>Four things to tell us.</h3><p>Rough answers are enough. You do not need to have every detail worked out.</p></div>
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
        <div className="ct-reach-intro"><span className="ct-eyebrow">03 / WHERE WE GO</span><h2 id="ct-reach-title">In town.<br /><em>Out there.</em></h2><p>Coverage depends on your exact location and the equipment you need. Tell us the last thing you passed and we will confirm what is possible.</p><a href="/#coverage" className="ct-map-link">Open the service-area map <Icon name="arrow" /></a></div>
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
          {faqs.map(([question, answer], index) => <FaqRow key={question} index={index} question={question} answer={answer} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? -1 : index)} />)}
        </div>
      </section>

      <section className="ct-close" aria-labelledby="ct-close-title">
        <div className="ct-close-copy">
          <span className="ct-eyebrow">READY WHEN YOU ARE</span>
          <h2 id="ct-close-title">Let's get you<br /><em>moving.</em></h2>
          <div className="ct-close-actions">
            {hasNumber ? <a className="ct-close-call" href={business.phoneHref}>Call {business.phone}<Icon name="phone" /></a> : <button className="ct-close-call" type="button" onClick={() => onHelp("towing")}>Prepare your details<Icon name="arrow" /></button>}
            <p>{hasNumber ? "One call starts the conversation." : "The dispatch number is not configured in this preview. You can still prepare your details."}</p>
          </div>
        </div>
        <figure className="ct-close-media"><img src="/images/about-road-crew.webp" alt="A recovery worker securing a vehicle on a flatbed tow truck" width="1536" height="1024" loading="lazy" /></figure>
        <div className="ct-close-foot"><a href="/services/">Our services <Icon name="right" /></a><a href="/about/">About us <Icon name="right" /></a><a href="/#coverage">Service areas <Icon name="right" /></a></div>
      </section>
    </div>
  );
}
