import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Icon } from "./icons";
import { business } from "./data";

function RecoveryTruckFigure() {
  return (
    <svg viewBox="0 0 240 120" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        {/* Coach behind a heavy wrecker, connected by an underlift. */}
        <path d="M8 33h107l10 13v43H8z" />
        <path d="M122 83h28v7h-28zM146 68h44v27h-44z" />
        <path d="M156 68V45h8v23zM160 44l23 18-5 6-24-20z" />
        <path d="M190 44h24l18 27v24h-42z" />
        <rect x="230" y="84" width="7" height="11" rx="2" />
        <circle cx="29" cy="91" r="12" />
        <circle cx="101" cy="89" r="12" />
        <circle cx="155" cy="95" r="13" />
        <circle cx="179" cy="95" r="13" />
        <circle cx="219" cy="95" r="13" />
      </g>
      <g fill="#12396d">
        <path d="M17 42h16v22H17zM38 42h16v22H38zM59 42h16v22H59zM80 42h16v22H80zM101 42h10l6 9v13h-16z" />
        <path d="M198 52h12l14 20h-26z" />
        {[ [29, 91], [101, 89], [155, 95], [179, 95], [219, 95] ].map(([x, y]) => <circle key={x} cx={x} cy={y} r="6" />)}
      </g>
    </svg>
  );
}

const recoverySteps = [
  {
    title: "Tell us where",
    label: "YOUR LOCATION",
    icon: "pin",
    text: "Start with your location, your vehicle, and what happened. A landmark or highway marker helps us understand where you are.",
    detail: "Location · Vehicle & load · Situation",
  },
  {
    title: "Make a plan",
    label: "THE RIGHT RESPONSE",
    icon: "shield",
    text: "We talk through the service, the right equipment, availability, and cost. You know the plan before arranging the job.",
    detail: "Equipment · Availability · Cost",
  },
  {
    title: "Get moving",
    label: "YOUR NEXT STOP",
    icon: "right",
    text: "Roadside assistance or transport to the agreed destination. The next step is planned around your vehicle and your situation.",
    detail: "Roadside help · Recovery · Transport",
  },
];

export function RecoveryWalkthrough() {
  const [step, setStep] = useState(0);
  const root = useRef(null);
  const current = recoverySteps[step];
  const initialized = useRef(false);

  useLayoutEffect(() => {
    const truck = root.current.querySelector(".recovery-truck-position");
    const progress = root.current.querySelector(".recovery-road-progress");
    const copy = root.current.querySelector(".recovery-step-copy");
    const targets = [truck, progress, copy];
    gsap.killTweensOf(targets);
    const animate =
      initialized.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate) {
      gsap.to(truck, {
        left: `${step * 50}%`,
        duration: 1.05,
        ease: "power3.inOut",
      });
      gsap.to(progress, {
        scaleX: step / 2,
        duration: 1.05,
        ease: "power3.inOut",
      });
      gsap.fromTo(
        copy,
        { y: 10, opacity: 0.25 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
      );
    } else {
      gsap.set(truck, { left: `${step * 50}%` });
      gsap.set(progress, { scaleX: step / 2 });
      gsap.set(copy, { y: 0, opacity: 1 });
    }
    initialized.current = true;
    return () => gsap.killTweensOf(targets);
  }, [step]);

  return (
    <section
      className="recovery-walkthrough"
      ref={root}
      aria-labelledby="recovery-walkthrough-title"
    >
      <div className="recovery-walkthrough-heading">
        <div>
          <span className="svc-eyebrow">A CLEAR PLAN FROM THE START</span>
          <h2 id="recovery-walkthrough-title">
            From roadside.
            <br />
            <span>To back on track.</span>
          </h2>
        </div>
        <p>
          Every situation is different.
          <br />
          The right support starts with understanding what you need.
        </p>
      </div>
      <div className="recovery-road-scene" aria-hidden="true">
        <div className="recovery-road-labels">
          <span>WHERE YOU ARE</span>
          <span>WHERE YOU NEED TO GO</span>
        </div>
        <div className="recovery-road-illustration">
          <div className="recovery-road-line" />
          <div className="recovery-road-progress" />
          <div className="recovery-truck-position">
            <div className="recovery-truck">
              <RecoveryTruckFigure />
              <span>PRINCE GEORGE TOWING</span>
            </div>
          </div>
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`recovery-road-stop ${index <= step ? "is-reached" : ""}`}
              style={{ left: `${index * 50}%` }}
            >
              0{index + 1}
            </span>
          ))}
        </div>
        <div className="recovery-scene-caption">
          <span>ILLUSTRATED SERVICE JOURNEY</span>
          <span>0{step + 1} / 03</span>
        </div>
      </div>
      <div className="recovery-controls">
        <div
          className="recovery-step-buttons"
          role="group"
          aria-label="Explore the recovery process"
        >
          {recoverySteps.map((item, index) => (
            <button
              key={item.title}
              aria-pressed={step === index}
              aria-controls="recovery-step-details"
              onClick={() => setStep(index)}
            >
              <span>0{index + 1}</span>
              <strong>{item.title}</strong>
              <Icon name={item.icon} />
            </button>
          ))}
        </div>
        <label className="recovery-scrubber">
          <span>Slide through the steps</span>
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={step}
            aria-label="Recovery walkthrough step"
            aria-valuetext={`Step ${step + 1}: ${current.title}`}
            onChange={(event) => setStep(Number(event.target.value))}
          />
          <span>0{step + 1} / 03</span>
        </label>
      </div>
      <div
        className="recovery-step-details"
        id="recovery-step-details"
        aria-live="polite"
      >
        <div className="recovery-step-copy">
          <span className="svc-eyebrow">{current.label}</span>
          <p>{current.text}</p>
          <span className="recovery-step-checks">{current.detail}</span>
        </div>
        <a className="svc-button svc-button-orange" href={business.phoneHref}>
          <span>Let’s make your plan</span>
          <Icon name="phone" />
        </a>
      </div>
    </section>
  );
}
