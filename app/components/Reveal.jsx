import React from "react";

// Was a fade-and-rise on scroll. Every section arriving the same way is one of
// the clearest tells of a generated site, and it hid content from anyone who
// skimmed or screenshotted the page. Kept as a plain wrapper so the interior
// pages that still use it render exactly as before, minus the entrance.
export default function Reveal({ children, className = "", as: Tag = "div" }) {
  return <Tag className={className || undefined}>{children}</Tag>;
}
