"use client";
import React, { useEffect, useRef, useState } from "react";
import { onceInView } from "@/app/lib/motion";

// Fades + lifts its children into place the first time they scroll into view.
//
// The hidden pre-reveal state lives behind `html.js` in globals.css, so if the
// script never runs the content is simply visible — an entrance animation must
// never be able to hide content permanently.
//
// Note the revealed state resets `transform` to `none` rather than
// `translateY(0)`: a lingering transform makes the element a containing block
// for `position: fixed` descendants, which would break the fullscreen game
// modal that lives inside <Games>.
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => onceInView(ref.current, () => setRevealed(true)), []);

  return (
    <Tag
      ref={ref}
      className={`b4w-reveal${revealed ? " is-revealed" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
