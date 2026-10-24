"use client";
import React from "react";
import { useArrival } from "@/app/lib/motion";

// A server-rendered section that still gets an arrival (see useArrival).
export default function Arrive({ as: Tag = "div", children, ...rest }) {
  const ref = useArrival();
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
