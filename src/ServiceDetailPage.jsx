import React from "react";
import { Icon } from "./icons";
import { serviceDetails } from "./serviceContent";
import { servicePageContent } from "./servicePageContent";
import "./service-detail.css";

export default function ServiceDetailPage({ id, onHelp }) {
  const service = serviceDetails.find((item) => item.id === id);
  const page = servicePageContent[id];
  if (!service || !page) return null;
  const related = serviceDetails.filter((item) => item.id !== id);
  const requestHelp = (event) => {
    event.currentTarget.focus({ preventScroll: true });
    onHelp(id);
  };

  return (
    <div className={`service-detail-page sd-${id}`}>
      <section className="sd-hero" id="home" aria-labelledby="sd-title">
        <img className="sd-hero-photo" src={page.heroImage} alt={page.heroAlt} width="1536" height="1024" fetchPriority="high" />
        <div className="sd-hero-inner">
          <nav className="sd-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><Icon name="right" /><a href="/services/">Services</a><Icon name="right" /><span aria-current="page">{service.title}</span>
          </nav>
          <div className="sd-hero-bottom">
            <div>
              <span className="sd-kicker"><i /> {service.number} / {service.category}</span>
              <h1 id="sd-title">{service.title}<span>.</span></h1>
              <p>{page.heroLead}</p>
              <div className="sd-hero-actions">
                <button type="button" className="sd-button sd-button-orange" onClick={requestHelp}>{service.action}<Icon name="arrow" /></button>
                <a href="#capabilities" className="sd-hero-link">Explore this service <Icon name="down" /></a>
              </div>
            </div>
            <span className="sd-hero-readout">PRINCE GEORGE / BC<br />SERVICE {service.number} OF 03</span>
          </div>
        </div>
      </section>

      <nav className="sd-jump" aria-label="On this page">
        <span>EXPLORE / {service.number}</span>
        <a href="#capabilities">What we can help with <Icon name="down" /></a>
        <a href="#before-call">Before you call <Icon name="down" /></a>
        <a href="#questions">Questions <Icon name="down" /></a>
      </nav>

      <section className="sd-intro" aria-labelledby="sd-intro-title">
        <div>
          <span className="sd-kicker">01 / THE SITUATION</span>
          <h2 id="sd-intro-title">{page.introHeading}</h2>
        </div>
        <p>{page.introCopy}</p>
      </section>

      <section className="sd-capabilities" id="capabilities" aria-labelledby="sd-capabilities-title">
        <div className="sd-section-heading">
          <div>
            <span className="sd-kicker">02 / THE RESPONSE</span>
            <h2 id="sd-capabilities-title">What we can help with<span>.</span></h2>
          </div>
          <p>{page.capabilityLead}</p>
        </div>
        <div className="sd-capability-list">
          {(page.features || service.features).map(([title, description], index) => (
            <details key={title}>
              <summary>
                <span className="sd-capability-number">0{index + 1}</span>
                <span className="sd-capability-title">{title}</span>
                <Icon name="plus" />
              </summary>
              <p>{description}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="sd-field" id="before-call" aria-labelledby="sd-field-title">
        <figure className="sd-field-photo">
          <img src={page.fieldImage} alt={page.fieldAlt} width="1536" height="1024" loading="lazy" />
          <figcaption><span>PRINCE GEORGE TOWING / ON THE JOB</span><span>{page.fieldCaption}</span></figcaption>
        </figure>
        <div className="sd-field-copy">
          <span className="sd-kicker">03 / BEFORE YOU CALL</span>
          <h2 id="sd-field-title">{page.fieldHeading}</h2>
          <p>{page.fieldCopy || service.prepare}</p>
          <ol className="sd-checklist">
            {page.steps.map(([title, description], index) => (
              <li key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{description}</p></div></li>
            ))}
          </ol>
          <button type="button" className="sd-button" onClick={requestHelp}>{service.action}<Icon name="arrow" /></button>
        </div>
      </section>

      <section className="sd-questions" id="questions" aria-labelledby="sd-questions-title">
        <div>
          <span className="sd-kicker">04 / GOOD TO KNOW</span>
          <h2 id="sd-questions-title">A few useful answers<span>.</span></h2>
          <p>Have a different question? Tell us what is happening with your vehicle.</p>
        </div>
        <div className="sd-question-list">
          {page.questions.map(([question, answer]) => (
            <details key={question}><summary>{question}<Icon name="plus" /></summary><p>{answer}</p></details>
          ))}
        </div>
      </section>

      <section className="sd-related" aria-labelledby="sd-related-title">
        <div className="sd-related-heading">
          <div><span className="sd-kicker">THE REST OF THE FLEET</span><h2 id="sd-related-title">Explore other services<span>.</span></h2></div>
          <a href="/services/">See all services <Icon name="arrow" /></a>
        </div>
        <div className="sd-related-grid">
          {related.map((item) => (
            <a key={item.id} href={item.path}>
              <img src={item.image} alt="" width="1536" height="1024" loading="lazy" />
              <span>{item.number} / {item.category}</span>
              <strong>{item.title}</strong>
              <Icon name="arrow" />
            </a>
          ))}
        </div>
      </section>

      <section className="sd-close" aria-labelledby="sd-close-title">
        <div><span className="sd-kicker">READY TO MAKE A PLAN?</span><h2 id="sd-close-title">Tell us where you are<span>.</span></h2><p>We’ll discuss the vehicle, the job, and what comes next.</p></div>
        <button type="button" className="sd-button sd-button-orange" onClick={requestHelp}>{service.action}<Icon name="arrow" /></button>
      </section>
    </div>
  );
}
