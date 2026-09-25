import React from "react";

export function Icon({ name = "arrow", className = "", ...props }) {
  const paths = {
    arrow: (
      <>
        <path d="M5 19 19 5M5 5h14v14" />
      </>
    ),
    right: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    down: (
      <>
        <path d="M12 4v16m-6-6 6 6 6-6" />
      </>
    ),
    phone: (
      <path d="m8 3 3 5-3 3c2 3 3 4 6 6l3-3 4 3c0 3-2 5-5 4C9 19 5 15 3 8 2 5 5 3 8 3Z" />
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    plus: <path d="M5 12h14M12 5v14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    menu: <path d="M4 8h16M4 16h16" />,
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M16 8V3H3v13h5" />
      </>
    ),
    locate: (
      <>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
  };
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}

export function ServiceIcon({ type }) {
  return (
    <svg
      viewBox="0 0 180 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === "truck" ? (
        <>
          <path d="M17 68h146V50l-14-19h-37v37M112 52h43M125 31v21M19 58h85M21 52h82l-8-20H48L34 45H21v7ZM50 33v16h42M58 33l-8 16M26 59v9M104 59v9M18 74h12m21 0h70m22 0h21" />
          <circle cx="41" cy="72" r="11" />
          <circle cx="133" cy="72" r="11" />
          <circle cx="41" cy="72" r="4" />
          <circle cx="133" cy="72" r="4" />
          <path d="M14 83h156M115 24h19m-10-7v7M149 58h13" />
        </>
      ) : type === "battery" ? (
        <>
          <rect x="43" y="29" width="92" height="52" rx="4" />
          <path d="M54 29v-9h17v9m36 0v-9h17v9M56 48h15m-7-7v15m46-8h14M85 41l-9 20h16l-8 14 22-24H90l9-10M31 42H20V20h15m112 40h13v21h-13M35 88h111" />
          <path d="m23 14 9-8m8 10 2-10m108 17 9-6m-13-4 3-9" />
        </>
      ) : (
        <>
          <path d="M12 62h102V32H12v30ZM19 40h86m-86 8h86m-86 8h86M114 36h29l19 20v17h-15m-33 0H83M114 56h45m-30-19v19M13 73h11m21 0h15M7 84h164" />
          <circle cx="35" cy="72" r="10" />
          <circle cx="70" cy="72" r="10" />
          <circle cx="137" cy="72" r="10" />
          <circle cx="35" cy="72" r="3" />
          <circle cx="70" cy="72" r="3" />
          <circle cx="137" cy="72" r="3" />
          <path d="M118 28h22M123 22h11v6M155 62h8" />
        </>
      )}
    </svg>
  );
}

export function Brand({ footer = false, href = "#home" }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href={href}
      aria-label={
        href === "/"
          ? "Prince George Towing, home"
          : "Prince George Towing, back to top"
      }
    >
      <img
        className="brand-image"
        src="/images/brand-header.png"
        alt=""
        width="1890"
        height="615"
        decoding="async"
      />
    </a>
  );
}
