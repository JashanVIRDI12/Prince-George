import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Icon } from "./icons";

function RecoveryTruckFigure() {
  return (
    <svg viewBox="0 0 240 120" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        {/* Passenger vehicle on the flatbed. Filled shapes stay legible at small sizes. */}
        <path d="M24 59h8l15-19h57l18 19h12v13H24z" />
        <rect x="15" y="74" width="139" height="9" rx="2" />
        <path d="M18 82h143v13H18z" />
        {/* Flatbed cab and bumper. */}
        <path d="M154 46h39l28 28v21h-67z" />
        <rect x="217" y="83" width="12" height="11" rx="2" />
        <rect x="13" y="90" width="216" height="6" rx="2" />
        {/* Tires and hubs. */}
        <circle cx="49" cy="95" r="15" />
        <circle cx="89" cy="95" r="15" />
        <circle cx="191" cy="95" r="15" />
      </g>
      <g fill="#12396d">
        <path d="M52 46h22v13H42zM79 46h21l12 13H79z" />
        <path d="M164 54h25l20 20h-45z" />
        <circle cx="49" cy="95" r="8" />
        <circle cx="89" cy="95" r="8" />
        <circle cx="191" cy="95" r="8" />
      </g>
      <g fill="currentColor">
        <circle cx="49" cy="95" r="3" />
        <circle cx="89" cy="95" r="3" />
        <circle cx="191" cy="95" r="3" />
      </g>
    </svg>
  );
}

const recoverySteps = [
  {
    title: "Tell us where",
    label: "YOUR LOCATION",
    icon: "pin",
    text: "Start with your location, vehicle, and what happened. A landmark or highway marker helps us understand where you are.",
    detail: "Location · Vehicle · Situation",
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

export function RecoveryWalkthrough({ onHelp }) {
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
        <button
          className="svc-button svc-button-orange"
          onClick={(event) => {
            event.currentTarget.focus();
            onHelp();
          }}
        >
          <span>Let’s make your plan</span>
          <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}
