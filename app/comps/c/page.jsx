import React from "react";
import logo from "@/public/assets/img/b4w-logo.svg";
import { catalogue } from "../data";

export const metadata = { title: "Comp C — The shelf", robots: { index: false } };

// COMP C — "The shelf".
// Every other supplier in this industry is a dark page with neon on it. This
// one is a bright catalogue: the games photographed like products on a shelf,
// each object standing proud of its card, and the size of the range stated as
// one enormous number. Royal blue from the logo is the only colour the page
// adds; everything else is the art.
const INK = "#0d1033";
const ROYAL = "#2f4ff0";
const PAPER = "#f2f4f8";

export default function CompC() {
  return (
    <div className="font-Text antialiased" style={{ background: PAPER, color: INK }}>
      <nav className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-6 md:px-12">
        <img src={logo.src} alt="Bet4.win" className="h-8 w-auto" />
        <div className="hidden items-center gap-9 text-[16px] font-semibold lg:flex">
          {["Games", "Platform", "Provably fair", "Branding", "News"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <span
          className="rounded-md px-4 py-2.5 text-[15px] font-bold text-white"
          style={{ background: ROYAL }}
        >
          Book a demo
        </span>
      </nav>

      <header className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 pb-8 pt-6 md:flex-row md:items-end md:gap-10 md:px-12 md:pb-14 md:pt-12">
        <span
          aria-hidden="true"
          className="font-Display font-black leading-[0.78] tracking-[-0.06em]"
          style={{ fontStretch: "125%", fontSize: "min(26vw, 330px)", color: ROYAL }}
        >
          {catalogue.length}
        </span>
        <div className="flex flex-col gap-5 pb-3 md:pb-6">
          <h1
            className="!mb-0 font-Display font-black leading-[0.95] tracking-[-0.03em]"
            style={{ fontStretch: "125%", fontSize: "min(4.6vw, 62px)", color: INK }}
          >
            <span className="sr-only">{catalogue.length} </span>
            provably fair originals, on one integration.
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="!mb-0 max-w-[28rem] text-[18px] leading-[1.45]">
              Built in-house, branded as yours, and a new one every month.
            </p>
            <span
              className="rounded-md px-5 py-3 text-[16px] font-bold text-white"
              style={{ background: ROYAL }}
            >
              Book a demo
            </span>
          </div>
        </div>
      </header>

      {/* The shelf. Each object is pulled up out of its card so the range reads
          as things you could pick up rather than tiles you could click. */}
      <ul className="!mb-0 mx-auto grid max-w-[1320px] list-none grid-cols-2 gap-x-5 gap-y-16 px-6 pb-24 pt-16 sm:grid-cols-3 md:px-12 lg:grid-cols-5">
        {catalogue.map((g) => (
          <li key={g.slug} className="group relative">
            <div className="flex h-full flex-col rounded-2xl bg-white px-5 pb-5 pt-0 shadow-[0_1px_0_rgba(13,16,51,0.06),0_12px_30px_-18px_rgba(13,16,51,0.35)] transition-shadow duration-300 group-hover:shadow-[0_1px_0_rgba(13,16,51,0.06),0_22px_40px_-18px_rgba(13,16,51,0.45)]">
              <div className="relative -mt-12 mb-3 flex h-[170px] items-end justify-center">
                <img
                  src={g.art}
                  alt=""
                  className="max-h-full max-w-[92%] object-contain transition-transform duration-300 group-hover:-translate-y-1.5"
                  style={{ filter: "drop-shadow(0 14px 12px rgba(13,16,51,0.28))" }}
                />
              </div>
              <h2 className="!mb-0 text-[19px] font-bold !leading-tight" style={{ color: INK }}>
                {g.title}
              </h2>
              <p className="!mb-0 mt-1 text-[14px]" style={{ color: "#5b6180" }}>
                {g.category}
                {g.rtp ? ` · RTP ${g.rtp}` : ""}
              </p>
              <p
                className="b4w-figure !mb-0 mt-auto pt-4 text-[24px] font-black leading-none"
                style={{ color: ROYAL }}
              >
                {g.max ?? <span className="text-[17px]">Set per operator</span>}
              </p>
              <p className="!mb-0 mt-1 text-[13px] font-semibold" style={{ color: "#5b6180" }}>
                max win
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
